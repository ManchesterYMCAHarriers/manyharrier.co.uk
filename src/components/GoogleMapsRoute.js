import React from 'react'
import PropTypes from 'prop-types'
import {GoogleMap, LoadScript, Polyline} from '@react-google-maps/api'

class GoogleMapsRoute extends React.Component {
  render() {
    const {googleMapsApiKey, id, paths, mapContainerStyle, mapContainerClassName, zoom} = this.props

    const onLoadHandler = map => {
      const bounds = new window.google.maps.LatLngBounds();
      paths.forEach(coord => {
        bounds.extend(coord);
      });
      map.fitBounds(bounds);
    }

    return (
      <LoadScript
        id="google-maps-script"
        googleMapsApiKey={googleMapsApiKey}
      >
        <GoogleMap
          id={id}
          mapContainerStyle={mapContainerStyle}
          mapContainerClassName={mapContainerClassName}
          zoom={zoom}
          center={{
            lat: 53.476445,
            lng: -2.256367
          }}
          onLoad={onLoadHandler}
        >
          <Polyline
            path={paths}
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
              paths: paths,
              zIndex: 1
            }}
          />
        </GoogleMap>
      </LoadScript>
    )
  }
}

GoogleMapsRoute.propTypes = {
  googleMapsApiKey: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  paths: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  })).isRequired,
  mapContainerStyle: PropTypes.object,
  mapContainerClassName: PropTypes.string,
  zoom: PropTypes.number,
}

GoogleMapsRoute.defaultProps = {
  mapsContainerStyle: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  zoom: 11,
}

export default GoogleMapsRoute
