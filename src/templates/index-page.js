import React from 'react'
import * as PropTypes from 'prop-types'
import {graphql, Link} from 'gatsby'
import Moment from 'moment'
import Layout from '../components/Layout'
import EventBox from '../components/EventBox'
import StandardContentContainer from '../components/StandardContentContainer'
import Hero from '../components/Hero'
import {Panel, PanelFullWidth, Panels} from '../components/Panels'
import {Card, CardCTA} from '../components/Card'
import {CallToActionLink, CallToActionText} from '../components/CallToAction'

export const IndexPageTemplate = ({
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
                                      eventEntryPromos,
                                  }) => {
    return (
        <StandardContentContainer>
            <Hero title={title} fluidImage={heroImage}/>
            <Panels>
                <PanelFullWidth>
                    <div
                        className="content panel black-bottom"
                        dangerouslySetInnerHTML={{__html: intro}}
                    />
                </PanelFullWidth>
                <PanelFullWidth>
                    <div className='content panel black-bottom'>
                        <h2 className="heading-2">New Runners Night</h2>
                        <p>Thinking of joining a running club? Why not come and try out Manchester YMCA Harriers on our New Runners Night!</p>
                        <p>Don't worry about pace, this session is all about having a good run with the aim of introducing you to our club and meeting new people. With the bonus of our monthly social at a local pub.</p>
                        <CallToActionLink to="/events/2025-01-30-18-30-new-runners-night/" title="Learn more"/>
                    </div>
                </PanelFullWidth>
                <PanelFullWidth>
                    <div className="panel red-bottom">
                        <h2 className="heading-2">Coming up...</h2>
                        {nextEvents.length === 0 && (
                            <div
                                className="content"
                                dangerouslySetInnerHTML={{__html: nextEventsDefault}}
                            />
                        )}
                        <Panels className="mt-4">
                            {nextEvents.map(({cancelled, title, startsAt, slug, venue}, i) => (
                                <Panel key={'next-event-' + i}>
                                    <EventBox
                                        cancelled={cancelled}
                                        title={title}
                                        startsAt={startsAt}
                                        slug={slug}
                                        venue={venue}
                                    />
                                </Panel>
                            ))}
                        </Panels>
                        <div className="content mt-4">
                            <p>
                                For a full list of what we've got coming up, check out our
                                events calendar.
                            </p>
                        </div>
                        <div className="text-right mt-4">
                            <CallToActionLink
                                to={eventsCalendarSlug}
                                title={'Events calendar'}
                            />
                        </div>
                    </div>
                </PanelFullWidth>
            </Panels>
            {eventEntryPromos.length > 0 && (
                <Panels>
                    <PanelFullWidth>
                        <div className="panel black-bottom">
                            <h2 className="heading-2">Enter now...</h2>
                            <Panels>
                                {eventEntryPromos.map(
                                    ({title, slug, heroImage, venue, startsAt}) => (
                                        <Panel key={`event-promo-${slug}`}>
                                            <CardCTA
                                                to={slug}
                                                image={heroImage}
                                                borderColorClassName={`border-gray-400`}
                                                borderColorHoverClassName={`border-red-manyharrier`}
                                                title={title}
                                                callToAction={<CallToActionText title={'More info'}/>}
                                            >
                                                {venue && (
                                                    <div className="text-sm">
                                                        <p className="font-semibold">
                                                            {startsAt.format('dddd Do MMMM YYYY, h:mm:a')}
                                                        </p>
                                                        <p className="font-light">{venue}</p>
                                                    </div>
                                                )}
                                            </CardCTA>
                                        </Panel>
                                    )
                                )}
                            </Panels>
                        </div>
                    </PanelFullWidth>
                </Panels>
            )}
            <Panels>
                <Panel>
                    <Card
                        image={firstPanelImage}
                        title={firstPanelTitle}
                        callToAction={
                            <CallToActionLink to={firstPanelLink} title={firstPanelCTA}/>
                        }
                        borderColorClassName={`border-black-manyharrier`}
                    >
                        <div
                            className="content"
                            dangerouslySetInnerHTML={{__html: firstPanelBody}}
                        />
                    </Card>
                </Panel>
                <Panel>
                    <Card
                        image={secondPanelImage}
                        title={secondPanelTitle}
                        callToAction={
                            <CallToActionLink to={secondPanelLink} title={secondPanelCTA}/>
                        }
                        borderColorClassName={`border-red-manyharrier`}
                    >
                        <div
                            className="content"
                            dangerouslySetInnerHTML={{__html: secondPanelBody}}
                        />
                    </Card>
                </Panel>
            </Panels>
        </StandardContentContainer>
    )
}

IndexPageTemplate.propTypes = {
    title: PropTypes.string.isRequired,
    heroImage: PropTypes.object.isRequired,
    intro: PropTypes.node.isRequired,
    nextEvents: PropTypes.arrayOf(
        PropTypes.shape({
            cancelled: PropTypes.bool,
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
    eventEntryPromos: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            entryAvailable: PropTypes.bool.isRequired,
            startsAt: PropTypes.instanceOf(Moment).isRequired,
            venue: PropTypes.string,
        })
    ),
}

