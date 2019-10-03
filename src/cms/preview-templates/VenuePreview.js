import React from 'react'
import PropTypes from 'prop-types'
import { VenueTemplate } from '../../templates/venue'

const VenuePreview = ({ entry, widgetFor }) => {


  return (
    <VenueTemplate
      title={entry.getIn(['data', 'title'])}
      address={entry.getIn(['data', 'address'])}
      location={entry.getIn(['data', 'location'])}
      information={widgetFor('information')}
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
