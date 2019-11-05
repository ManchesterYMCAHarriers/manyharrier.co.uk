import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Moment from 'moment'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import EventBox from '../components/EventBox'
import StandardContentContainer from "../components/StandardContentContainer";
import {H1, H2} from "../components/Headings";

export const ChampionshipTemplate = ({
  contentComponent,
  events,
  title,
  information,
}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <H1 title={title} />
      <H2 title={"Fixtures"} />
      {events.map(({startsAt, slug, title, venue}, i) => (
        <EventBox
          key={'championship-event-' + i}
          startsAt={startsAt}
          slug={slug}
          title={title}
          venue={venue}
        />
      ))}
      <PageContent content={information} />
    </StandardContentContainer>
  )
}

ChampionshipTemplate.propTypes = {
  contentComponent: PropTypes.func,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      startsAt: PropTypes.instanceOf(Moment).isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      venue: PropTypes.string.isRequired,
    })
  ),
  information: PropTypes.node,
  title: PropTypes.string.isRequired,
}

const Championship = ({ data }) => {
  const { markdownRemark: championship } = data

  const events = (championship.frontmatter.championshipEvents || [])
    .map(event => {
      return {
        startsAt: Moment.utc(event.frontmatter.startsAt),
        slug: event.fields.slug,
        title: event.frontmatter.eventKey,
        venue: event.frontmatter.venue.frontmatter.venueKey
      }
    })
    .sort((a, b) => {
      if (a.startsAt.isSame(b.startsAt)) {
        return a.title < b.title ? -1 : 1
      }
      return a.startsAt.isBefore(b.startsAt) ? -1 : 1
    })

  return (
    <Layout path={championship.fields.slug}>
      <ChampionshipTemplate
        contentComponent={HTMLContent}
        events={events}
        information={championship.html}
        title={championship.frontmatter.championshipKey}
      />
    </Layout>
  )
}

Championship.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
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
            eventKey
            startsAt
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
