import React from 'react'
import PropTypes from 'prop-types'

class Textarea extends React.Component {
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
        const failureStates = [
          'valueMissing',
          'badInput',
          'patternMismatch',
          'tooLong',
          'tooShort',
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
    const { hint, inputAttributes, inputId, label, rows } = this.props

    return (
      <div
        className={
          'field' + (label && this.state.validationMessage ? ' has-error' : '')
        }
      >
        {label && (
          <label className="label" htmlFor={inputId}>
            {label}
          </label>
        )}
        {hint && <p className="hint">{hint}</p>}
        {this.state.validationMessage && (
          <p className="validation-message">{this.state.validationMessage}</p>
        )}
        <div className="control">
          <textarea
            className="textarea"
            name={inputId}
            id={inputId}
            rows={rows}
            {...inputAttributes}
          />
        </div>
      </div>
    )
  }
}

Textarea.propTypes = {
  hint: PropTypes.string,
  inputAttributes: PropTypes.object,
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string,
  rows: PropTypes.number.isRequired,
  setFormValidationState: PropTypes.func.isRequired,
  validationMessages: PropTypes.shape({
    badInput: PropTypes.string,
    patternMismatch: PropTypes.string,
    tooLong: PropTypes.string,
    tooShort: PropTypes.string,
    valueMissing: PropTypes.string,
  }),
}

Textarea.defaults = {
  rows: 3,
  validationMessages: {},
}

export default Textarea
