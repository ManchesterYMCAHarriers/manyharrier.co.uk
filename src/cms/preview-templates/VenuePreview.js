import React from 'react'
import PropTypes from 'prop-types'
import { VenueTemplate } from '../../templates/venue'
import Moment from "moment";

const VenuePreview = ({ entry, widgetFor }) => {
  const coords = JSON.parse(entry.getIn(['data', 'location'])).coordinates
  const location = {
    lat: coords[1],
    lng: coords[0],
  }

  const events = []

  for (let i = 1; i <= 3; i++) {
    const tags = [
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
    <VenueTemplate
      events={events}
      title={entry.getIn(['data', 'venueKey'])}
      address={entry.getIn(['data', 'address']).split("\n")}
      location={location}
      information={widgetFor('body')}
    />
  )
}

VenuePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default VenuePreview
