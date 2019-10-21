import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'

class InputDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationMessage: null,
    }
  }

  componentDidMount() {
    const {inputId, setFormValidationState, validationMessages} = this.props

    document.getElementById(inputId).querySelectorAll('input').forEach(el => {

      el.addEventListener('invalid', () => {
        const failureStates = [
          'valueMissing',
          'badInput',
          'typeMismatch',
          'patternMismatch',
          'rangeOverflow',
          'rangeUnderflow',
          'stepMismatch',
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
            let parent = el.closest('.is-field')
            if (!parent) {
              parent = el.closest('.date-field')
            }
            parent.classList.add('has-error')
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
          let parent = el.closest('.is-field')
          if (!parent) {
            parent = el.closest('.date-field')
          }
          parent.classList.remove('has-error')
        }
      }, false)
    })
  }

  render() {
    const {hint, inputAttributes, inputId, label, yearAttributes} = this.props

    return (
      <div id={inputId} className="date-field">
        {label &&
        <p className="label">{label}</p>
        }
        {hint &&
        <p className="hint">{hint}</p>
        }
        {this.state.validationMessage &&
        <p className="validation-message">{this.state.validationMessage}</p>
        }
        <div className="columns">
          <div className="column is-narrow">
            <div className="field">
              <label className="label" htmlFor={inputId + "-day"}>Day</label>
              <div className="control">
                <input className="input" id={inputId + "-day"}
                       name={inputId + "-day"} type="number" min="1" max="31"
                       step="1" {...inputAttributes} />
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <div className="field">
              <label className="label"
                     htmlFor={inputId + "-month"}>Month</label>
              <div className="control">
                <input className="input" id={inputId + "-month"}
                       name={inputId + "-month"} type="number" min="1" max="12"
                       step="1" {...inputAttributes} />
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <div className="field">
              <label className="label" htmlFor={inputId + "-year"}>Year</label>
              <div className="control">
                <input className="input" id={inputId + "-year"}
                       name={inputId + "-year"} type="number"
                       step="1" {...yearAttributes} {...inputAttributes} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

InputDate.propTypes = {
  hint: PropTypes.string,
  inputAttributes: PropTypes.shape({
    required: PropTypes.bool,
  }),
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string,
  minDate: PropTypes.instanceOf(Moment),
  maxDate: PropTypes.instanceOf(Moment),
  setFormValidationState: PropTypes.func.isRequired,
  yearAttributes: PropTypes.shape({
    min: PropTypes.string,
    max: PropTypes.string,
  }),
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
}

InputDate.defaults = {
  validationMessages: {},
}

export default InputDate
