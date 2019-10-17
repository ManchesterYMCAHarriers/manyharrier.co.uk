import React from "react"
import PropTypes from "prop-types"
import Moment from "moment"
import {Link} from "gatsby";

class UpcomingEvents extends React.Component {
  render() {
    const { events, venueName } = this.props

    if (events.length === 0) {
      return (
        <div>There are no upcoming events at {venueName}</div>
      )
    }

    return (
      <div>
        {events.map(event => (
          <Link to={event.slug} className="box" key={event.slug}>
            <h3>{event.title}</h3>
            <div className="is-inline-tablet">{event.startsAt.format("dddd Do MMMM YYYY")}</div>
            <span className="is-hidden-mobile">, </span>
            <div className="is-inline-tablet">{event.startsAt.format("h:mma")}</div>
          </Link>
        ))}
      </div>
    )
  }
}

UpcomingEvents.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    startsAt: PropTypes.instanceOf(Moment).isRequired,
    title: PropTypes.string.isRequired,
  }))
}

export default UpcomingEvents
