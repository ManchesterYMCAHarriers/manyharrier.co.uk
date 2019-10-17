import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import { ChampionshipTemplate } from '../../templates/championship'

const ChampionshipPreview = ({ entry, widgetFor }) => {
  const events = []

  for (let i = 1; i <= 3; i++) {
    const tags = [
      {
        key: "venue",
        value: "Venue",
      },
      {
        key: "terrain",
        value: "Terrain",
      },
      {
        key: "competition",
        value: "Competition",
      },
    ]

    events.push({
      slug: "#",
      startsAt: Moment.utc().startOf('year'),
      tags: tags,
      title: "Dummy event",
    })
  }

  return (
    <ChampionshipTemplate
      events={events}
      title={entry.getIn(['data', 'championshipKey'])}
      information={widgetFor('body')}
    />
  )
}

ChampionshipPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default ChampionshipPreview
