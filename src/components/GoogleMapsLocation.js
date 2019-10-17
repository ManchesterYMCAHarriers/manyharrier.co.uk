import React from 'react'
import PropTypes from 'prop-types'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api'

class GoogleMapsLocation extends React.Component {
  render() {
    const {id, location, mapContainerClassName, mapContainerStyle, zoom} = this.props

    const googleMapsApiKey = process.env.GATSBY_GOOGLE_MAPS_JAVASCRIPT_API_KEY

    if (!googleMapsApiKey) {
      throw new Error("Google Maps API Key not set")
    }

    return (
      <LoadScript
        id={id + "-script"}
        googleMapsApiKey={googleMapsApiKey}
      >
        <GoogleMap
          id={id}
          center={location}
          zoom={zoom}
          mapContainerStyle={mapContainerStyle}
          mapContainerClassName={mapContainerClassName}
        >
          <Marker
            clickable={false}
            position={location}
          />
        </GoogleMap>
      </LoadScript>
    )
  }
}

GoogleMapsLocation.propTypes = {
  id: PropTypes.string.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  mapsContainerClassName: PropTypes.string,
  mapsContainerStyle: PropTypes.object,
  zoom: PropTypes.number,
}

GoogleMapsLocation.defaultProps = {
  zoom: 14,
}

export default GoogleMapsLocation
