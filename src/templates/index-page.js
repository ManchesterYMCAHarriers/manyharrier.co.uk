import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Moment from 'moment'
import {kebabCase} from 'lodash'

import Layout from '../components/Layout'
import PageTitle from "../components/PageTitle";
import EventBox from "../components/EventBox";
import {HTMLContent} from "../components/Content";
import SecondaryTitle from "../components/SecondaryTitle";

export const IndexPageTemplate = ({
                                    body,
                                    nextEvents,
                                    title,
                                  }) => (
  <div className="container">
    <div className="section">
      <div className="columns">
        <div className="column is-10 is-offset-1">
          <div className="content">
            <PageTitle title={title} />
            <HTMLContent content={body} />
            <SecondaryTitle title={"Coming up"} />
            <div className="columns is-multiline">
              {nextEvents.map(ev => (
                <div className="column is-half"
                     key={"next-event-" + kebabCase(ev.eventType)}>
                  <EventBox eventTitle={ev.eventTitle}
                            preTitle={"Next " + ev.eventType.toLowerCase()}
                            startsAt={ev.startsAt} slug={ev.slug}
                            venueName={ev.venueName} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

IndexPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  nextEvents: PropTypes.arrayOf(PropTypes.shape({
    eventTitle: PropTypes.string.isRequired,
    eventType: PropTypes.string.isRequired,
    startsAt: PropTypes.instanceOf(Moment).isRequired,
    slug: PropTypes.string.isRequired,
    venueName: PropTypes.string.isRequired,
  }))
}

const IndexPage = ({data}) => {
  const body = data.page.html
  const {title} = data.page.frontmatter

  let nextEvents = []

  const nextEventKeys = [
    "nextGroupRun",
    "nextTrackSession",
    "nextRace",
    "nextSocial"
  ]

  nextEventKeys.forEach(key => {
    data[key].edges.forEach(({node}) => {
      nextEvents.push({
        eventTitle: node.frontmatter.title,
        eventType: node.frontmatter.eventType,
        startsAt: Moment.utc(node.frontmatter.startsAt),
        slug: node.fields.slug,
        venueName: node.frontmatter.venue.frontmatter.title,
      })
    })
  })

  return (
    <Layout>
      <IndexPageTemplate
        body={body}
        nextEvents={nextEvents}
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
        title: PropTypes.string.isRequired
      }),
    }),
    nextGroupRun: PropTypes.object,
    nextRace: PropTypes.object,
    nextSocial: PropTypes.object,
    nextTrackSession: PropTypes.object,
  }),
}

export default IndexPage

export const indexPageQuery = graphql`
  query IndexPageQuery($id: String!, $now: Date!) {
    page: markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
    nextGroupRun: allMarkdownRemark(
      limit: 1
      filter: {
        frontmatter: {
          eventType: {
            eq: "Group Run"
          }
          startsAt: {
            gt: $now
          }
          templateKey: {
            eq: "event"
          }
        }
      }
      sort: {
        fields: [frontmatter___startsAt]
        order: ASC
      }
    ) {
      edges {
        ...nextEvent
      }
    }
    nextTrackSession: allMarkdownRemark(
      limit: 1
      filter: {
        frontmatter: {
          eventType: {
            eq: "Track"
          }
          startsAt: {
            gt: $now
          }
          templateKey: {
            eq: "event"
          }
        }
      }
      sort: {
        fields: [frontmatter___startsAt]
        order: ASC
      }
    ) {
      edges {
        ...nextEvent
      }
    }
    nextRace: allMarkdownRemark(
      limit: 1
      filter: {
        frontmatter: {
          eventType: {
            eq: "Race"
          }
          startsAt: {
            gt: $now
          }
          templateKey: {
            eq: "event"
          }
        }
      }
      sort: {
        fields: [frontmatter___startsAt]
        order: ASC
      }
    ) {
      edges {
        ...nextEvent
      }
    }
    nextSocial: allMarkdownRemark(
      limit: 1
      filter: {
        frontmatter: {
          eventType: {
            eq: "Social"
          }
          startsAt: {
            gt: $now
          }
          templateKey: {
            eq: "event"
          }
        }
      }
      sort: {
        fields: [frontmatter___startsAt]
        order: ASC
      }
    ) {
      edges {
        ...nextEvent
      }
    }
  }
`

export const nextEventFragment = graphql`
  fragment nextEvent on MarkdownRemarkEdge {
    node {
      fields {
        slug
      }
      frontmatter {
        eventType
        startsAt
        title
        venue {
          frontmatter {
            address
            title
          }
        }
      }
    }
  }
`
