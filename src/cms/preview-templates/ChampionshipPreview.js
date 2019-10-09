import React from 'react'
import PropTypes from 'prop-types'
import { ChampionshipTemplate } from '../../templates/championship'

const ChampionshipPreview = ({ entry, widgetFor }) => {
  return (
    <ChampionshipTemplate
      title={entry.getIn(['data', 'title'])}
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
