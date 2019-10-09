import React from 'react'
import PropTypes from 'prop-types'
import { SessionTemplate } from '../../templates/session'

const SessionPreview = ({ entry, widgetFor }) => {
  return (
    <SessionTemplate
      title={entry.getIn(['data', 'title'])}
      information={widgetFor('body')}
    />
  )
}

SessionPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default SessionPreview
