import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import { Link } from 'gatsby'
import EventsCalendarDay from './EventsCalendarDay'
import { uniq } from 'lodash'
import { H2 } from './Headings'

class EventsCalendarMonth extends React.Component {
  render() {
    const {
      month,
      showPreviousMonthLink,
      showNextMonthLink,
      events,
    } = this.props
    const previousMonth = month.clone().add(-1, 'month')
    const nextMonth = month.clone().add(1, 'month')

    let days = []
    events.forEach(({ startsAt }) => {
      days.push(startsAt.format('YYYY-MM-DD'))
    })

    days = uniq(days)

    days = days.map(day => {
      return {
        date: Moment.utc(day),
        events: events.filter(event => {
          return event.startsAt.format('YYYY-MM-DD') === day
        }),
      }
    })

    return (
      <>
        <div className="flex flex-wrap justify-between items-baseline pb-8 border-b-2 border-gray-700">
          <div className="w-full md:w-auto flex-shrink-0 flex-grow order-1 md:order-2 text-center">
            <H2 title={month.format('MMMM YYYY')} />
          </div>
          <div className="w-1/2 md:w-1/4 flex-shrink-0 flex-grow-0 order-2 md:order-1">
            {showPreviousMonthLink && (
              <Link
                className="border-b-2 p-2 border-gray-400 hover:border-red-400 hover:bg-gray-200"
                to={
                  '/events/' + previousMonth.format('MMMM-YYYY').toLowerCase()
                }
              >
                <span className="mr-1 text-red-400" aria-hidden="true">
                  &larr;
                </span>
                {previousMonth.format('MMMM YYYY')}
              </Link>
            )}
          </div>
          <div className="w-1/2 md:w-1/4 flex-shrink-0 flex-grow-0 order-3 text-right">
            {showNextMonthLink && (
              <Link
                className="border-b-2 p-2 border-gray-400 hover:border-red-400 hover:bg-gray-200"
                to={'/events/' + nextMonth.format('MMMM-YYYY').toLowerCase()}
              >
                {nextMonth.format('MMMM YYYY')}
                <span className="ml-1 text-red-400" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            )}
          </div>
        </div>
        <div className="mt-8">
          {days.map(day => (
            <div className="mt-8">
              <EventsCalendarDay date={day.date} events={day.events} />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-baseline my-8 border-t-2 border-gray-700 pt-8">
          <div className="w-1/2 flex-shrink-0 flex-grow-0">
            {showPreviousMonthLink && (
              <Link
                className="border-b-2 p-2 border-gray-400 hover:border-red-400 hover:bg-gray-200"
                to={
                  '/events/' + previousMonth.format('MMMM-YYYY').toLowerCase()
                }
              >
                <span className="mr-1 text-red-400" aria-hidden="true">
                  &larr;
                </span>
                {previousMonth.format('MMMM YYYY')}
              </Link>
            )}
          </div>
          <div className="w-1/2 flex-shrink-0 flex-grow-0 text-right">
            {showNextMonthLink && (
              <Link
                className="border-b-2 p-2 border-gray-400 hover:border-red-400 hover:bg-gray-200"
                to={'/events/' + nextMonth.format('MMMM-YYYY').toLowerCase()}
              >
                {nextMonth.format('MMMM YYYY')}
                <span className="ml-1 text-red-400" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            )}
          </div>
        </div>
      </>
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
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
      title: PropTypes.string.isRequired,
    }).isRequired
  ),
}

export default EventsCalendarMonth
