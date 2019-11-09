import React from 'react'
import PropTypes from 'prop-types'

class ValidationSummary extends React.Component {
  handleClick = ev => {
    ev.preventDefault()
    const targetId = ev.target.href.split('#')[1]
    let input = document.getElementById(targetId)
    if (!input) {
      input = ev.target
        .closest('form')
        .querySelector('input[name="' + targetId + '"]')
    }
    let parent = input.closest('.has-error')
    parent.scrollIntoView()
    input.focus({
      preventScroll: true,
    })
  }

  render() {
    const { validationIssues } = this.props

    if (validationIssues.length === 0) {
      return null
    }

    return (
      <div
        className="border-2 border-red-400 bg-red-100 p-4 my-4 focus:outline-none"
        tabIndex={'-1'}
      >
        <h3 className="text-xl font-bold mb-4">There is a problem</h3>
        <ul className="ml-6 mt-4">
          {validationIssues.map((validationIssue, i) => (
            <li className="my-2 list-disc" key={'validation-summary-' + i}>
              <a
                className="hover:underline"
                onClick={this.handleClick}
                href={'#' + validationIssue.id}
              >
                {validationIssue.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

ValidationSummary.propTypes = {
  validationIssues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
}

ValidationSummary.defaults = {
  validationIssues: [],
}

export default ValidationSummary
