import React from 'react'
import PropTypes from 'prop-types'
import { InfoTemplate } from '../../templates/info'

const InfoPreview = ({ entry, widgetFor }) => {
  const tags = []

  if (entry.getIn(['data', 'forChampionshipKey'])) {
    tags.push({
      key: 'championship',
      value: entry.getIn(['data', 'forChampionshipKey']),
    })
  }

  if (entry.getIn(['data', 'forCompetitionKey'])) {
    tags.push({
      key: 'competition',
      value: entry.getIn(['data', 'forCompetitionKey']),
    })
  }

  if (entry.getIn(['data', 'forEventType'])) {
    tags.push({
      key: 'eventType',
      value: entry.getIn(['data', 'forEventType']),
    })
  }

  if (entry.getIn(['data', 'forTerrain'])) {
    tags.push({
      key: 'terrain',
      value: entry.getIn(['data', 'forTerrain']),
    })
  }

  return (
    <InfoTemplate
      tags={tags}
      title={entry.getIn(['data', 'infoKey'])}
      information={widgetFor('body')}
    />
  )
}

InfoPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default InfoPreview
