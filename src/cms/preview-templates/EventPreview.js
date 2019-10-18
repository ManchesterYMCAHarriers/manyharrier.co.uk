import React from 'react'
import PropTypes from 'prop-types'
import {EventTemplate} from '../../templates/event'
import Moment from "moment";

const EventPreview = ({entry, widgetFor, fieldsMetaData}) => {
  const startsAt = Moment.utc(entry.getIn(['data', 'startsAt']))

  let championship, venue, infoForChampionship, infoForCompetition,
    infoForEventType, infoForTerrain, session

  if (entry.getIn(['data', 'championshipForeignKey'])) {
    championship = {
      slug: "#",
      title: entry.getIn(['data', 'championshipForeignKey']),
    }
  }

  const venueForeignKey = entry.getIn(['data', 'venueForeignKey'])

  if (venueForeignKey) {
    console.log(fieldsMetaData)
    console.log(fieldsMetaData.toString())
    console.log(fieldsMetaData.getIn(['venues']))

    const venueObj = fieldsMetaData.getIn(['venues', venueForeignKey]).toJS()

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

  if (entry.getIn(['data', 'competitionForeignKey'])) {
    tags.push({
      key: "competition",
      value: entry.getIn(['data', 'competitionForeignKey']),
    })
  }

  if (fieldsMetaData.getIn(['info', entry.getIn(['data', 'championshipForeignKey'])])) {
    infoForChampionship = <p>Info for championship</p>
  }

  if (fieldsMetaData.getIn(['info', entry.getIn(['data', 'competitionForeignKey'])])) {
    infoForCompetition = <p>Info for competition</p>
  }

  if (fieldsMetaData.getIn(['info', entry.getIn(['data', 'eventType'])])) {
    infoForEventType = <p>Info for event type</p>
  }

  if (fieldsMetaData.getIn(['info', entry.getIn(['data', 'terrain'])])) {
    infoForTerrain = <p>Info for terrain</p>
  }

  if (fieldsMetaData.getIn(['sessions', entry.getIn(['data', 'sessionForeignKey'])])) {
    session = <p>Session info</p>
  }

  return (
    <EventTemplate championship={championship} startsAt={startsAt} venue={venue}
                   title={entry.getIn(['data', 'eventKey'])} tags={tags}
                   eventInfo={widgetFor('body')}
                   infoForChampionship={infoForChampionship}
                   infoForCompetition={infoForCompetition}
                   infoForEventType={infoForEventType}
                   infoForTerrain={infoForTerrain}
                   session={session}
    />
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
