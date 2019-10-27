import React from 'react'
import PropTypes from 'prop-types'
import { SessionTemplate } from '../../templates/session'
import Moment from 'moment'

const SessionPreview = ({ entry, widgetFor }) => {
  const events = []

  for (let i = 1; i <= 3; i++) {
    const tags = [
      {
        key: 'venue',
        value: 'Venue',
      },
      {
        key: 'eventType',
        value: 'eventType',
      },
      {
        key: 'terrain',
        value: 'Terrain',
      },
      {
        key: 'championship',
        value: 'Championship',
      },
      {
        key: 'competition',
        value: 'Competition',
      },
    ]

    events.push({
      slug: '#',
      startsAt: Moment.utc().startOf('year'),
      tags: tags,
      title: 'Dummy event',
    })
  }

  return (
    <SessionTemplate
      title={entry.getIn(['data', 'sessionKey'])}
      events={events}
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
