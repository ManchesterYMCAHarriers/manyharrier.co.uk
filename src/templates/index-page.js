import React from 'react'
import PropTypes from 'prop-types'
import {graphql, Link} from 'gatsby'
import Moment from 'moment'

import Layout from '../components/Layout'
import PageTitle from '../components/PageTitle'
import EventBox from '../components/EventBox'
import Content, {HTMLContent} from '../components/Content'
import SecondaryTitle from '../components/SecondaryTitle'
import {FaCalendarAlt} from 'react-icons/fa'

export const IndexPageTemplate = ({
                                    contentComponent,
                                    activeChampionships,
                                    body,
                                    eventsCalendarSlug,
                                    nextEvents,
                                    recentChampionships,
                                    title,
                                  }) => {
  const PageContent = contentComponent || Content

  return (
    <div className="container">
      <div className="section">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="content">
              <PageTitle title={title} />
              <PageContent content={body} />
              <SecondaryTitle title={'Coming up'} />
              {nextEvents.length === 0 && (
                <div>
                  <p>We have two regular sessions per week:</p>
                  <ul>
                    <li>Tuesday evenings at 7:00pm at the <Link
                      to={"/venues/manchester-regional-arena/"}>Manchester
                      Regional Arena</Link></li>
                    <li>Thuesday evenings at 6:30pm at <Link
                      to={"/venues/the-y-club"}>The Y Club</Link></li>
                  </ul>
                </div>
              )}
              {nextEvents.length > 0 && (
                <p>Here's what's happening in the next few weeks:</p>
              )}
              {nextEvents.map((event, i) => (
                <EventBox
                  key={'next-event-' + i}
                  title={event.title}
                  startsAt={event.startsAt}
                  slug={event.slug}
                  tags={event.tags}
                />
              ))}
              <div className="columns">
                <div
                  className="column is-mobile is-10-mobile is-8-tablet is-6-desktop is-offset-1-mobile is-offset-2-tablet is-offset-3-desktop">
                  <Link
                    to={eventsCalendarSlug}
                    className={'button is-dark is-fullwidth'}
                  >
                    <span className="icon">
                      <FaCalendarAlt />
                    </span>
                    <span>Events calendar</span>
                  </Link>
                </div>
              </div>
              <div className="columns is-desktop">
                <div className="column">
                  <div className="message is-dark">
                    <div className="message-header">
                      About us
                    </div>
                    <div className="message-body">
                      <p>We are affiliated to England Athletics and we
                        frequently take part in races and other running
                        events. We have club championships in cross-country,
                        road, fell and track disciplines. We particularly
                        enjoy taking part in events where we can run as a
                        team!</p>
                      <p>We're not just about running; we arrange regular
                        socials in Manchester city centre and we are often
                        found travelling further afield for weekend breaks or
                        longer holidays.</p>
                      <p className="has-text-centered">
                        <Link to={"/about"} className="button is-dark">Find
                          out more</Link>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <article className="message is-primary">
                    <div className="message-header">
                      <p>Join us!</p>
                    </div>
                    <div className="message-body">
                      <p>We run and we do lots of fun stuff besides running.
                        What's not to like?!</p>
                      <p>Whether you're a practically a pro, just taking your
                        first running steps, mainly interested in the "après
                        run", or somewhere in between all three, we'd love for
                        you to join us!</p>
                      <p>If you like what you see, try us out for size and come
                        and be a part of it!</p>
                      <p className="has-text-centered">
                        <Link to={"/join"} className="button is-primary">Find
                          out more</Link>
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

IndexPageTemplate.propTypes = {
  activeChampionships: PropTypes.arrayOf(PropTypes.shape({
    championshipKey: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  })),
  body: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  eventsCalendarSlug: PropTypes.string.isRequired,
  nextEvents: PropTypes.arrayOf(
    PropTypes.shape({
      startsAt: PropTypes.instanceOf(Moment).isRequired,
      slug: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
      title: PropTypes.string.isRequired,
    })
  ),
  recentChampionships: PropTypes.arrayOf(PropTypes.shape({
    championshipKey: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  })),
  title: PropTypes.string.isRequired,
}

const IndexPage = ({data, pageContext}) => {
  const body = data.page.html
  const {title} = data.page.frontmatter
  const now = Moment.utc(pageContext.now)

  const nextEvents = []

  data.nextEvents.edges.forEach(({node}) => {
    const tags = []

    if (node.frontmatter.venue && node.frontmatter.venue.frontmatter.venueKey) {
      tags.push({
        key: 'venue',
        value: node.frontmatter.venue.frontmatter.venueKey,
      })
    }

    if (node.frontmatter.eventType) {
      tags.push({
        key: 'eventType',
        value: node.frontmatter.eventType,
      })
    }

    if (node.frontmatter.terrain) {
      tags.push({
        key: 'terrain',
        value: node.frontmatter.terrain,
      })
    }

    if (node.frontmatter.championshipForeignKey) {
      tags.push({
        key: 'championship',
        value: node.frontmatter.championshipForeignKey,
      })
    }

    if (node.frontmatter.competitionForeignKey) {
      tags.push({
        key: 'competition',
        value: node.frontmatter.competitionForeignKey,
      })
    }

    nextEvents.push({
      startsAt: Moment.utc(node.frontmatter.startsAt),
      slug: node.fields.slug,
      tags: tags,
      title: node.frontmatter.eventKey,
    })
  })

  let activeChampionshipsBySlug = {}

  data.activeChampionships.edges.forEach(({node}) => {
    const slug = node.frontmatter.championship.fields.slug
    const startsAt = Moment.utc(node.frontmatter.startsAt)
    if (!activeChampionshipsBySlug[slug]) {
      activeChampionshipsBySlug[slug] = {
        championshipKey: node.frontmatter.championship.frontmatter.championshipKey,
        startsAt: startsAt
      }
      return
    }
    if (activeChampionshipsBySlug[slug].startsAt.isBefore(startsAt)) {
      activeChampionshipsBySlug[slug].startsAt = startsAt
    }
  })

  const recentChampionships = []
  const activeChampionships = []

  for (let [slug, {championshipKey, startsAt}] of Object.entries(activeChampionshipsBySlug)) {
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
        eventsCalendarSlug={'/events/' + now.format('MMMM-YYYY').toLowerCase()}
        body={body}
        nextEvents={nextEvents}
        activeChampionships={activeChampionships}
        recentChampionships={recentChampionships}
        title={title}
      />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.shape({
      html: PropTypes.node,
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
    nextEvents: PropTypes.object,
    activeChamionships: PropTypes.object,
  }),
}

export default IndexPage

export const indexPageQuery = graphql`
  query IndexPageQuery($id: String!, $now: Date!, $recent: Date!) {
    page: markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
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
            championshipForeignKey
            competitionForeignKey
            eventKey
            eventType
            startsAt
            terrain
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
        frontmatter: { startsAt: { gt: $recent }, templateKey: { eq: "event" }, championshipForeignKey: { ne: null } }
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
