import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import Moment from 'moment'
import EventBox from '../components/EventBox'
import StandardContentContainer from "../components/StandardContentContainer";
import {H1, H2} from "../components/Headings";

export const SessionTemplate = ({
  contentComponent,
  events,
  title,
  information,
}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <H1 title={title} />
      <PageContent content={information} />
      <H2 title={"Upcoming events"} />
      {events.length === 0 && (
        <p>There are no upcoming events featuring this session.</p>
      )}
      {events.map(({startsAt, slug, title, venue}, i) => (
        <EventBox
          key={'session-event-' + i}
          startsAt={startsAt}
          slug={slug}
          title={title}
          venue={venue}
        />
      ))}
    </StandardContentContainer>
  )
}

SessionTemplate.propTypes = {
  contentComponent: PropTypes.func,
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
}

const Session = ({ data, pageContext }) => {
  const { markdownRemark: session } = data

  const { now } = pageContext

  const events = (session.frontmatter.sessionEvents || [])
    .map(event => {
      return {
        startsAt: Moment.utc(event.frontmatter.startsAt),
        slug: event.fields.slug,
        title: event.frontmatter.eventKey,
        venue: event.frontmatter.venue.frontmatter.venueKey
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
    <Layout path={session.fields.slug}>
      <SessionTemplate
        contentComponent={HTMLContent}
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
