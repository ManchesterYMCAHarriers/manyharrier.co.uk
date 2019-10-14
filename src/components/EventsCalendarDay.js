import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import {Link} from 'gatsby'

class EventsCalendarDay extends React.Component {
  render() {
    const {date, events} = this.props

    return (
      <div
        className="column is-full events-calendar-day">
        <div className="columns is-multiline is-desktop">
          <div
            className="column is-one-third-desktop is-one-quarter-widescreen">
            <div className="box is-size-4 has-text-grey is-shadowless events-calendar-date">
              {date.format("dddd Do")}
            </div>
          </div>
          {events.map(event => (
            <div className="column" key={event.slug}>
              <Link to={event.slug}
                    className="box"
                    key={"events-calendar-day-" + event.slug}
                    style={{flexGrow: 1}}
              >
              <span
                className="event-start-time has-text-weight-bold">{event.startsAt.format("h:mma")}</span>
                <span> - </span>
                <span
                  className="event-location has-text-weight-semibold">{event.venueName}</span>
                <span
                  className="is-block event-title">{event.title}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

EventsCalendarDay.propTypes = {
  date: PropTypes.instanceOf(Moment).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      startsAt: PropTypes.instanceOf(Moment).isRequired,
      title: PropTypes.string.isRequired,
      venueName: PropTypes.string.isRequired,
    }).isRequired
  )
}

export default EventsCalendarDay
