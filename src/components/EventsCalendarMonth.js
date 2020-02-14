import React from 'react'
import * as PropTypes from 'prop-types'
import Moment from 'moment'
import EventsCalendarDay from './EventsCalendarDay'
import { uniq } from 'lodash'
import { CallToActionBackLink, CallToActionLink } from './CallToAction'
import { PanelFullWidth, Panels } from './Panels'

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
      <Panels>
        <PanelFullWidth>
          <div className="panel">
            <div className="flex flex-wrap justify-between items-baseline pb-8 border-b-2 border-black-manyharrier">
              <div className="w-full md:w-auto flex-shrink-0 flex-grow order-1 md:order-2 text-center">
                <h2 className="heading-2 mb-4">{month.format('MMMM YYYY')}</h2>
              </div>
              <div className="w-1/2 md:w-1/4 flex-shrink-0 flex-grow-0 order-2 md:order-1">
                {showPreviousMonthLink && (
                  <CallToActionBackLink
                    to={`/events/${previousMonth
                      .format('MMMM-YYYY')
                      .toLowerCase()}`}
                    title={previousMonth.format('MMMM YYYY')}
                  />
                )}
              </div>
              <div className="w-1/2 md:w-1/4 flex-shrink-0 flex-grow-0 order-3 text-right">
                {showNextMonthLink && (
                  <CallToActionLink
                    to={`/events/${nextMonth
                      .format('MMMM-YYYY')
                      .toLowerCase()}`}
                    title={nextMonth.format('MMMM YYYY')}
                  />
                )}
              </div>
            </div>
            <div className="my-8">
              {days.map(day => (
                <div
                  key={`events-${day.date.format('YYYY-MM-DD')}`}
                  className="mt-8"
                >
                  <EventsCalendarDay date={day.date} events={day.events} />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-between items-baseline mb-2 border-t-2 border-gray-700 pt-8">
              <div className="w-1/2 flex-shrink-0 flex-grow-0">
                {showPreviousMonthLink && (
                  <CallToActionBackLink
                    to={`/events/${previousMonth
                      .format('MMMM-YYYY')
                      .toLowerCase()}`}
                    title={previousMonth.format('MMMM YYYY')}
                  />
                )}
              </div>
              <div className="w-1/2 flex-shrink-0 flex-grow-0 text-right">
                {showNextMonthLink && (
                  <CallToActionLink
                    to={`/events/${nextMonth
                      .format('MMMM-YYYY')
                      .toLowerCase()}`}
                    title={nextMonth.format('MMMM YYYY')}
                  />
                )}
              </div>
            </div>
          </div>
        </PanelFullWidth>
      </Panels>
    )
  }
}

EventsCalendarMonth.propTypes = {
  month: PropTypes.instanceOf(Moment).isRequired,
  showPreviousMonthLink: PropTypes.bool.isRequired,
  showNextMonthLink: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      cancelled: PropTypes.boolean,
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
