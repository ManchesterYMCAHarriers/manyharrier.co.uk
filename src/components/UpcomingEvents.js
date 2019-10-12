import React from "react"
import PropTypes from "prop-types"
import Moment from "moment"
import VenueEvent from "./VenueEvent";

class UpcomingEvents extends React.Component {
  render() {
    const { venueName } = this.props
    const today = Moment.utc().startOf("day")

    let events = this.props.events || []

    const filteredEvents = events.filter(event => {
      const start = Moment.utc(event.frontmatter.startsAt)
      return start.isAfter(today)
    }).sort((a, b) => {
      if (a.frontmatter.startsAt === b.frontmatter.startsAt) {
        return a.frontmatter.title < b.frontmatter.title ? -1 : 1
      }
      return a.frontmatter.startsAt < b.frontmatter.startsAt ? -1 : 1
    })

    if (filteredEvents.length === 0) {
      return (
        <div>There are no upcoming events at {venueName}</div>
      )
    }

    return (
      <div>
        {filteredEvents.map(event => (
          <VenueEvent event={event} />
        ))}
      </div>
    )
  }
}

UpcomingEvents.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object)
}

export default UpcomingEvents
