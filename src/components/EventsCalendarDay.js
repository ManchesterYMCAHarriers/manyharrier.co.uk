import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import {Link} from 'gatsby'
import EventTags from "./EventTags";

class EventsCalendarDay extends React.Component {
  render() {
    const {date, events} = this.props

    return (
      <div
        className="column is-full events-calendar-day">
        <div className="columns is-multiline is-desktop">
          <div
            className="column is-one-half-desktop is-one-third-widescreen">
            <div
              className="box is-size-4 has-text-grey is-shadowless events-calendar-date">
              {date.format("dddd Do MMMM")}
            </div>
          </div>
          {events.map(event => (
            <div className="column" key={event.slug}>
              <Link to={event.slug}
                    className="box"
                    key={"events-calendar-day-" + event.slug}
                    style={{flexGrow: 1}}
              >
                <div className="title is-size-5">
                  {event.startsAt.format("h:mma")} - {event.venueName}
                </div>
                <div className="subtitle is-size-6">{event.title}</div>
                <EventTags reactKey={event.slug} tags={event.tags} />
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
      tags: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })),
      title: PropTypes.string.isRequired,
      venueName: PropTypes.string.isRequired,
    }).isRequired
  )
}

export default EventsCalendarDay
