import React from 'react'
import * as PropTypes from 'prop-types'

class GoogleMapsDirectionsLink extends React.Component {
  render() {
    const { location, text } = this.props
    const { lat, lng } = location
    const googleMapsDirectionsLink =
      'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng

    return (
      <a
        className="block border-b-2 p-2 border-gray-400 hover:border-red-400 hover:bg-gray-200"
        href={googleMapsDirectionsLink}
      >
        {text} <span className="text-red-400">&rarr;</span>
      </a>
    )
  }
}

GoogleMapsDirectionsLink.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  text: PropTypes.string.isRequired,
}

export default GoogleMapsDirectionsLink
