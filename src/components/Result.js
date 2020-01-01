import React from 'react'
import PropTypes from 'prop-types'
import * as Moment from 'moment'

class Result extends React.Component {
  formatTime = timeInSeconds => {
    if (timeInSeconds % 1 !== 0) {
      return timeInSeconds
    }

    const timeMoment = Moment.unix(timeInSeconds).utc()

    return timeInSeconds < 3600 ? timeMoment.format("mm:ss") : timeMoment.format("H:mm:ss")
  }

  render() {
    const { name, time } = this.props

    return (
      <div className="flex justify-between py-1 mb-1 border-b border-gray-600">
        <div>{name}</div>
        <div>{this.formatTime(time)}</div>
      </div>
    )
  }
}

Result.propTypes = {
  name: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
}

export default Result
