import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import EventBox from './EventBox'
import { H3 } from './Headings'

class EventsCalendarDay extends React.Component {
  render() {
    const { date, events } = this.props

    return (
      <div className="flex flex-wrap md:flex-no-wrap">
        <div className="w-full md:w-2/5 flex-shrink-0 text-gray-700 md:mt-8">
          <H3 title={date.format('dddd D MMMM')} />
        </div>
        <div className="w-full md:w-1/2 flex-shrink-0 flex-grow">
          {events.map(({ slug, startsAt, title, venue }) => (
            <EventBox
              key={slug}
              startsAt={startsAt}
              slug={slug}
              title={title}
              venue={venue}
            />
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
      venue: PropTypes.string.isRequired,
    }).isRequired
  ),
}

export default EventsCalendarDay
