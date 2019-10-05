import React from 'react'
import PropTypes from 'prop-types'
import { EventTemplate } from '../../templates/event'

const EventPreview = ({ entry, widgetFor }) => {
  return (
    <EventTemplate
      title={entry.getIn(['data', 'title'])}
      venue={entry.getIn(['data', 'venue'])}
      startsAt={entry.getIn(['data', 'startsAt'])}
      type={entry.getIn(['data', 'startsAt'])}
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
