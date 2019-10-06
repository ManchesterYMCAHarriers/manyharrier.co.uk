import React from 'react'
import PropTypes from 'prop-types'
import { VenueTemplate } from '../../templates/venue'

const VenuePreview = ({ entry, widgetFor }) => {
  const location = JSON.parse(entry.getIn(['data', 'location']))
  location.coordinates = location.coordinates.reverse()

  return (
    <VenueTemplate
      title={entry.getIn(['data', 'title'])}
      address={entry.getIn(['data', 'address'])}
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
