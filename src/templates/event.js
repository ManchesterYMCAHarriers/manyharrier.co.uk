import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Moment from 'moment'
import Layout from '../components/Layout'
import {HTMLContent} from "../components/Content";
import PageTitle from "../components/PageTitle";
import EventStartsAt from "../components/EventStartsAt";
import EventLocation from "../components/EventLocation";
import StandardContentContainer from "../components/StandardContentContainer";
import { get } from 'lodash'

export const EventTemplate = ({
                                championship,
                                competitionName,
                                eventInfo,
                                eventType,
                                infoForChampionship,
                                infoForCompetition,
                                infoForEventType,
                                infoForTerrain,
                                session,
                                startsAt,
                                terrain,
                                title,
                                venue,
                              }) => {
  return (
    <StandardContentContainer>
      <PageTitle title={title} />
      <EventStartsAt startsAt={startsAt} />
      <EventLocation venue={venue} />
      {eventInfo &&
      <HTMLContent content={eventInfo} className={"content"} />
      }
      {session &&
      <HTMLContent content={session} className={"content"} />
      }
      {infoForTerrain &&
      <HTMLContent content={infoForTerrain} className={"content"} />
      }
      {infoForEventType &&
      <HTMLContent content={infoForEventType} className={"content"} />
      }
      {infoForCompetition &&
      <HTMLContent content={infoForCompetition} className={"content"} />
      }
      {infoForChampionship &&
      <HTMLContent content={infoForChampionship} className={"content"} />
      }
    </StandardContentContainer>
  )
}

EventTemplate.propTypes = {
  championship: PropTypes.object,
  eventInfo: PropTypes.node,
  eventType: PropTypes.string,
  infoForChampionship: PropTypes.node,
  infoForCompetition: PropTypes.node,
  infoForEventType: PropTypes.node,
  infoForTerrain: PropTypes.node,
  session: PropTypes.node,
  startsAt: PropTypes.instanceOf(Moment),
  terrain: PropTypes.string,
  title: PropTypes.string,
  venue: PropTypes.object,
}

const Event = ({data}) => {
  const {markdownRemark: event} = data

  const startsAt = Moment.utc(event.frontmatter.startsAt)

  return (
    <Layout>
      <EventTemplate
        championship={event.frontmatter.championship}
        competition={event.frontmatter.competitionName}
        eventInfo={event.html}
        eventType={event.frontmatter.eventType}
        infoForChampionship={get(event.frontmatter.infoForChampionship, ["html"])}
        infoForCompetition={get(event.frontmatter.infoForCompetition, ["html"])}
        infoForEventType={get(event.frontmatter.infoForEventType, ["html"])}
        infoForTerrain={get(event.frontmatter.infoForChampionship, ["html"])}
        session={get(event.frontmatter.session, ["html"])}
        startsAt={startsAt}
        terrain={event.frontmatter.terrain}
        title={event.frontmatter.title}
        venue={event.frontmatter.venue}
      />
    </Layout>
  )
}

Event.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  }),
}

export default Event

export const eventQuery = graphql`
  query EventByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        championship {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
        competitionName
        eventType
        infoForCompetition {
          html
        }
        infoForEventType {
          html
        }
        infoForTerrain {
          html
        }
        session {
          html
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
        startsAt
        terrain
        venue {
          fields {
            slug
            location {
              coordinates
            }
          }
          frontmatter {
            address
            title
          }
        }
      }
    }
  }
`
