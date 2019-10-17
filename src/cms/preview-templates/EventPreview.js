import React from 'react'
import PropTypes from 'prop-types'
import {EventTemplate} from '../../templates/event'
import Moment from "moment";

const EventPreview = ({entry, widgetFor, fieldsMetaData}) => {
  const startsAt = Moment.utc(entry.getIn(['data', 'startsAt']))

  let championship, venue

  if (entry.getIn(['data', 'championshipForeignKey'])) {
    championship = {
      slug: "#",
      title: entry.getIn(['data', 'championshipForeignKey']),
    }
  }

  if (fieldsMetaData.getIn(['data', 'venueForeignKey'])) {
    const venueObj = fieldsMetaData.getIn(['data', 'venueForeignKey']).toJS()

    const coords = JSON.parse(venueObj.location).coordinates

    venue = {
      address: venueObj.address.split("\n"),
      location: {
        lat: coords[1],
        lng: coords[0],
      },
      slug: "#",
      title: venueObj.venueKey,
    }
  }

  const tags = []

  if (entry.getIn(['data', 'eventType'])) {
    tags.push({
      key: "eventType",
      value: entry.getIn(['data', 'eventType']),
    })
  }

  if (entry.getIn(['data', 'terrain'])) {
    tags.push({
      key: "terrain",
      value: entry.getIn(['data', 'terrain']),
    })
  }

  if (entry.getIn(['data', 'championshipForeignKey'])) {
    tags.push({
      key: "championship",
      value: entry.getIn(['data', 'championshipForeignKey']),
    })
  }

  if (entry.getIn(['data', 'competitionKey'])) {
    tags.push({
      key: "competition",
      value: entry.getIn(['data', 'competitionForeignKey']),
    })
  }

  return (
    <EventTemplate championship={championship} startsAt={startsAt} venue={venue}
                   title={entry.getIn(['data', 'eventKey'])} tags={tags}
                   eventInfo={widgetFor('body')} />
  )
}

EventPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  fieldsMetaData: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default EventPreview
