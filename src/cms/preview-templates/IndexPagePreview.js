import React from 'react'
import PropTypes from 'prop-types'
import { IndexPageTemplate } from '../../templates/index-page'
import Moment from 'moment'

const IndexPagePreview = ({ entry, widgetFor }) => {
  const events = []

  for (let i = 1; i <= 3; i++) {
    const tags = [
      {
        key: 'venue',
        value: 'Venue',
      },
      {
        key: 'eventType',
        value: 'Event Type',
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

  events.push({
    slug: '#',
    startsAt: Moment.utc().startOf('year'),
    tags: [
      {
        key: 'eventType',
        value: 'Social',
      },
    ],
    title: 'Dummy social',
  })

  return (
    <IndexPageTemplate
      title={entry.getIn(['data', 'title'])}
      body={widgetFor('body')}
      nextEvents={events}
    />
  )
}

IndexPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default IndexPagePreview
