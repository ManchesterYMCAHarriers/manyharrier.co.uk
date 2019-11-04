import React from 'react'
import PropTypes from 'prop-types'
import ValidationSummary from './ValidationSummary'

class FieldsetRadios extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validationMessage: null,
    }
  }

  componentDidMount() {
    const {options, setFormValidationState, validationMessages} = this.props

    document
      .querySelectorAll(options.map(({id}) => '#' + id).join(', '))
      .forEach(el => {
        el.addEventListener(
          'invalid',
          () => {
            const failureStates = ['valueMissing']

            for (let i = 0; i < failureStates.length; i++) {
              const failureState = failureStates[i]
              if (
                el.validity[failureState] &&
                validationMessages[failureState]
              ) {
                this.setState({
                  validationMessage: validationMessages[failureState],
                })
                setFormValidationState({
                  id: el.name,
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
                id: el.name,
              })
            }
          },
          false
        )
      })
  }

  render() {
    const {
      hint,
      inputAttributes,
      legend,
      name,
      options,
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
        {hint && <p className="hint">{hint}</p>}
        {this.state.validationMessage && (
          <p className="validation-message">
            {this.state.validationMessage}
          </p>
        )}
        {options.map(({id, label, value}, i) => (
          <label key={name + "-" + i} className="radio block font-semibold relative cursor-pointer my-4 select-none pl-10">
            <input
              type="radio"
              className="absolute opacity-0 cursor-pointer h-0 w-0"
              id={id}
              name={name}
              value={value}
              {...inputAttributes}
            />
            <span className="checkmark" />{label}
          </label>
        ))}
      </fieldset>
    )
  }
}

FieldsetRadios.propTypes = {
  hint: PropTypes.string,
  inputAttributes: PropTypes.object,
  legend: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  setFormValidationState: PropTypes.func.isRequired,
  validationIssues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
  visible: PropTypes.bool.isRequired,
}

FieldsetRadios.defaults = {
  validationIssues: [],
}

export default FieldsetRadios
