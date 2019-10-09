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
                                startsAt,
                                information,
                                type,
                                terrain,
                                championship,
                              }) => {
  const InformationContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <PageTitle title={title} />
      <EventStartsAt startsAt={startsAt} />
      <EventLocation venue={venue} />
      <InformationContent content={information} />
      <div className="tags">
        {type &&
        <TagEventType tag={type} />
        }
        {terrain &&
        <TagTerrain tag={terrain} />
        }
        {championship &&
        <TagChampionship tag={championship.frontmatter.title} />
        }
      </div>
    </StandardContentContainer>
  )
}

EventTemplate.propTypes = {
  championship: PropTypes.object,
  contentComponent: PropTypes.func,
  information: PropTypes.node,
  startsAt: PropTypes.instanceOf(Moment),
  terrain: PropTypes.string,
  type: PropTypes.string,
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
        contentComponent={HTMLContent}
        information={event.html}
        startsAt={startsAt}
        terrain={event.frontmatter.terrain}
        title={event.frontmatter.title}
        type={event.frontmatter.type}
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
        startsAt
        terrain
        type
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
