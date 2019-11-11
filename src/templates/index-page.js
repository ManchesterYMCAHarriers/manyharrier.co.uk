import React from 'react'
import PropTypes from 'prop-types'
import {graphql, Link} from 'gatsby'
import Moment from 'moment'

import Layout from '../components/Layout'
import EventBox from '../components/EventBox'
import Content, {HTMLContent} from '../components/Content'
import StandardContentContainer from '../components/StandardContentContainer'
import Hero from "../components/Hero";
import {Panel, Panels} from "../components/Panels";
import {Card} from "../components/Card";
import {CallToActionLink} from "../components/CallToAction";

export const IndexPageTemplate = ({
                                    contentComponent,
                                    title,
                                    intro,
                                    nextEvents,
                                    nextEventsDefault,
                                    eventsCalendarSlug,
                                    heroImage,
                                    firstPanelImage,
                                    firstPanelTitle,
                                    firstPanelBody,
                                    firstPanelLink,
                                    firstPanelCTA,
                                    secondPanelImage,
                                    secondPanelTitle,
                                    secondPanelBody,
                                    secondPanelLink,
                                    secondPanelCTA,
                                    activeChampionships,
                                    recentChampionships,
                                  }) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <Hero title={title} fluidImage={heroImage} />
      <div className="content bg-white p-4 mt-4 border-b-4 border-black-manyharrier"
           dangerouslySetInnerHTML={{__html: intro}} />
      <div className="bg-white p-4 mt-4 border-b-4 border-red-manyharrier">
        <h2 className="heading-2">Coming up...</h2>
        {nextEvents.length === 0 && (
          <div className="content"
               dangerouslySetInnerHTML={{__html: nextEventsDefault}} />
        )}
        <Panels className="mt-4">
          {nextEvents.map(({title, startsAt, slug, venue}, i) => (
            <Panel key={'next-event-' + i}>
              <EventBox
                title={title}
                startsAt={startsAt}
                slug={slug}
                venue={venue}
              />
            </Panel>
          ))}
        </Panels>
        <div className="content mt-4">
          <p>For a full list of what we've got coming up, check out our events calendar.</p>
        </div>
        <div className="text-right mt-4">
          <CallToActionLink to={eventsCalendarSlug} title={"Events calendar"} />
        </div>
      </div>
      <Panels>
        <Panel>
          <Card image={firstPanelImage} title={firstPanelTitle}
                callToAction={<CallToActionLink to={firstPanelLink}
                                                title={firstPanelCTA} />}
                borderColorClassName={`border-black-manyharrier`}>
            <div className="content"
                 dangerouslySetInnerHTML={{__html: firstPanelBody}} />
          </Card>
        </Panel>
        <Panel>
          <Card image={secondPanelImage} title={secondPanelTitle}
                callToAction={<CallToActionLink to={secondPanelLink}
                                                title={secondPanelCTA} />}
                borderColorClassName={`border-red-manyharrier`}>
            <div className="content"
                 dangerouslySetInnerHTML={{__html: secondPanelBody}} />
          </Card>
        </Panel>
      </Panels>
    </StandardContentContainer>
  )
}

