import React from 'react'
import PropTypes from 'prop-types'
import {GoogleMap, LoadScript, Polyline} from '@react-google-maps/api'

class GoogleMapsRoute extends React.Component {
  render() {
    const {routeTrack, mapsContainerStyle} = this.props
    const paths = routeTrack.coordinates.map(coords => {
      return {lat: coords[1], lng: coords[2]}
    })

    const googleMapsApiKey = process.env.GATSBY_GOOGLE_MAPS_JAVASCRIPT_API_KEY

    if (!googleMapsApiKey) {
      throw new Error("Google Maps API Key not set")
    }

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
          id='route-map'
          mapContainerStyle={mapsContainerStyle}
          zoom={11}
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
  routeTrack: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
  }).isRequired,
  mapsContainerStyle: PropTypes.object,
}

GoogleMapsRoute.defaultProps = {
  mapsContainerStyle: {
    height: "360px",
    width: "100%",
  },
}

export default GoogleMapsRoute
