import React from "react"
import PropTypes from "prop-types"
import Moment from "moment"

class EventStartsAt extends React.Component {
  render() {
    const { startsAt } = this.props

    return (
      <p className="subtitle is-size-4">
        {startsAt.format("dddd Do MMMM YYYY")}<br/>
        {startsAt.format("h:mma")}
      </p>
    )
  }
}

EventStartsAt.propTypes = {
  startsAt: PropTypes.instanceOf(Moment)
}

export default EventStartsAt
