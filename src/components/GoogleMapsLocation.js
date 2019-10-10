import React from 'react'
import PropTypes from 'prop-types'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api'

class GoogleMapsLocation extends React.Component {
  render() {
    const {location, mapsContainerStyle, zoom} = this.props

    const googleMapsApiKey = process.env.GATSBY_GOOGLE_MAPS_JAVASCRIPT_API_KEY

    if (!googleMapsApiKey) {
      throw new Error("Google Maps API Key not set")
    }

    return (
      <LoadScript
        id="google-maps-script"
        googleMapsApiKey={googleMapsApiKey}
      >
        <GoogleMap
          id='location-map'
          center={{
            lat: location.coordinates[0],
            lng: location.coordinates[1],
          }}
          zoom={zoom}
          mapContainerStyle={mapsContainerStyle}
        >
          <Marker
            clickable={false}
            position={{
              lat: location.coordinates[0],
              lng: location.coordinates[1],
            }}
          />
        </GoogleMap>
      </LoadScript>
    )
  }
}

GoogleMapsLocation.propTypes = {
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
  }).isRequired,
  mapsContainerStyle: PropTypes.object,
  zoom: PropTypes.number,
}

GoogleMapsLocation.defaultProps = {
  mapsContainerStyle: {
    height: "360px",
    width: "100%",
  },
  zoom: 10,
}

export default GoogleMapsLocation
