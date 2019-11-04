import React from 'react'
import PropTypes from 'prop-types'
import { StandardPageTemplate } from '../../templates/standard-page'

const StandardPagePreview = ({ entry, widgetFor }) => (
  <StandardPageTemplate
    title={entry.getIn(['data', 'title'])}
    description={entry.getIn(['data', 'description'])}
    content={widgetFor('body')}
  />
)

StandardPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default StandardPagePreview
