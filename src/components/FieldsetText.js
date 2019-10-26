import React from 'react'
import PropTypes from 'prop-types'
import InputText from "./InputText";
import ValidationSummary from "./ValidationSummary";

class FieldsetText extends React.Component {
  render() {
    const {hint, inputAttributes, inputId, inputType, label, setFormValidationState, validationIssues, validationMessages, visible} = this.props
    return (
      <div>
        <fieldset className={"section is-field" + (visible ? "" : " is-hidden") + (validationIssues.length > 0 ? " has-error" : "")}>
          <ValidationSummary validationIssues={validationIssues} />
          <legend>
            <label className="title is-size-3" htmlFor={inputId}>{label}</label>
          </legend>
          <InputText hint={hint} inputAttributes={inputAttributes}
                     inputId={inputId} inputType={inputType}
                     setFormValidationState={setFormValidationState}
                     validationMessages={validationMessages}
          />
        </fieldset>
      </div>
    )
  }
}

FieldsetText.propTypes = {
  hint: PropTypes.string,
  inputAttributes: PropTypes.object,
  inputId: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setFormValidationState: PropTypes.func.isRequired,
  validationIssues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired,
  validationMessages: PropTypes.shape({
    badInput: PropTypes.string,
    patternMismatch: PropTypes.string,
    rangeOverflow: PropTypes.string,
    rangeUnderflow: PropTypes.string,
    stepMismatch: PropTypes.string,
    tooLong: PropTypes.string,
    tooShort: PropTypes.string,
    typeMismatch: PropTypes.string,
    valueMissing: PropTypes.string,
  }),
  visible: PropTypes.bool.isRequired,
}

FieldsetText.defaults = {
  validationIssues: [],
}

export default FieldsetText