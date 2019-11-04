import React from 'react'
import * as PropTypes from 'prop-types'

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
        data-netlify="true"
      >
        {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
        <input type="hidden" name="form-name" value={formId} />
        {children}
        <div
          className="flex flex-no-wrap w-full items-baseline justify-between mt-8">
          <div className="flex-shrink-0 flex-grow order-last text-right">
            <button
              type="submit"
              className={
                'px-4 py-2 text-white font-semibold bg-blue-600 hover:bg-blue-800 focus:bg-blue-800 border border-gray-700 rounded ' + (!showSubmit && ' hidden')
              }
            >
              {submitValue}
            </button>
          </div>
          <div className="flex-shrink-0 flex-grow order-first">
            <button
              type="button"
              className={
                'px-4 py-2 text-black font-semibold bg-gray-200 hover:bg-gray-400 focus:bg-gray-400 border border-gray-700 rounded ' +
                (!showBack && ' hidden')
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
}

Form.defaults = {
  backValue: 'Back',
  method: 'POST',
  nextValue: 'Next',
  submitValue: 'Submit',
}

export default Form
