import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from "./ValidationSummary";

class FieldsetMulti extends React.Component {
  render() {
    const { children, legend, validationIssues } = this.props
    return (
      <fieldset className="section fieldset-multi">
        <legend>
          <h2 className="title is-size-3">{legend}</h2>
        </legend>
        <ValidationSummary validationIssues={validationIssues} />
        {children}
      </fieldset>
    )
  }
}

FieldsetMulti.propTypes = {
  children: PropTypes.node.isRequired,
  legend: PropTypes.string.isRequired,
  validationIssues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired
}

FieldsetMulti.defaults = {
  validationIssues: [],
}

export default FieldsetMulti
