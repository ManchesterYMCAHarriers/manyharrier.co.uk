import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import {Link} from 'gatsby'

class EventsCalendarDay extends React.Component {
  render() {
    const {day, events} = this.props

    const filteredEvents = events.filter(event => {
      const eventDate = Moment.utc(event.node.frontmatter.startDate, "Do MMMM YYYY").startOf('day')
      return day.isSame(eventDate)
    })

    if (filteredEvents.length === 0) {
      return null
    }

    return (
      <div
        className="column is-full events-calendar-day">
        <div className="columns is-multiline is-desktop">
          <div
            className="column is-one-third-desktop is-one-quarter-widescreen">
            <div className="box is-size-4 has-text-grey is-shadowless events-calendar-date">
              {day.format("dddd Do")}
            </div>
          </div>
          {filteredEvents.map(event => (
            <div className="column">
              <Link to={event.node.fields.slug}
                    className="box"
                    key={"events-calendar-day-" + event.node.fields.slug}
                    style={{flexGrow: 1}}
              >
              <span
                className="event-start-time has-text-weight-bold">{event.node.frontmatter.startTime}</span>
                <span> - </span>
                <span
                  className="event-location has-text-weight-semibold">{event.node.frontmatter.venue.frontmatter.title}</span>
                <span
                  className="is-block event-title">{event.node.frontmatter.title}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

EventsCalendarDay.propTypes = {
  day: PropTypes.instanceOf(Moment),
  targetMonth: PropTypes.instanceOf(Moment),
  events: PropTypes.arrayOf(
    PropTypes.object
  )
}

export default EventsCalendarDay
