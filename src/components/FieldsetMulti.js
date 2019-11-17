import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from './ValidationSummary'

class FieldsetMulti extends React.Component {
  render() {
    const { children, className, hint, legend, validationIssues, visible } = this.props
    let fieldsetClassNames = ['fieldset-multi']

    if (!visible) {
      fieldsetClassNames.push('hidden')
    }

    if (className) {
      fieldsetClassNames = fieldsetClassNames.concat(className.split(" "));
    }

    return (
      <fieldset className={fieldsetClassNames.join(' ')}>
        <legend>
          <h2 className="legend">{legend}</h2>
        </legend>
        <ValidationSummary validationIssues={validationIssues} />
        {hint && <p className="hint">{hint}</p>}
        {children}
      </fieldset>
    )
  }
}

FieldsetMulti.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hint: PropTypes.string,
  legend: PropTypes.string.isRequired,
  validationIssues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
  visible: PropTypes.bool.isRequired,
}

FieldsetMulti.defaults = {
  validationIssues: [],
}

export default FieldsetMulti
