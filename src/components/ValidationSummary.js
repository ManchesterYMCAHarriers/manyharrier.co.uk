import React from 'react'
import PropTypes from 'prop-types'

class ValidationSummary extends React.Component {
  handleClick = ev => {
    ev.preventDefault()
    const targetId = ev.target.href.split('#')[1]
    const input = document.getElementById(targetId)
    let parent = input.closest('.is-field')
    if (!parent) {
      parent = input.closest('.field')
    }
    parent.scrollIntoView()
    input.focus({
      preventScroll: true,
    })
  }

  render() {
    const {validationIssues} = this.props

    if (validationIssues.length === 0) {
      return null
    }

    return (
      <div className="notification is-danger" tabIndex={"-1"}>
        <h3 className="title is-size-5">There is a problem</h3>
        <ul>
          {validationIssues.map((validationIssue, i) => (
            <li key={"validation-summary-" + i}>
              <a onClick={this.handleClick}
                 href={"#" + validationIssue.id}>{validationIssue.message}</a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

ValidationSummary.propTypes = {
  validationIssues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired
}

ValidationSummary.defaults = {
  validationIssues: [],
}

export default ValidationSummary
