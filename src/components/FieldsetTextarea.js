import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from './ValidationSummary'
import Textarea from './Textarea'

class FieldsetTextarea extends React.Component {
  render() {
    const {
      hint,
      inputAttributes,
      inputId,
      label,
      rows,
      setFormValidationState,
      validationIssues,
      validationMessages,
      visible,
    } = this.props
    const fieldsetClassNames = ['is-field']

    if (!visible) {
      fieldsetClassNames.push('hidden')
    }

    if (validationIssues.length > 0) {
      fieldsetClassNames.push('has-error')
    }

    return (
      <fieldset className={fieldsetClassNames.join(' ')}>
        <ValidationSummary validationIssues={validationIssues} />
        <legend>
          <label className="legend" htmlFor={inputId}>
            {label}
          </label>
        </legend>
        <Textarea
          hint={hint}
          inputAttributes={inputAttributes}
          inputId={inputId}
          rows={rows}
          setFormValidationState={setFormValidationState}
          validationMessages={validationMessages}
        />
      </fieldset>
    )
  }
}

FieldsetTextarea.propTypes = {
  hint: PropTypes.string,
  inputAttributes: PropTypes.object,
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rows: PropTypes.number.isRequired,
  setFormValidationState: PropTypes.func.isRequired,
  validationIssues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
  validationMessages: PropTypes.shape({
    badInput: PropTypes.string,
    patternMismatch: PropTypes.string,
    tooLong: PropTypes.string,
    tooShort: PropTypes.string,
    valueMissing: PropTypes.string,
  }),
  visible: PropTypes.bool.isRequired,
}

FieldsetTextarea.defaults = {
  rows: 3,
  validationIssues: [],
}

export default FieldsetTextarea
