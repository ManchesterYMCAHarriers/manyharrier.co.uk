import * as PropTypes from 'prop-types'

const GoogleMapsDirectionsLink = ({ location }) => {
  const { lat, lng } = location
  return 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng
}

GoogleMapsDirectionsLink.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
}

export default GoogleMapsDirectionsLink
