import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import EventsCalendarMonth from "../components/EventsCalendarMonth";
import Moment from 'moment'
import {graphql} from "gatsby";

class EventsCalendar extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const showPreviousMonthLink = data.showPrevious.group.length > 0 && data.showPrevious.group[0].totalCount > 0
    const showNextMonthLink = data.showNext.group.length > 0 && data.showNext.group[0].totalCount > 0
    const thisMonth = Moment.utc(pageContext.thisMonth, "YYYY-MM")
    const events = data.events.edges.map(({ node }) => {
      return {
        slug: node.fields.slug,
        startsAt: Moment.utc(node.frontmatter.startsAt),
        title: node.frontmatter.title,
        venueName: node.frontmatter.venue.frontmatter.title,
      }
    })

    return (
      <Layout>
        <section className="section">
          <div className="container content">
            <h1 className="is-size-1">Events</h1>
            <div className="columns">
              <EventsCalendarMonth month={thisMonth} events={events} showPreviousMonthLink={showPreviousMonthLink} showNextMonthLink={showNextMonthLink} />
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

EventsCalendar.propTypes = {
  data: PropTypes.shape({
    showPrevious: PropTypes.shape({
      group: PropTypes.arrayOf(PropTypes.shape({
          totalCount: PropTypes.number
        }).isRequired
      )
    }).isRequired,
    showNext: PropTypes.shape({
      group: PropTypes.arrayOf(PropTypes.shape({
          totalCount: PropTypes.number
        }).isRequired
      )
    }).isRequired,
    events: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.shape({
        node: PropTypes.shape({
          fields: PropTypes.shape({
            slug: PropTypes.string.isRequired
          }),
          frontmatter: PropTypes.shape({
            startsAt: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            venue: PropTypes.shape({
              frontmatter: PropTypes.shape({
                title: PropTypes.string.isRequired
              }).isRequired
            }).isRequired
          }).isRequired
        }).isRequired
      }))
    }).isRequired
  }).isRequired,
  pageContext: PropTypes.shape({
    thisMonth: PropTypes.string.isRequired,
    nextMonth: PropTypes.string.isRequired
  })
}

export default EventsCalendar

export const eventsCalendarQuery = graphql`
  query EventsCalendarQuery($thisMonth: Date!, $nextMonth: Date!) {
    showPrevious: allMarkdownRemark(
      filter: {
        frontmatter: {
          startsAt: {
            lt: $thisMonth
          }
        }
      }
    ) {
      group(field: frontmatter___templateKey) {
        totalCount
      }
    }
    showNext: allMarkdownRemark(
      filter: {
        frontmatter: {
          startsAt: {
            gt: $nextMonth
          }
        }
      }
    ) {
      group(field: frontmatter___templateKey) {
        totalCount
      }
    }
    events: allMarkdownRemark(
      filter: {
        frontmatter: {
          startsAt: {
            gte: $thisMonth,
            lt: $nextMonth
          }
          templateKey: {
            eq: "event"
          }
        }
      }
      sort: {
        fields: [
          frontmatter___startsAt,
          frontmatter___title
        ],
        order: ASC
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            startsAt
            title
            venue {
              frontmatter {
                title
              }
            }
          }
        }
      }
    }
  }
`
