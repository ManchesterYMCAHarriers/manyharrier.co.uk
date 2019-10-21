import React from "react"
import PropTypes from "prop-types"

class ProgressBar extends React.Component {
  render() {
    const { max, value, validationIssues } = this.props
    const progress = Math.round(value/max) * 100

    return (
      <progress className={"progress" + (validationIssues.length > 0 ? " is-danger" : "")} value={value} max={max}>{progress}%</progress>
    )
  }
}

ProgressBar.propTypes = {
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  validationIssues: PropTypes.arrayOf(PropTypes.object).isRequired,
}

ProgressBar.defaults = {
  validationIssues: [],
}

export default ProgressBar
