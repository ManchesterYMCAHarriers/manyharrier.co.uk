import React from "react"
import PropTypes from "prop-types"

class GoogleMapsDirectionsLink extends React.Component {
  render() {
    const { location, text } = this.props
    const googleMapsDirectionsLink = "https://www.google.com/maps/dir/?api=1&destination=" + location.coordinates.join(",")

    return (
      <a href={googleMapsDirectionsLink}>{text}</a>
    )
  }
}

GoogleMapsDirectionsLink.propTypes = {
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number)
  }),
  text: PropTypes.string
}

export default GoogleMapsDirectionsLink