IndexPageTemplate.propTypes = {
  contentComponent: PropTypes.func,
  title: PropTypes.string.isRequired,
  heroImage: PropTypes.object.isRequired,
  intro: PropTypes.node.isRequired,
  nextEvents: PropTypes.arrayOf(
    PropTypes.shape({
      startsAt: PropTypes.instanceOf(Moment).isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      venue: PropTypes.string.isRequired,
    })
  ),
  nextEventsDefault: PropTypes.node.isRequired,
  eventsCalendarSlug: PropTypes.string.isRequired,
  firstPanelImage: PropTypes.object,
  firstPanelTitle: PropTypes.string.isRequired,
  firstPanelBody: PropTypes.node.isRequired,
  firstPanelCTA: PropTypes.string.isRequired,
  secondPanelImage: PropTypes.object,
  secondPanelTitle: PropTypes.string.isRequired,
  secondPanelBody: PropTypes.node.isRequired,
  secondPanelCTA: PropTypes.string.isRequired,
  recentChampionships: PropTypes.arrayOf(
    PropTypes.shape({
      championshipKey: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ),
  activeChampionships: PropTypes.arrayOf(
    PropTypes.shape({
      championshipKey: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ),
}

const IndexPage = ({data, pageContext}) => {
  const {intro, nextEventsDefault, firstPanelBody, secondPanelBody} = data.page.fields
  const {title, heroImage, firstPanelImage, firstPanelTitle, firstPanelLink, firstPanelCTA, secondPanelImage, secondPanelTitle, secondPanelLink, secondPanelCTA} = data.page.frontmatter
  const now = Moment.utc(pageContext.now)

  const nextEvents = []
  data.nextEvents.edges.forEach(({node}) => {
    nextEvents.push({
      startsAt: Moment.utc(node.frontmatter.startsAt),
      slug: node.fields.slug,
      title: node.frontmatter.eventKey,
      venue: node.frontmatter.venue.frontmatter.venueKey,
    })
  })

  let activeChampionshipsBySlug = {}

  data.activeChampionships.edges.forEach(({node}) => {
    const slug = node.frontmatter.championship.fields.slug
    const startsAt = Moment.utc(node.frontmatter.startsAt)
    if (!activeChampionshipsBySlug[slug]) {
      activeChampionshipsBySlug[slug] = {
        championshipKey:
        node.frontmatter.championship.frontmatter.championshipKey,
        startsAt: startsAt,
      }
      return
    }
    if (activeChampionshipsBySlug[slug].startsAt.isBefore(startsAt)) {
      activeChampionshipsBySlug[slug].startsAt = startsAt
    }
  })

  const recentChampionships = []
  const activeChampionships = []

  for (let [slug, {championshipKey, startsAt}] of Object.entries(
    activeChampionshipsBySlug
  )) {
    if (startsAt.isBefore(now)) {
      recentChampionships.push({
        slug: slug,
        championshipKey: championshipKey,
        startsAt: startsAt,
      })
      continue
    }
    activeChampionships.push({
      slug: slug,
      championshipKey: championshipKey,
      startsAt: startsAt,
    })
  }

  recentChampionships.sort((a, b) => {
    if (a.startsAt === b.startsAt) {
      return a.championshipKey < b.championshipKey ? -1 : 1
    }
    return a.startsAt.isBefore(b.startsAt) ? -1 : 1
  })

  activeChampionships.sort((a, b) => {
    if (a.startsAt === b.startsAt) {
      return a.championshipKey < b.championshipKey ? -1 : 1
    }
    return a.startsAt.isBefore(b.startsAt) ? -1 : 1
  })

  return (
    <Layout>
      <IndexPageTemplate
        contentComponent={HTMLContent}
        title={title}
        heroImage={heroImage.childImageSharp.fluid}
        intro={intro}
        eventsCalendarSlug={'/events/' + now.format('MMMM-YYYY').toLowerCase()}
        nextEvents={nextEvents}
        nextEventsDefault={nextEventsDefault}
        firstPanelImage={firstPanelImage.childImageSharp.fluid}
        firstPanelTitle={firstPanelTitle}
        firstPanelBody={firstPanelBody} firstPanelLink={firstPanelLink}
        firstPanelCTA={firstPanelCTA}
        secondPanelImage={secondPanelImage.childImageSharp.fluid}
        secondPanelTitle={secondPanelTitle}
        secondPanelBody={secondPanelBody} secondPanelLink={secondPanelLink}
        secondPanelCTA={secondPanelCTA}
        activeChampionships={activeChampionships}
        recentChampionships={recentChampionships}
      />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.object,
}

export default IndexPage

export const indexPageQuery = graphql`
  query IndexPageQuery($id: String!, $now: Date!, $recent: Date!) {
    page: markdownRemark(id: { eq: $id }) {
      html
      fields {
        intro
        nextEventsDefault
        firstPanelBody
        secondPanelBody
      }
      frontmatter {
        title
        heroImage {
          childImageSharp {
            fluid(maxWidth: 1344, maxHeight: 756) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        firstPanelImage {
          childImageSharp {
            fluid(maxWidth: 672, maxHeight: 448) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        firstPanelTitle
        firstPanelLink
        firstPanelCTA
        secondPanelImage {
          childImageSharp {
            fluid(maxWidth: 672, maxHeight: 448) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        secondPanelTitle
        secondPanelLink
        secondPanelCTA
      }
    }
    nextEvents: allMarkdownRemark(
      limit: 4
      filter: {
        frontmatter: { startsAt: { gt: $now }, templateKey: { eq: "event" } }
      }
      sort: { fields: [frontmatter___startsAt], order: ASC }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            eventKey
            eventType
            startsAt
            venue {
              frontmatter {
                venueKey
              }
            }
          }
        }
      }
    }
    activeChampionships: allMarkdownRemark(
      filter: {
        frontmatter: {
          startsAt: { gt: $recent }
          templateKey: { eq: "event" }
          championshipForeignKey: { ne: null }
        }
      }
      sort: { fields: [frontmatter___startsAt], order: ASC }
    ) {
      edges {
        node {
          frontmatter {
            championship {
              fields {
                slug
              }
              frontmatter {
                championshipKey
              }
            }
            startsAt
          }
        }
      }
    }
  }
`
