import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Moment from 'moment'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";
import PageTitle from "../components/PageTitle";
import TagEventType from "../components/TagEventType";
import TagTerrain from "../components/TagTerrain";
import TagChampionship from "../components/TagChampionship";
import EventStartsAt from "../components/EventStartsAt";
import EventLocation from "../components/EventLocation";
import StandardContentContainer from "../components/StandardContentContainer";

export const EventTemplate = ({
                                contentComponent,
                                title,
                                venue,
                                session,
                                startsAt,
                                information,
                                eventType,
                                terrain,
                                championship,
                                competitionName,
                                sessionContentComponent,
                              }) => {
  const InformationContent = contentComponent || Content
  const SessionContent = sessionContentComponent || Content

  return (
    <StandardContentContainer>
      <PageTitle title={title} />
      <EventStartsAt startsAt={startsAt} />
      <EventLocation venue={venue} />
      {information &&
      <InformationContent content={information} />
      }
      {session &&
      <SessionContent content={session.html} />
      }
      <div className="tags">
        {eventType &&
        <TagEventType tag={eventType} />
        }
        {terrain &&
        <TagTerrain tag={terrain} />
        }
        {championship &&
        <TagChampionship tag={championship.frontmatter.title} />
        }
        {competitionName &&
        <TagTerrain tag={competitionName} />
        }
      </div>
    </StandardContentContainer>
  )
}

EventTemplate.propTypes = {
  championship: PropTypes.object,
  contentComponent: PropTypes.func,
  sessionContentComponent: PropTypes.func,
  information: PropTypes.node,
  session: PropTypes.object,
  startsAt: PropTypes.instanceOf(Moment),
  terrain: PropTypes.string,
  eventType: PropTypes.string,
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
        contentComponent={HTMLContent}
        sessionContentComponent={HTMLContent}
        information={event.html}
        session={event.frontmatter.session}
        startsAt={startsAt}
        terrain={event.frontmatter.terrain}
        title={event.frontmatter.title}
        eventType={event.frontmatter.eventType}
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
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
        competitionName
        eventType
        infoForChampionship {
          id
          html
        }
        infoForCompetition {
          id
          html
        }
        infoForEventType {
          id
          html
        }
        infoForTerrain {
          id
          html
        }
        session {
          id
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
          id
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
