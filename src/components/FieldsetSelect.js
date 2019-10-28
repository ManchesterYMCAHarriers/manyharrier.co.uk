import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from './ValidationSummary'

class FieldsetSelect extends React.Component {
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

    el.addEventListener('change', () => {
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
      children,
      hint,
      inputAttributes,
      inputId,
      legend,
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
        <legend className="legend-label">
          <label className="title is-size-3"
                 htmlFor={inputId}>{legend}</label>
        </legend>
        <ValidationSummary validationIssues={validationIssues} />
        {hint && <p className="hint">{hint}</p>}
        {this.state.validationMessage && (
          <p className="validation-message">{this.state.validationMessage}</p>
        )}
        <div className="field select-control">
          <div className="control">
            <div className="select">
              <select id={inputId}
                      name={inputId} {...inputAttributes}>{children}</select>
            </div>
          </div>
        </div>
      </fieldset>
    )
  }
}

FieldsetSelect.propTypes = {
  children: PropTypes.node.isRequired,
  hint: PropTypes.string,
  inputAttributes: PropTypes.object,
  inputId: PropTypes.string.isRequired,
  legend: PropTypes.string.isRequired,
  setFormValidationState: PropTypes.func.isRequired,
  validationIssues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
  visible: PropTypes.bool.isRequired,
}

FieldsetSelect.defaults = {
  validationIssues: [],
}

export default FieldsetSelect
