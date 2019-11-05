import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import EventsCalendarMonth from '../components/EventsCalendarMonth'
import Moment from 'moment'
import { graphql } from 'gatsby'
import StandardContentContainer from "../components/StandardContentContainer";
import {H1} from "../components/Headings";

export class EventsCalendarTemplate extends React.Component {
  render() {
    const {
      events,
      showNextMonthLink,
      showPreviousMonthLink,
      thisMonth,
    } = this.props

    return (
      <StandardContentContainer>
        <H1 title={"Events calendar"} />
          <EventsCalendarMonth
            month={thisMonth}
            events={events}
            showPreviousMonthLink={showPreviousMonthLink}
            showNextMonthLink={showNextMonthLink}
          />
      </StandardContentContainer>
    )
  }
}

EventsCalendarTemplate.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      startsAt: PropTypes.instanceOf(Moment).isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
      title: PropTypes.string.isRequired,
      venue: PropTypes.string.isRequired,
    })
  ),
  showNextMonthLink: PropTypes.bool.isRequired,
  showPreviousMonthLink: PropTypes.bool.isRequired,
  thisMonth: PropTypes.instanceOf(Moment).isRequired,
}

const EventsCalendar = ({ data, pageContext }) => {
  const showPreviousMonthLink =
    data.showPrevious.group.length > 0 &&
    data.showPrevious.group[0].totalCount > 0
  const showNextMonthLink =
    data.showNext.group.length > 0 && data.showNext.group[0].totalCount > 0
  const thisMonth = Moment.utc(pageContext.thisMonth, 'YYYY-MM')
  const events = data.events.edges.map(({ node }) => {
    const tags = []

    if (node.frontmatter.eventType) {
      tags.push({
        key: 'eventType',
        value: node.frontmatter.eventType,
      })
    }

    if (node.frontmatter.terrain) {
      tags.push({
        key: 'terrain',
        value: node.frontmatter.terrain,
      })
    }

    if (node.frontmatter.championshipForeignKey) {
      tags.push({
        key: 'championship',
        value: node.frontmatter.championshipForeignKey,
      })
    }

    if (node.frontmatter.competitionForeignKey) {
      tags.push({
        key: 'competition',
        value: node.frontmatter.competitionForeignKey,
      })
    }

    return {
      slug: node.fields.slug,
      startsAt: Moment.utc(node.frontmatter.startsAt),
      tags: tags,
      title: node.frontmatter.eventKey,
      venue: node.frontmatter.venue.frontmatter.venueKey,
    }
  })

  return (
    <Layout path={"/events"}>
      <EventsCalendarTemplate
        events={events}
        showNextMonthLink={showNextMonthLink}
        showPreviousMonthLink={showPreviousMonthLink}
        thisMonth={thisMonth}
      />
    </Layout>
  )
}

EventsCalendar.propTypes = {
  data: PropTypes.shape({
    showPrevious: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          totalCount: PropTypes.number,
        }).isRequired
      ),
    }).isRequired,
    showNext: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          totalCount: PropTypes.number,
        }).isRequired
      ),
    }).isRequired,
    events: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
            frontmatter: PropTypes.shape({
              championshipForeignKey: PropTypes.string,
              competitionForeignKey: PropTypes.string,
              eventKey: PropTypes.string.isRequired,
              eventType: PropTypes.string,
              startsAt: PropTypes.string.isRequired,
              venue: PropTypes.shape({
                frontmatter: PropTypes.shape({
                  venueKey: PropTypes.string.isRequired,
                }).isRequired,
              }).isRequired,
            }).isRequired,
          }).isRequired,
        })
      ),
    }).isRequired,
  }).isRequired,
}

export default EventsCalendar

export const eventsCalendarQuery = graphql`
  query EventsCalendarQuery($thisMonth: Date!, $nextMonth: Date!) {
    showPrevious: allMarkdownRemark(
      filter: { frontmatter: { startsAt: { lt: $thisMonth } } }
    ) {
      group(field: frontmatter___templateKey) {
        totalCount
      }
    }
    showNext: allMarkdownRemark(
      filter: { frontmatter: { startsAt: { gt: $nextMonth } } }
    ) {
      group(field: frontmatter___templateKey) {
        totalCount
      }
    }
    events: allMarkdownRemark(
      filter: {
        frontmatter: {
          startsAt: { gte: $thisMonth, lt: $nextMonth }
          templateKey: { eq: "event" }
        }
      }
      sort: {
        fields: [frontmatter___startsAt, frontmatter___title]
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
