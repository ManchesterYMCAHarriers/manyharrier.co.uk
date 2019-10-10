import React from "react"
import PropTypes from "prop-types"
import Moment from "moment"

class EventStartsAt extends React.Component {
  render() {
    const { startsAt } = this.props

    return (
      <div className="is-size-4" style={{
        marginBottom: "1rem"
      }}>
        <div
          className="is-inline-tablet">{startsAt.format("dddd Do MMMM YYYY")}</div>
        <span className="is-hidden-mobile">, </span>
        <div
          className="is-inline-tablet">{startsAt.format("h:mma")}</div>
      </div>
    )
  }
}

EventStartsAt.propTypes = {
  startsAt: PropTypes.instanceOf(Moment)
}

export default EventStartsAt
