import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import {Link} from 'gatsby'
import EventsCalendarDay from "./EventsCalendarDay";

class EventsCalendarMonth extends React.Component {
  render() {
    const {month, firstMonth, lastMonth, events} = this.props
    const previousMonth = month.clone().add(-1, 'month')
    const nextMonth = month.clone().add(1, 'month')

    const endOfMonth = month.clone().endOf('month')

    const days = []

    for (let date = month.clone().startOf('month'); date.isBefore(endOfMonth); date.add(1, 'day')) {
      days.push(date.clone())
    }

    return (
      <div className="column is-10 is-offset-1">
        <h1 className="title is-size-3 has-text-weight-bold has-text-centered">
          {month.format("MMMM YYYY")}
        </h1>
        <div className="columns is-multiline is-mobile">
          <div className="column is-half">
            {month.isAfter(firstMonth) &&
            <Link
              to={"/events/" + previousMonth.format("MMMM-YYYY").toLowerCase()}><span aria-hidden="true">&larr;&nbsp;</span>{previousMonth.format("MMMM YYYY")}</Link>
            }
          </div>
          <div className="column is-half has-text-right">
            {month.isBefore(lastMonth) &&
            <Link
              to={"/events/" + nextMonth.format("MMMM-YYYY").toLowerCase()}>{nextMonth.format("MMMM YYYY")}<span aria-hidden="true">&nbsp;&rarr;</span></Link>
            }
          </div>
          <div
            className="column is-full columns is-multiline is-desktop">
            {days.map(day => (
              <EventsCalendarDay day={day} events={events} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

EventsCalendarMonth.propTypes = {
  month: PropTypes.instanceOf(Moment),
  firstMonth: PropTypes.instanceOf(Moment),
  lastMonth: PropTypes.instanceOf(Moment),
  events: PropTypes.arrayOf(
    PropTypes.object
  )
}

export default EventsCalendarMonth