const IndexPage = ({data, pageContext, location}) => {
    const {
        intro,
        nextEventsDefault,
        firstPanelBody,
        secondPanelBody,
    } = data.page.fields
    const {
        title,
        heroImage,
        firstPanelImage,
        firstPanelTitle,
        firstPanelLink,
        firstPanelCTA,
        secondPanelImage,
        secondPanelTitle,
        secondPanelLink,
        secondPanelCTA,
    } = data.page.frontmatter
    const now = Moment.utc(pageContext.now)

    const stripeSkus = data.stripeSkus.edges.map(({node}) => {
        return {
            name: node.attributes.name,
            price: node.price,
            sku: node.id,
            product: node.product.name,
        }
    })

    const eventEntryPromos = []

    const nextEvents = []
    data.nextEvents.edges.forEach(({node}, i) => {
        const event = {
            cancelled: node.frontmatter.cancelled,
            entryAvailable:
                stripeSkus.findIndex(({name, product}) => {
                    return name === node.frontmatter.eventKey && (product === 'Race entry' || product === 'Social event')
                }) > -1,
            startsAt: Moment.utc(node.frontmatter.startsAt),
            slug: node.fields.slug,
            title: node.frontmatter.eventKey,
            venue: node.frontmatter.venue.frontmatter.venueKey,
            heroImage: node.frontmatter.heroImage
                ? node.frontmatter.heroImage.childImageSharp.fluid
                : null,
        }
        if (i < 4) {
            nextEvents.push(event)
        }
        if (event.entryAvailable) {
            eventEntryPromos.push(event)
        }
    })

    let activeChampionshipsBySlug = {}

    data.activeChampionships.edges.forEach(({node}) => {
        const slug = node.frontmatter.championship.fields.slug
        const startsAt = Moment.utc(node.frontmatter.startsAt)
        if (!activeChampionshipsBySlug[slug]) {
            activeChampionshipsBySlug[slug] = {
                championshipKey:
                node.frontmatter.championship.frontmatter.championshipKey,
                entryAvailable:
                    stripeSkus.findIndex(
                        ({name, product}) =>
                            name ===
                            node.frontmatter.championship.frontmatter.championshipKey &&
                            product === 'Championship entry'
                    ) > -1,
                startsAt: startsAt,
                endsAt: startsAt,
                heroImage: node.frontmatter.championship.frontmatter.heroImage
                    ? node.frontmatter.championship.frontmatter.heroImage.childImageSharp
                        .fluid
                    : null,
            }
            return
        }
        if (startsAt.isBefore(activeChampionshipsBySlug[slug].startsAt)) {
            activeChampionshipsBySlug[slug].startsAt = startsAt
        }
        if (startsAt.isAfter(activeChampionshipsBySlug[slug].endsAt)) {
            activeChampionshipsBySlug[slug].endsAt = startsAt
        }
    })

    const recentChampionships = []
    const activeChampionships = []

    for (let [
        slug,
        {championshipKey, startsAt, endsAt, entryAvailable, heroImage},
    ] of Object.entries(activeChampionshipsBySlug)) {
        if (entryAvailable) {
            eventEntryPromos.push({
                slug,
                title: championshipKey,
                startsAt,
                entryAvailable,
                heroImage,
            })
        }

        if (endsAt.isAfter(now)) {
            activeChampionships.push({
                slug,
                championshipKey,
                startsAt,
                entryAvailable,
                heroImage,
            })
            continue
        }
        recentChampionships.push({
            slug,
            championshipKey,
            startsAt,
            entryAvailable,
            heroImage,
        })
    }

    eventEntryPromos.sort((a, b) => {
        if (a.startsAt.isSame(b.startsAt)) {
            return a.title < b.title ? -1 : 1
        }
        return a.startsAt.isBefore(b.startsAt) ? -1 : 1
    })

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
        <Layout location={location}>
            <IndexPageTemplate
                title={title}
                heroImage={heroImage.childImageSharp.fluid}
                intro={intro}
                eventsCalendarSlug={'/events/' + now.format('MMMM-YYYY').toLowerCase()}
                nextEvents={nextEvents}
                nextEventsDefault={nextEventsDefault}
                firstPanelImage={firstPanelImage.childImageSharp.fluid}
                firstPanelTitle={firstPanelTitle}
                firstPanelBody={firstPanelBody}
                firstPanelLink={firstPanelLink}
                firstPanelCTA={firstPanelCTA}
                secondPanelImage={secondPanelImage.childImageSharp.fluid}
                secondPanelTitle={secondPanelTitle}
                secondPanelBody={secondPanelBody}
                secondPanelLink={secondPanelLink}
                secondPanelCTA={secondPanelCTA}
                activeChampionships={activeChampionships}
                recentChampionships={recentChampionships}
                eventEntryPromos={eventEntryPromos}
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
            ...HeroImage
          }
        }
        firstPanelImage {
          childImageSharp {
            ...CardImage
          }
        }
        firstPanelTitle
        firstPanelLink
        firstPanelCTA
        secondPanelImage {
          childImageSharp {
            ...CardImage
          }
        }
        secondPanelTitle
        secondPanelLink
        secondPanelCTA
      }
    }
    nextEvents: allMarkdownRemark(
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
            cancelled
            eventKey
            eventType
            heroImage {
              childImageSharp {
                ...CardImage
              }
            }
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
                heroImage {
                  childImageSharp {
                    ...CardImage
                  }
                }
              }
            }
            startsAt
          }
        }
      }
    }
    stripeSkus: allStripeSku(
      filter: {
        active: { eq: true }
        attributes: { category: { in: ["Race", "Championship", "Presentation", "Social"] } }
      }
    ) {
      edges {
        node {
          price
          attributes {
            name
            category
          }
          id
          product {
            name
          }
        }
      }
    }
  }
`
