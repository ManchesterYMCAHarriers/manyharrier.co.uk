import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from './ValidationSummary'

class FieldsetMulti extends React.Component {
  render() {
    const { children, hint, legend, validationIssues, visible } = this.props
    const fieldsetClassNames = ['fieldset-multi']

    if (!visible) {
      fieldsetClassNames.push('is-hidden')
    }

    return (
      <fieldset className={fieldsetClassNames.join(' ')}>
        <legend>
          <h2 className="title is-size-3">{legend}</h2>
        </legend>
        <ValidationSummary validationIssues={validationIssues} />
        <div className="columns">
          <div className="column is-10 is-offset-1">
            {hint && <p className="hint">{hint}</p>}
            {children}
          </div>
        </div>
      </fieldset>
    )
  }
}

FieldsetMulti.propTypes = {
  children: PropTypes.node.isRequired,
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
