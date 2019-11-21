import React from 'react'
import * as PropTypes from 'prop-types'
import { CallToActionBackButton, CallToActionButton } from './CallToAction'

class Form extends React.Component {
  componentDidMount() {
    const { formId, submitHandler } = this.props

    const form = document.getElementById(formId)
    form.setAttribute('noValidate', 'true')

    form.addEventListener('submit', submitHandler, false)
  }

  render() {
    const {
      action,
      backHandler,
      backHighlighted,
      backValue,
      children,
      externalError,
      formAttributes,
      formId,
      method,
      netlify,
      showBack,
      showSubmit,
      submitHighlighted,
      submitValue,
    } = this.props

    return (
      <form
        className="mb-8 md:mx-12"
        name={formId}
        id={formId}
        method={method}
        action={action}
        {...formAttributes}
        data-netlify={netlify}
      >
        {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
        <input type="hidden" name="form-name" value={formId} />
        {externalError && (
          <div className="w-full border border-red-400 bg-red-100 p-4">
            <p className="text-xl">There was an error processing this form.</p>
            <p>Sorry for the inconvenience caused. Please try again later.</p>
          </div>
        )}
        {children}
        <div className="flex flex-no-wrap w-full items-baseline justify-between mt-8">
          <div className="flex-shrink-0 flex-grow order-last text-right">
            <CallToActionButton
              type="submit"
              className={`${!showSubmit && `hidden'`}`}
              title={submitValue}
              highlighted={submitHighlighted}
            />
          </div>
          <div className="flex-shrink-0 flex-grow order-first">
            <CallToActionBackButton
              type="button"
              className={`${!showBack && `hidden`}`}
              onClick={backHandler}
              title={backValue}
              highlighted={backHighlighted}
            />
          </div>
        </div>
      </form>
    )
  }
}

Form.propTypes = {
  action: PropTypes.string,
  backHandler: PropTypes.func.isRequired,
  backHighlighted: PropTypes.string,
  backValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  externalError: PropTypes.bool,
  formAttributes: PropTypes.object,
  formId: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  netlify: PropTypes.bool.isRequired,
  showBack: PropTypes.bool.isRequired,
  showSubmit: PropTypes.bool.isRequired,
  submitHandler: PropTypes.func.isRequired,
  submitHighlighted: PropTypes.string,
  submitValue: PropTypes.string.isRequired,
}

Form.defaults = {
  backValue: 'Back',
  externalError: false,
  method: 'POST',
  nextValue: 'Next',
  submitValue: 'Submit',
}

export default Form
