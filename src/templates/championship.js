import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Moment from 'moment'
import Layout from '../components/Layout'
import {HTMLContent} from "../components/Content";
import PageTitle from "../components/PageTitle";
import EventBox from "../components/EventBox";

export const ChampionshipTemplate = ({
                                       events,
                                       title,
                                       information,
                                     }) => {
  return (
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <PageTitle title={title} />
            <h2>Fixtures</h2>
            {events.map((event, i) => (
              <EventBox key={"championship-event-" + i} startsAt={event.startsAt} slug={event.slug} title={event.title} tags={event.tags} />
            ))}
            <h2>Information</h2>
            <HTMLContent content={information} />
          </div>
        </div>
      </div>
    </section>
  )
}

ChampionshipTemplate.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    startsAt: PropTypes.instanceOf(Moment).isRequired,
    slug: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    title: PropTypes.string.isRequired,
  })),
  information: PropTypes.node,
  title: PropTypes.string.isRequired,
}

const Championship = ({data}) => {
  const {markdownRemark: championship} = data

  const events = (championship.frontmatter.championshipEvents || []).map(event => {
    const tags = []

    if (event.frontmatter.venue && event.frontmatter.venue.frontmatter.venueKey) {
      tags.push({
        key: "venue",
        value: event.frontmatter.venue.frontmatter.venueKey,
      })
    }

    if (!championship.frontmatter.terrain && event.frontmatter.terrain) {
      tags.push({
        key: "terrain",
        value: event.frontmatter.terrain,
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
  }).sort((a, b) => {
    if (a.startsAt.isSame(b.startsAt)) {
      return a.title < b.title ? -1 : 1
    }
    return a.startsAt.isBefore(b.startsAt) ? -1 : 1
  })

  return (
    <Layout>
      <ChampionshipTemplate
        events={events}
        information={championship.html}
        title={championship.frontmatter.championshipKey}
      />
    </Layout>
  )
}

Championship.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  }),
}

export default Championship

export const championshipQuery = graphql`
  query ChampionshipByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        championshipEvents {
          id
          fields {
            slug
          }
          frontmatter {
            competitionForeignKey
            eventKey
            startsAt
            terrain
            venue {
              frontmatter {
                venueKey
              }
            }
          }
        }
        championshipKey
        terrain
      }
    }
  }
`
