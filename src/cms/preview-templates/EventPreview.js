import React from 'react'
import PropTypes from 'prop-types'
import { EventTemplate } from '../../templates/event'

const EventPreview = ({ entry, widgetFor }) => {
  return (
    <EventTemplate
      title={entry.getIn(['data', 'title'])}
      address={entry.getIn(['data', 'address'])}
      location={entry.getIn(['data', 'location'])}
      information={widgetFor('body')}
    />
  )
}

EventPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default EventPreview
