import React from 'react'
import PropTypes from 'prop-types'
import {GoogleMap, LoadScript, Marker, Polyline} from '@react-google-maps/api'

class GoogleMapsLocationAndRoute extends React.Component {
  render() {
    const {googleMapsApiKey, id, location, track, mapContainerClassName, mapContainerStyle, zoom} = this.props

    const onLoadHandler = map => {
      const bounds = new window.google.maps.LatLngBounds();
      track.forEach(coord => {
        bounds.extend(coord);
      });
      map.fitBounds(bounds);
    }

    return (
      <LoadScript
        id={id + "-script"}
        googleMapsApiKey={googleMapsApiKey}
      >
        <GoogleMap
          id={id}
          mapContainerClassName={mapContainerClassName}
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={location}
          onLoad={onLoadHandler}
        >
          <Polyline
            path={track}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              clickable: false,
              draggable: false,
              editable: false,
              visible: true,
              radius: 30000,
              paths: track,
              zIndex: 1
            }}
          />
          <Marker clickable={false} position={location} />
        </GoogleMap>
      </LoadScript>
    )
  }
}

GoogleMapsLocationAndRoute.propTypes = {
  googleMapsApiKey: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  mapContainerClassName: PropTypes.string,
  mapContainerStyle: PropTypes.object,
  track: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  })).isRequired,
  zoom: PropTypes.number,
}

GoogleMapsLocationAndRoute.defaultProps = {
  zoom: 14,
}

export default GoogleMapsLocationAndRoute
