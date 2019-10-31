import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'

class InputDate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      day: null,
      month: null,
      year: null,
      date: '',
      validationMessage: null,
    }
  }

  componentDidMount() {
    const {
      earliestDate,
      latestDate,
      inputAttributes,
      inputId,
      setFormValidationState,
      validationMessages,
    } = this.props

    const day = document.getElementById(inputId + '-day')
    const month = document.getElementById(inputId + '-month')
    const year = document.getElementById(inputId + '-year')

    const checkValidity = () => {
      if (inputAttributes.required) {
        if (
          day.validity.valueMissing &&
          month.validity.valueMissing &&
          year.validity.valueMissing
        ) {
          this.setState({
            validationMessage: validationMessages['valueMissing'],
          })
          setFormValidationState({
            id: inputId + '-day',
            message: validationMessages['valueMissing'],
          })
          return false
        } else {
          this.setState({
            validationMessage: null,
          })
          setFormValidationState({
            id: inputId + '-day',
          })
        }

        if (day.validity.valueMissing) {
          this.setState({
            validationMessage: validationMessages['dayValueMissing'],
          })
          setFormValidationState({
            id: inputId + '-day',
            message: validationMessages['dayValueMissing'],
          })
          return false
        } else {
          this.setState({
            validationMessage: null,
          })
          setFormValidationState({
            id: inputId + '-day',
          })
        }

        if (month.validity.valueMissing) {
          this.setState({
            validationMessage: validationMessages['monthValueMissing'],
          })
          setFormValidationState({
            id: inputId + '-month',
            message: validationMessages['monthValueMissing'],
          })
          return false
        } else {
          this.setState({
            validationMessage: null,
          })
          setFormValidationState({
            id: inputId + '-month',
          })
        }

        if (year.validity.valueMissing) {
          this.setState({
            validationMessage: validationMessages['yearValueMissing'],
          })
          setFormValidationState({
            id: inputId + '-year',
            message: validationMessages['yearValueMissing'],
          })
          return false
        } else {
          this.setState({
            validationMessage: null,
          })
          setFormValidationState({
            id: inputId + '-year',
          })
        }
      }

      if (
        day.validity.typeMismatch ||
        day.validity.stepMismatch ||
        day.validity.rangeUnderflow ||
        day.validity.rangeOverflow ||
        day.validity.badInput ||
        month.validity.typeMismatch ||
        month.validity.stepMismatch ||
        month.validity.rangeUnderflow ||
        month.validity.rangeOverflow ||
        month.validity.badInput ||
        year.validity.typeMismatch ||
        year.validity.stepMismatch ||
        year.validity.badInput
      ) {
        this.setState({
          validationMessage: validationMessages['invalidDate'],
        })
        setFormValidationState({
          id: inputId + '-day',
          message: validationMessages['invalidDate'],
        })

        return false
      } else {
        this.setState({
          validationMessage: null,
        })
        setFormValidationState({
          id: inputId + '-day',
        })
      }

      if (year.value && month.value && day.value) {
        const dateValue = Moment.utc(
          year.value + '-' + month.value + '-' + day.value,
          'YYYY-MM-DD'
        )

        if (earliestDate && dateValue.isBefore(earliestDate)) {
          this.setState({
            validationMessage: validationMessages['beforeEarliestDate'],
          })
          setFormValidationState({
            id: inputId + '-day',
            message: validationMessages['beforeEarliestDate'],
          })

          return false
        } else {
          this.setState({
            validationMessage: null,
          })
          setFormValidationState({
            id: inputId + '-day',
          })
        }

        if (latestDate && dateValue.isAfter(latestDate)) {
          this.setState({
            validationMessage: validationMessages['afterLatestDate'],
          })
          setFormValidationState({
            id: inputId + '-day',
            message: validationMessages['afterLatestDate'],
          })

          return false
        } else {
          this.setState({
            validationMessage: null,
          })
          setFormValidationState({
            id: inputId + '-day',
          })
        }
      }

      this.setState({
        validationMessage: null,
      })
      setFormValidationState({
        id: inputId + 'day',
      })
      setFormValidationState({
        id: inputId + 'month',
      })
      setFormValidationState({
        id: inputId + 'year',
      })

      return true
    }

    day.addEventListener('invalid', checkValidity, false)
    month.addEventListener('invalid', checkValidity, false)
    year.addEventListener('invalid', checkValidity, false)

    day.addEventListener(
      'change',
      () => {
        this.setState(
          {
            day: day.value,
          },
          () => {
            if (this.state.month && this.state.year) {
              if (checkValidity()) {
                const dateValue = Moment.utc(
                  this.state.year +
                    '-' +
                    this.state.month +
                    '-' +
                    this.state.day,
                  'YYYY-MM-DD'
                )
                this.setState({
                  date: dateValue.format('D MMMM YYYY'),
                })
              }
            }
          }
        )
      },
      false
    )

    month.addEventListener('change', () => {
      this.setState(
        {
          month: month.value,
        },
        () => {
          if (this.state.day && this.state.year) {
            if (checkValidity()) {
              const dateValue = Moment.utc(
                this.state.year + '-' + this.state.month + '-' + this.state.day,
                'YYYY-MM-DD'
              )
              this.setState({
                date: dateValue.format('D MMMM YYYY'),
              })
            }
          }
        }
      )
    })

    year.addEventListener('change', () => {
      this.setState(
        {
          year: year.value,
        },
        () => {
          if (this.state.day && this.state.month) {
            if (checkValidity()) {
              const dateValue = Moment.utc(
                this.state.year + '-' + this.state.month + '-' + this.state.day,
                'YYYY-MM-DD'
              )
              this.setState({
                date: dateValue.format('D MMMM YYYY'),
              })
            }
          }
        }
      )
    })
  }

  render() {
    const {
      autoCompleteDay,
      autoCompleteMonth,
      autoCompleteYear,
      earliestDate,
      latestDate,
      hint,
      inputAttributes,
      inputId,
      label,
    } = this.props

    const inputClassNames = ['date-field', 'is-field']

    if (this.state.validationMessage) {
      inputClassNames.push('has-error')
    }

    return (
      <div className={inputClassNames.join(' ')}>
        <input
          type="hidden"
          readOnly={true}
          className="is-hidden"
          name={inputId}
          id={inputId}
          value={this.state.date}
        />
        {label && <p className="label">{label}</p>}
        {hint && <p className="hint">{hint}</p>}
        {this.state.validationMessage && (
          <p className="validation-message">{this.state.validationMessage}</p>
        )}
        <div className="columns is-mobile">
          <div className="column is-narrow">
            <div className="field">
              <label className="label" htmlFor={inputId + '-day'}>
                Day
              </label>
              <div className="control">
                <input
                  className="input"
                  id={inputId + '-day'}
                  name={inputId + '-day'}
                  type="number"
                  min="1"
                  max="31"
                  step="1"
                  {...inputAttributes}
                  autoComplete={autoCompleteDay}
                />
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <div className="field">
              <label className="label" htmlFor={inputId + '-month'}>
                Month
              </label>
              <div className="control">
                <input
                  className="input"
                  id={inputId + '-month'}
                  name={inputId + '-month'}
                  type="number"
                  min="1"
                  max="12"
                  step="1"
                  {...inputAttributes}
                  autoComplete={autoCompleteMonth}
                />
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <div className="field">
              <label className="label" htmlFor={inputId + '-year'}>
                Year
              </label>
              <div className="control">
                <input
                  className="input"
                  id={inputId + '-year'}
                  min={earliestDate && earliestDate.year()}
                  max={latestDate && latestDate.year()}
                  name={inputId + '-year'}
                  type="number"
                  step="1"
                  {...inputAttributes}
                  autoComplete={autoCompleteYear}
                />
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
