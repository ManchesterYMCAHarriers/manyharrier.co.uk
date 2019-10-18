import React from 'react'
import PropTypes from 'prop-types'
import {EventTemplate} from '../../templates/event'
import Moment from "moment";

const EventPreview = ({entry, widgetFor}) => {
  const startsAt = Moment.utc(entry.getIn(['data', 'startsAt']))

  let championship, venue, infoForChampionship, infoForCompetition,
    infoForEventType, infoForTerrain, session

  if (entry.getIn(['data', 'championshipForeignKey'])) {
    championship = {
      slug: "#",
      title: entry.getIn(['data', 'championshipForeignKey']),
    }
  }

  if (entry.getIn(['data', 'venueForeignKey'])) {
    venue = {
      address: ["London", "SW1A 2AA"],
      location: {
        lat: 51.503396,
        lng: -0.12764,
      },
      slug: "#",
      title: "10 Downing Street",
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

  if (entry.getIn(['data', 'championshipForeignKey'])) {
    infoForChampionship = <p>Info for championship</p>
  }

  if (entry.getIn(['data', 'competitionForeignKey'])) {
    infoForCompetition = <p>Info for competition</p>
  }

  if (entry.getIn(['data', 'eventType'])) {
    infoForEventType = <p>Info for event type</p>
  }

  if (entry.getIn(['data', 'terrain'])) {
    infoForTerrain = <p>Info for terrain</p>
  }

  if (entry.getIn(['data', 'sessionForeignKey'])) {
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
  widgetFor: PropTypes.func,
}

export default EventPreview
