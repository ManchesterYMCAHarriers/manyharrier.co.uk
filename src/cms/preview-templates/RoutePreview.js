import React from 'react'
import PropTypes from 'prop-types'
import { RouteTemplate } from '../../templates/route'

const RoutePreview = ({ entry, widgetFor }) => {
  const routeTrack = JSON.parse(entry.getIn(['data', 'routeTrack']))
  routeTrack.coordinates = routeTrack.coordinates.map(coords => {
    return coords.reverse()
  })

  return (
    <RouteTemplate
      title={entry.getIn(['data', 'title'])}
      events={entry.getIn(['data', 'events'])}
      routeTrack={routeTrack}
      information={widgetFor('body')}
    />
  )
}

RoutePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default RoutePreview
