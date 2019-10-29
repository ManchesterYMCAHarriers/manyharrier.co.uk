import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from './ValidationSummary'

class FieldsetPostcode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validationMessage: null,
    }
  }

  componentDidMount() {
    const {inputId, setFormValidationState, validationMessages} = this.props

    const el = document.getElementById(inputId)

    el.addEventListener(
      'invalid',
      () => {
        const failureStates = [
          'valueMissing',
          'customError',
        ]

        for (let i = 0; i < failureStates.length; i++) {
          const failureState = failureStates[i]
          if (el.validity[failureState] && validationMessages[failureState]) {
            this.setState({
              validationMessage: validationMessages[failureState],
            })
            setFormValidationState({
              id: inputId,
              message: validationMessages[failureState],
            })
            break
          }
        }
      },
      false
    )

    el.addEventListener(
      'change',
      () => {
        this.setState({
          value: el.value,
        }, () => {
          let normalizedPostcode = el.value.toUpperCase().replace(/\s/g, "")
          const constraint = new RegExp('^((([A-PR-UWYZ][A-HK-Y]?[0-9][0-9]?)|(([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRV-Y])))[0-9][ABD-HJLNP-UW-Z]{2})$', "")
          if (constraint.test(normalizedPostcode)) {
            el.setCustomValidity("")
          } else {
            el.setCustomValidity(validationMessages['customError'])
          }

          if (el.checkValidity()) {
            this.setState({
              validationMessage: null,
            })
            setFormValidationState({
              id: inputId,
            })
          }
        })
      },
      false
    )
  }

  render() {
    const {
      defaultValue,
      hint,
      inputAttributes,
      inputId,
      label,
      validationIssues,
      visible,
    } = this.props
    const fieldsetClassNames = ['is-field']

    if (!visible) {
      fieldsetClassNames.push('is-hidden')
    }

    if (validationIssues.length > 0) {
      fieldsetClassNames.push('has-error')
    }

    return (
      <fieldset className={fieldsetClassNames.join(' ')}>
        <ValidationSummary validationIssues={validationIssues} />
        <legend className="legend-label">
          <label className="title is-size-3" htmlFor={inputId}>
            {label}
          </label>
        </legend>
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="field">
              {hint && <p className="hint">{hint}</p>}
              {this.state.validationMessage && (
                <p
                  className="validation-message">{this.state.validationMessage}</p>
              )}
              <div className="control">
                <input
                  type="text"
                  className="input is-narrow"
                  name={inputId}
                  id={inputId}
                  {...inputAttributes}
                  defaultValue={defaultValue}
                />
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    )
  }
}

FieldsetPostcode.propTypes = {
  defaultValue: PropTypes.string,
  hint: PropTypes.string,
  inputAttributes: PropTypes.object,
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setFormValidationState: PropTypes.func.isRequired,
  validationIssues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
  validationMessages: PropTypes.shape({
    customError: PropTypes.string.isRequired,
    valueMissing: PropTypes.string.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
}

FieldsetPostcode.defaults = {
  validationIssues: [],
}

export default FieldsetPostcode
