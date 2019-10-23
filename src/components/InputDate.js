import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'

class InputDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: null,
      month: null,
      year: null,
      validationMessage: null,
    }
  }

  componentDidMount() {
    const {earliestDate, latestDate, inputAttributes, inputId, setFormValidationState, validationMessages} = this.props

    const day = document.getElementById(inputId + "-day")
    const month = document.getElementById(inputId + "-month")
    const year = document.getElementById(inputId + "-year")

    const checkValidity = () => {
      if (inputAttributes.required) {
        if (day.validity.valueMissing && month.validity.valueMissing && year.validity.valueMissing) {
          this.setState({
            validationMessage: validationMessages['valueMissing']
          })
          setFormValidationState({
            id: inputId,
            message: validationMessages['valueMissing']
          })
          return false
        }

        if (day.validity.valueMissing) {
          this.setState({
            validationMessage: validationMessages['dayValueMissing']
          })
          setFormValidationState({
            id: inputId,
            message: validationMessages['dayValueMissing']
          })
          return false
        }

        if (month.validity.valueMissing) {
          this.setState({
            validationMessage: validationMessages['monthValueMissing']
          })
          setFormValidationState({
            id: inputId,
            message: validationMessages['monthValueMissing']
          })
          return false
        }

        if (year.validity.valueMissing) {
          this.setState({
            validationMessage: validationMessages['yearValueMissing']
          })
          setFormValidationState({
            id: inputId,
            message: validationMessages['yearValueMissing']
          })
          return false
        }
      }

      if (day.validity.typeMismatch || day.validity.stepMismatch || day.validity.rangeUnderflow || day.validity.rangeOverflow || day.validity.badInput ||
        month.validity.typeMismatch || month.validity.stepMismatch || month.validity.rangeUnderflow || month.validity.rangeOverflow || month.validity.badInput ||
        year.validity.typeMismatch || year.validity.stepMismatch || year.validity.badInput) {
        this.setState({
          validationMessage: validationMessages['invalidDate']
        })
        setFormValidationState({
          id: inputId,
          message: validationMessages['invalidDate']
        })

        return false
      }

      if (year.value && month.value && day.value) {
        const dateValue = Moment.utc(year.value + "-" + month.value + "-" + day.value, "YYYY-MM-DD")

        if (earliestDate && dateValue.isBefore(earliestDate)) {
          this.setState({
            validationMessage: validationMessages['beforeEarliestDate']
          })
          setFormValidationState({
            id: inputId,
            message: validationMessages['beforeEarliestDate']
          })

          return false
        }

        if (latestDate && dateValue.isAfter(latestDate)) {
          this.setState({
            validationMessage: validationMessages['afterLatestDate']
          })
          setFormValidationState({
            id: inputId,
            message: validationMessages['afterLatestDate']
          })

          return false
        }
      }

      this.setState({
        validationMessage: null,
      })
      setFormValidationState({
        id: inputId,
      })

      return true
    }

    day.addEventListener('invalid', checkValidity, false)
    month.addEventListener('invalid', checkValidity, false)
    year.addEventListener('invalid', checkValidity, false)

    day.addEventListener('change', () => {
      this.setState({
        day: day.value,
      }, () => {
        if (this.state.month && this.state.year) {
          checkValidity()
        }
      })
    }, false)

    month.addEventListener('change', () => {
      this.setState({
        month: month.value,
      }, () => {
        if (this.state.day && this.state.year) {
          checkValidity()
        }
      })
    })

    year.addEventListener('change', () => {
      this.setState({
        year: year.value,
      }, () => {
        if (this.state.day && this.state.month) {
          checkValidity()
        }
      })
    })
  }

  render() {
    const {autoCompleteDay, autoCompleteMonth, autoCompleteYear, earliestDate, latestDate, hint, inputAttributes, inputId, label} = this.props

    return (
      <div
        className={"date-field" + (label && this.state.validationMessage ? " has-error" : "")}>
        <input type="date" readOnly={true} className="is-hidden" name={inputId}
               id={inputId}
               value={this.state.year + "-" + this.state.month + "-" + this.state.day} />
        {label &&
        <p className="label">{label}</p>
        }
        {hint &&
        <p className="hint">{hint}</p>
        }
        {this.state.validationMessage &&
        <p className="validation-message">{this.state.validationMessage}</p>
        }
        <div className="columns is-mobile">
          <div className="column is-narrow">
            <div className="field">
              <label className="label" htmlFor={inputId + "-day"}>Day</label>
              <div className="control">
                <input className="input" id={inputId + "-day"}
                       name={inputId + "-day"} type="number" min="1" max="31"
                       step="1" {...inputAttributes} autoComplete={autoCompleteDay} />
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
                       step="1" {...inputAttributes} autoComplete={autoCompleteMonth} />
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <div className="field">
              <label className="label" htmlFor={inputId + "-year"}>Year</label>
              <div className="control">
                <input className="input" id={inputId + "-year"}
                       min={earliestDate && earliestDate.year()}
                       max={latestDate && latestDate.year()}
                       name={inputId + "-year"} type="number"
                       step="1" {...inputAttributes} autoComplete={autoCompleteYear} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

InputDate.propTypes = {
  autoCompleteDay: PropTypes.string,
  autoCompleteMonth: PropTypes.string,
  autoCompleteYear: PropTypes.string,
  hint: PropTypes.string,
  inputAttributes: PropTypes.shape({
    required: PropTypes.bool,
  }),
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string,
  earliestDate: PropTypes.instanceOf(Moment),
  latestDate: PropTypes.instanceOf(Moment),
  setFormValidationState: PropTypes.func.isRequired,
  validationMessages: PropTypes.shape({
    valueMissing: PropTypes.string.isRequired,
    dayValueMissing: PropTypes.string.isRequired,
    monthValueMissing: PropTypes.string.isRequired,
    yearValueMissing: PropTypes.string.isRequired,
    invalidDate: PropTypes.string.isRequired,
    beforeEarliestDate: PropTypes.string,
    afterLatestDate: PropTypes.string,
  }),
}

InputDate.defaults = {
  validationMessages: {},
}

export default InputDate
