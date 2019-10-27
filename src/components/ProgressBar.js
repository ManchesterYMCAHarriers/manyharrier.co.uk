import React from 'react'
import PropTypes from 'prop-types'

class ProgressBar extends React.Component {
  render() {
    const { stage, stages, validationIssues } = this.props
    const progress =
      Math.round(Math.max(0, Math.min(stage, stages)) / stages) * 100

    return (
      <progress
        className={
          'progress' + (validationIssues.length > 0 ? ' is-danger' : '')
        }
        value={Math.max(0, Math.min(stage, stages))}
        max={stages}
      >
        {progress}%
      </progress>
    )
  }
}

ProgressBar.propTypes = {
  stage: PropTypes.number.isRequired,
  stages: PropTypes.number.isRequired,
  validationIssues: PropTypes.arrayOf(PropTypes.object).isRequired,
}

ProgressBar.defaults = {
  validationIssues: [],
}

export default ProgressBar
