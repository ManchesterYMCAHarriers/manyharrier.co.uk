import React from 'react'
import PropTypes from 'prop-types'
import { RouteTemplate } from '../../templates/route'
import Moment from "moment";

const RoutePreview = ({ entry, widgetFor }) => {
  const routeTrack = JSON.parse(entry.getIn(['data', 'routeTrack'])).coordinates.map(coords => {
    return {
      lat: coords[1],
      lng: coords[0],
    }
  })

  const events = []

  for (let i = 1; i <= 3; i++) {
    const tags = [
      {
        key: "venue",
        value: "Venue",
      },
      {
        key: "eventType",
        value: "eventType",
      },
      {
        key: "terrain",
        value: "Terrain",
      },
      {
        key: "championship",
        value: "Championship",
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
    <RouteTemplate
      title={entry.getIn(['data', 'routeKey'])}
      events={events}
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
