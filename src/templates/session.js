import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import {HTMLContent} from "../components/Content";
import Moment from "moment";
import EventBox from "../components/EventBox";

export const SessionTemplate = ({
                                       events,
                                       title,
                                       information,
                                     }) => {
  return (
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <HTMLContent content={information} />
            <h2>Upcoming events</h2>
            {events.length === 0 &&
            <p>There are no upcoming events featuring this session.</p>
            }
            {events.map((event, i) => (
              <EventBox key={"session-event-" + 1} startsAt={event.startsAt} slug={event.slug} title={event.title} tags={event.tags} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

SessionTemplate.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    startsAt: PropTypes.instanceOf(Moment).isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    title: PropTypes.string.isRequired,
  })),
  information: PropTypes.node,
  title: PropTypes.string.isRequired,
}

const Session = ({data, pageContext}) => {
  const {markdownRemark: session} = data

  const {now} = pageContext

  const events = session.frontmatter.sessionEvents.map(event => {
    const tags = []

    if (event.frontmatter.venue && event.frontmatter.venue.frontmatter.venueKey) {
      tags.push({
        key: "venue",
        value: event.frontmatter.venue.frontmatter.venueKey,
      })
    }

    if (event.frontmatter.eventType) {
      tags.push({
        key: "eventType",
        value: event.frontmatter.eventType,
      })
    }

    if (event.frontmatter.terrain) {
      tags.push({
        key: "terrain",
        value: event.frontmatter.terrain,
      })
    }

    if (event.frontmatter.championshipForeignKey) {
      tags.push({
        key: "championship",
        value: event.frontmatter.championshipForeignKey,
      })
    }

    if (event.frontmatter.competitionForeignKey) {
      tags.push({
        key: "competition",
        value: event.frontmatter.competitionForeignKey,
      })
    }

    return {
      startsAt: Moment.utc(event.frontmatter.startsAt),
      slug: event.fields.slug,
      tags: tags,
      title: event.frontmatter.eventKey,
    }
  }).filter(event => {
    return event.startsAt.isAfter(now)
  }).sort((a, b) => {
    if (a.startsAt.isSame(b.startsAt)) {
      return a.title < b.title ? -1 : 1
    }
    return a.startsAt.isBefore(b.startsAt) ? -1 : 1
  })

  return (
    <Layout>
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
    markdownRemark: PropTypes.object
  }),
}

export default Session

export const sessionQuery = graphql`
  query SessionByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        sessionKey
        sessionEvents {
          id
          fields {
            slug
          }
          frontmatter {
            eventKey
            eventType
            startsAt
            terrain
            venue {
              id
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
