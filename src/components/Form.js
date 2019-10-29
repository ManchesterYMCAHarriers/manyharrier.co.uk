import React from 'react'
import PropTypes from 'prop-types'
import ProgressBar from './ProgressBar'

class Form extends React.Component {
  componentDidMount() {
    const {formId, submitHandler} = this.props

    const form = document.getElementById(formId)
    form.setAttribute('noValidate', 'true')

    form.addEventListener('submit', submitHandler, false)
  }

  render() {
    const {
      action,
      backHandler,
      backValue,
      children,
      formAttributes,
      formId,
      method,
      showBack,
      showSubmit,
      stage,
      stages,
      submitValue,
      validationIssues,
    } = this.props

    return (
      <form
        name={formId}
        id={formId}
        method={method}
        action={action}
        {...formAttributes}
        data-netlify="true"
      >
        {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
        <input type="hidden" name="form-name" value={formId} />
        {children.length > 1 && (
          <ProgressBar
            stage={stage}
            stages={stages}
            validationIssues={validationIssues}
          />
        )}
        {children}
        <div className="columns">
          <div className="column is-10 form-navigation is-offset-1">
            <button
              type="submit"
              className={
                'button forward-button is-link ' + (!showSubmit && ' is-hidden')
              }
            >
              {submitValue}
            </button>
            <button
              type="button"
              className={
                'button back-button is-pulled-left ' + (!showBack && ' is-hidden')
              }
              onClick={backHandler}
            >
              {backValue}
            </button>
          </div>
        </div>
      </form>
    )
  }
}

Form.propTypes = {
  action: PropTypes.string,
  backHandler: PropTypes.func.isRequired,
  backValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  formAttributes: PropTypes.object,
  formId: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  showBack: PropTypes.bool.isRequired,
  showSubmit: PropTypes.bool.isRequired,
  submitHandler: PropTypes.func.isRequired,
  submitValue: PropTypes.string.isRequired,
  validationIssues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
}

Form.defaults = {
  backValue: 'Back',
  method: 'POST',
  nextValue: 'Next',
  submitValue: 'Submit',
}

export default Form
