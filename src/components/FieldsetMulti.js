import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from "./ValidationSummary";

class FieldsetMulti extends React.Component {
  render() {
    const { children, hint, legend, validationIssues, visible } = this.props
    return (
      <fieldset className={"section fieldset-multi" + (visible ? "" : " is-hidden")}>
        <legend>
          <h2 className="title is-size-3">{legend}</h2>
        </legend>
        <ValidationSummary validationIssues={validationIssues} />
        {hint &&
        <p className="hint">{hint}</p>
        }
        {children}
      </fieldset>
    )
  }
}

FieldsetMulti.propTypes = {
  children: PropTypes.node.isRequired,
  hint: PropTypes.string,
  legend: PropTypes.string.isRequired,
  validationIssues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired,
  visible: PropTypes.bool.isRequired,
}

FieldsetMulti.defaults = {
  validationIssues: [],
}

export default FieldsetMulti
