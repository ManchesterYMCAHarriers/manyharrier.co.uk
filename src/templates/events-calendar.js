import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import EventsCalendarMonth from "../components/EventsCalendarMonth";
import Moment from 'moment'

class EventsCalendar extends React.Component {
  render() {
    const {events} = this.props.pageContext
    const month = Moment.utc(this.props.pageContext.month)
    const firstMonth = Moment.utc(this.props.pageContext.firstMonth)
    const lastMonth = Moment.utc(this.props.pageContext.lastMonth)

    return (
      <Layout>
        <section className="section">
          <div className="container content">
            <h1 className="is-size-1">Events</h1>
            <div className="columns">
              <EventsCalendarMonth month={month} firstMonth={firstMonth} lastMonth={lastMonth} events={events} />
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

EventsCalendar.propTypes = {
  month: PropTypes.instanceOf(Moment),
  events: PropTypes.arrayOf(
    PropTypes.node
  )
}

export default EventsCalendar
