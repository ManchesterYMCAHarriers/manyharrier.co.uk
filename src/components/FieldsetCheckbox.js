import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from "./ValidationSummary";

class FieldsetCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationMessage: null,
    }
  }

  componentDidMount() {
    const {inputId, setFormValidationState, validationMessages} = this.props

    const el = document.getElementById(inputId)

    el.addEventListener('invalid', () => {
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
    }, false)

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
    }, false)
  }

  render() {
    const { inputAttributes, inputId, legend, statements, label, value, validationIssues, visible } = this.props
    return (
      <fieldset className={"section is-field" + (visible ? "" : " is-hidden") + (validationIssues.length > 0 ? " has-error" : "")}>
        <legend>
          <h2 className="title is-size-3">{legend}</h2>
        </legend>
        <ValidationSummary validationIssues={validationIssues} />
        {statements}
        {this.state.validationMessage &&
        <p className="validation-message">{this.state.validationMessage}</p>
        }
        <div className="field">
          <label className="checkbox">
            <input type="checkbox" className="checkbox" id={inputId} name={inputId} value={value} {...inputAttributes} />&nbsp;{label}
          </label>
        </div>
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
  validationIssues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired,
  visible: PropTypes.bool.isRequired,
}

FieldsetCheckbox.defaults = {
  validationIssues: [],
}

export default FieldsetCheckbox
