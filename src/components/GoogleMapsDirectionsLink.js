import React from 'react'
import PropTypes from 'prop-types'
import { FaCompass } from 'react-icons/fa'

class GoogleMapsDirectionsLink extends React.Component {
  render() {
    const { location, text } = this.props
    const { lat, lng } = location
    const googleMapsDirectionsLink =
      'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng

    return (
      <a className="button is-fullwidth" href={googleMapsDirectionsLink}>
        <span className="icon">
          <FaCompass />
        </span>
        <span>{text}</span>
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
