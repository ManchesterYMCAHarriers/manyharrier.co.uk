import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import {Link} from 'gatsby'
import EventsCalendarDay from "./EventsCalendarDay";
import { uniq } from 'lodash'

class EventsCalendarMonth extends React.Component {
  render() {
    const {month, showPreviousMonthLink, showNextMonthLink, events} = this.props
    const previousMonth = month.clone().add(-1, 'month')
    const nextMonth = month.clone().add(1, 'month')

    let days = []
    events.forEach(({ startsAt }) => {
      days.push(startsAt.format("YYYY-MM-DD"))
    })

    days = uniq(days)

    days = days.map(day => {
      return {
        date: Moment.utc(day),
        events: events.filter(event => {
          return event.startsAt.format("YYYY-MM-DD") === day
        })
      }
    })

    return (
      <div className="column is-10 is-offset-1">
        <h1 className="title is-size-3 has-text-weight-bold has-text-centered">
          {month.format("MMMM YYYY")}
        </h1>
        <div className="columns is-multiline is-mobile">
          <div className="column is-half">
            {showPreviousMonthLink &&
            <Link
              to={"/events/" + previousMonth.format("MMMM-YYYY").toLowerCase()}><span aria-hidden="true">&larr;&nbsp;</span>{previousMonth.format("MMMM YYYY")}</Link>
            }
          </div>
          <div className="column is-half has-text-right">
            {showNextMonthLink &&
            <Link
              to={"/events/" + nextMonth.format("MMMM-YYYY").toLowerCase()}>{nextMonth.format("MMMM YYYY")}<span aria-hidden="true">&nbsp;&rarr;</span></Link>
            }
          </div>
          <div
            className="column is-full columns is-multiline is-desktop">
            {days.map(day => (
              <EventsCalendarDay date={day.date} events={day.events} key={day.date.format("YYYY-MM-DD").toLowerCase()} />
            ))}
          </div>
          <div className="column is-half">
            {showPreviousMonthLink &&
            <Link
              to={"/events/" + previousMonth.format("MMMM-YYYY").toLowerCase()}><span aria-hidden="true">&larr;&nbsp;</span>{previousMonth.format("MMMM YYYY")}</Link>
            }
          </div>
          <div className="column is-half has-text-right">
            {showNextMonthLink &&
            <Link
              to={"/events/" + nextMonth.format("MMMM-YYYY").toLowerCase()}>{nextMonth.format("MMMM YYYY")}<span aria-hidden="true">&nbsp;&rarr;</span></Link>
            }
          </div>
        </div>
      </div>
    )
  }
}

EventsCalendarMonth.propTypes = {
  month: PropTypes.instanceOf(Moment).isRequired,
  showPreviousMonthLink: PropTypes.bool.isRequired,
  showNextMonthLink: PropTypes.bool.isRequired,
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

export default EventsCalendarMonth
