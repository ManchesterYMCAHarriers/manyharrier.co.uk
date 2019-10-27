import React from 'react'
import PropTypes from 'prop-types'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

class GoogleMapsLocation extends React.Component {
  render() {
    const {
      googleMapsApiKey,
      id,
      location,
      mapContainerClassName,
      mapContainerStyle,
      zoom,
    } = this.props

    return (
      <LoadScript id={id + '-script'} googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          id={id}
          center={location}
          zoom={zoom}
          mapContainerStyle={mapContainerStyle}
          mapContainerClassName={mapContainerClassName}
        >
          <Marker clickable={false} position={location} />
        </GoogleMap>
      </LoadScript>
    )
  }
}

GoogleMapsLocation.propTypes = {
  googleMapsApiKey: PropTypes.string.isRequired,
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
