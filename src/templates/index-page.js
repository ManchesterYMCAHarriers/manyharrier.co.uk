import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Moment from 'moment'

import Layout from '../components/Layout'
import PageTitle from "../components/PageTitle";
import EventBox from "../components/EventBox";
import Content, {HTMLContent} from "../components/Content";
import SecondaryTitle from "../components/SecondaryTitle";

export const IndexPageTemplate = ({
                                    contentComponent,
                                    body,
                                    nextEvents,
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
              <SecondaryTitle title={"Coming up"} />
              {nextEvents.map((event, i) => (
                <EventBox key={"next-event-" + i}
                          title={event.title}
                          startsAt={event.startsAt} slug={event.slug}
                          tags={event.tags}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

IndexPageTemplate.propTypes = {
  contentComponent: PropTypes.func,
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  nextEvents: PropTypes.arrayOf(PropTypes.shape({
    startsAt: PropTypes.instanceOf(Moment).isRequired,
    slug: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    title: PropTypes.string.isRequired,
  }))
}

const IndexPage = ({data}) => {
  const body = data.page.html
  const {title} = data.page.frontmatter

  let nextEvents = []

  data.nextEvents.edges.forEach(({node}) => {
    const tags = []

    if (node.frontmatter.venue && node.frontmatter.venue.frontmatter.venueKey) {
      tags.push({
        key: "venue",
        value: node.frontmatter.venue.frontmatter.venueKey,
      })
    }

    if (node.frontmatter.eventType) {
      tags.push({
        key: "eventType",
        value: node.frontmatter.eventType,
      })
    }

    if (node.frontmatter.terrain) {
      tags.push({
        key: "terrain",
        value: node.frontmatter.terrain,
      })
    }

    if (node.frontmatter.championshipForeignKey) {
      tags.push({
        key: "championship",
        value: node.frontmatter.championshipForeignKey,
      })
    }

    if (node.frontmatter.competitionForeignKey) {
      tags.push({
        key: "competition",
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

  return (
    <Layout>
      <IndexPageTemplate
        contentComponent={HTMLContent}
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
    nextEvents: PropTypes.object,
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
    nextEvents: allMarkdownRemark(
      limit: 4
      filter: {
        frontmatter: {
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
  }
`
