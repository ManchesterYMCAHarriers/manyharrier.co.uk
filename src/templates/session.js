import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Moment from 'moment'
import EventBox from '../components/EventBox'
import StandardContentContainer from '../components/StandardContentContainer'
import { PanelFullWidth, Panels } from '../components/Panels'
import Hero from '../components/Hero'

export const SessionTemplate = ({ events, title, heroImage, information }) => {
  return (
    <StandardContentContainer>
      {heroImage ? (
        <Hero fluidImage={heroImage} title={title} />
      ) : (
        <h1 className="heading-1">{title}</h1>
      )}
      <Panels>
        <PanelFullWidth>
          <div className="panel bottom-black">
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: information }}
            />
          </div>
        </PanelFullWidth>
      </Panels>
      <PanelFullWidth>
        <div className="panel black-bottom">
          <h2 className="heading-2 mb-4">Upcoming events</h2>
          {events.length === 0 && (
            <p className="paragraph">
              There are no upcoming events featuring this session.
            </p>
          )}
          {events.map(({ startsAt, slug, title }, i) => (
            <EventBox
              key={'session-event-' + i}
              startsAt={startsAt}
              slug={slug}
              title={title}
            />
          ))}
        </div>
      </PanelFullWidth>
    </StandardContentContainer>
  )
}

SessionTemplate.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      startsAt: PropTypes.instanceOf(Moment).isRequired,
      title: PropTypes.string.isRequired,
      venue: PropTypes.string.isRequired,
    })
  ),
  information: PropTypes.node,
  title: PropTypes.string.isRequired,
  heroImage: PropTypes.object,
}

const Session = ({ data, pageContext, location }) => {
  const { markdownRemark: session } = data

  const { now } = pageContext

  const events = (session.frontmatter.sessionEvents || [])
    .map(event => {
      return {
        startsAt: Moment.utc(event.frontmatter.startsAt),
        slug: event.fields.slug,
        title: event.frontmatter.eventKey,
        venue: event.frontmatter.venue.frontmatter.venueKey,
      }
    })
    .filter(event => {
      return event.startsAt.isAfter(now)
    })
    .sort((a, b) => {
      if (a.startsAt.isSame(b.startsAt)) {
        return a.title < b.title ? -1 : 1
      }
      return a.startsAt.isBefore(b.startsAt) ? -1 : 1
    })

  return (
    <Layout title={session.frontmatter.sessionKey} description={session.frontmatter.description} path={session.fields.slug} location={location}>
      <SessionTemplate
        events={events}
        information={session.html}
        title={session.frontmatter.sessionKey}
      />
    </Layout>
  )
}

Session.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default Session

export const sessionQuery = graphql`
  query SessionByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      fields {
        slug
      }
      frontmatter {
        description
        heroImage {
          childImageSharp {
            ...HeroImage
          }
        }
        sessionKey
        sessionEvents {
          fields {
            slug
          }
          frontmatter {
            eventKey
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
  }
`
