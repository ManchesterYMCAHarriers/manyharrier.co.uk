import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import EventBox from "./EventBox";

class EventsCalendarDay extends React.Component {
  render() {
    const {date, events} = this.props

    return (
      <div
        className="column is-full">
        <div className="columns is-multiline is-desktop">
          <div
            className="column is-full-desktop is-two-fifths-widescreen">
            <div
              className="box is-size-4 has-text-grey is-shadowless">
              {date.format("dddd Do MMMM")}
            </div>
          </div>
          {events.map(event => (
            <div className="column" key={event.slug}>
              <EventBox startsAt={event.startsAt} slug={event.slug} title={event.title} tags={event.tags} />
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
    }).isRequired
  )
}

export default EventsCalendarDay
