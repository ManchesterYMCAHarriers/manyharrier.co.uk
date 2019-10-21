import React from 'react'
import PropTypes from 'prop-types'
import ProgressBar from "./ProgressBar";

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: 0,
      submitValue: this.props.submitValue,
    }
  }

  componentDidMount() {
    const {children, formId, nextValue, submitHandler, submitValue} = this.props

    const form = document.getElementById(formId)
    form.setAttribute("noValidate", true)

    for (let i = 1; i < children.length; i++) {
      const el = this.props.children[i]
      console.log("el", el)
      el.classList.add('is-hidden')
    }

    if (children.length > 1) {
      this.setState({
        submitValue: nextValue,
      })
    }

    form.addEventListener('submit', ev => {
      ev.preventDefault()
      const form = ev.target
      const stage = this.state.stage
      // Validate
      let valid = true
      form.querySelectorAll('fieldset:not(.is-hidden) input, fieldset:not(.is-hidden) textarea, fieldset:not(.is-hidden) select').forEach(el => {
        if (!el.checkValidity()) {
          valid = false
        }
      })

      if (!valid) {
        form.querySelector('fieldset:not(.is-hidden) legend').scrollIntoView()
        form.querySelector('.notification.is-danger').focus({
          preventScroll: true,
        })
        return
      }

      if (stage === children.length - 1) {
        // fetch('/', {
        //   method: 'POST',
        //   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        //   body: encode({
        //     'form-name': form.getAttribute('name'),
        //     ...this.state,
        //   }),
        // })
        //   .then(() => navigate(form.getAttribute('action')))
        //   .catch(error => alert(error))
        submitHandler()
        return
      }
      if (stage === children.length - 2) {
        this.setState({
          submitValue: submitValue,
        })
      }
      if (stage < children.length - 1) {
        form.querySelector('button.back-button').classList.remove('is-hidden')
        this.props.children[stage].classList.add('is-hidden')
        this.props.children[stage + 1].classList.remove('is-hidden')
      }
    })
  }

  handleBack = ev => {
    ev.preventDefault()

    const {formId} = this.props

    const form = document.getElementById(formId)

    const stage = this.state.stage
    if (stage === 1) {
      form.querySelector('button.back-button').classList.add('is-hidden')
    }
    this.props.children[stage].classList.add('is-hidden')
    this.props.children[stage - 1].classList.remove('is-hidden')
  }

  render() {
    const {action, backValue, children, formAttributes, formId, method, validationIssues} = this.props

    return (
      <form
        name={formId}
        id={formId}
        method={method}
        action={action}
        {...formAttributes}
      >
        {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
        <input type="hidden" name="form-name" value={formId} />
        {children.length > 1 &&
        <ProgressBar max={children.length} value={this.state.stage}
                     validationIssues={validationIssues} />
        }
        {children}
        <div className="columns is-mobile">
          <div className="column">
            <button type="button" className="button back-button is-hidden"
                    onClick={this.handleBack}>{backValue}</button>
          </div>
          <div className="column has-text-right">
            <button type="submit"
                    className="button forward-button is-link">{this.state.submitValue}</button>
          </div>
        </div>
      </form>
    )
  }
}

Form.propTypes = {
  action: PropTypes.string.isRequired,
  backValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  formAttributes: PropTypes.object,
  formId: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  nextValue: PropTypes.string.isRequired,
  submitHandler: PropTypes.func.isRequired,
  submitValue: PropTypes.string.isRequired,
  validationIssues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired
}

Form.defaults = {
  backValue: "Back",
  method: "POST",
  nextValue: "Next",
  submitValue: "Submit",
}

export default Form
