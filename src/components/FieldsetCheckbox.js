import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from './ValidationSummary'

class FieldsetCheckbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validationMessage: null,
    }
  }

  componentDidMount() {
    const { inputId, setFormValidationState, validationMessages } = this.props

    const el = document.getElementById(inputId)

    el.addEventListener(
      'invalid',
      () => {
        const failureStates = ['valueMissing']

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
        })

        if (el.checkValidity()) {
          this.setState({
            validationMessage: null,
          })
          setFormValidationState({
            id: inputId,
          })
        }
      },
      false
    )
  }

  render() {
    const {
      inputAttributes,
      inputId,
      legend,
      statements,
      label,
      value,
      validationIssues,
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
        <legend>
          <h2 className="legend">{legend}</h2>
        </legend>
        <ValidationSummary validationIssues={validationIssues} />
        {statements}
        {this.state.validationMessage && (
          <p className="validation-message">
            {this.state.validationMessage}
          </p>
        )}
        <label className="checkbox block font-semibold relative cursor-pointer my-4 select-none pl-10">
          <input
            type="checkbox"
            className="absolute opacity-0 cursor-pointer h-0 w-0"
            id={inputId}
            name={inputId}
            value={value}
            {...inputAttributes}
          />
          <span className="checkmark" />{label}
        </label>
      </fieldset>
    )
  }
}

FieldsetCheckbox.propTypes = {
  inputAttributes: PropTypes.object,
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  legend: PropTypes.string.isRequired,
  setFormValidationState: PropTypes.func.isRequired,
  statements: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  validationIssues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
  visible: PropTypes.bool.isRequired,
}

FieldsetCheckbox.defaults = {
  validationIssues: [],
}

export default FieldsetCheckbox
