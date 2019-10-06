import React from 'react'
import PropTypes from 'prop-types'

class GoogleMapsStatic extends React.Component {
  render() {
    const {altText, maxWidth, maxHeight, zoom, location} = this.props
    const apiKey = process.env.GATSBY_GOOGLE_MAPS_STATIC_API_KEY

    if (!apiKey) {
      throw new Error("GATSBY_GOOGLE_MAPS_STATIC_API_KEY not set in environment")
    }

    return (
      <img className="google-maps-static"
           alt={altText}
           style={{width: "100%", maxWidth: maxWidth, maxHeight: maxHeight}}
           src={"https://maps.googleapis.com/maps/api/staticmap?center=&zoom=" + zoom + "&size=" + maxWidth + "x" + maxHeight + "&maptype=roadmap&markers=color:red%7C" + location.coordinates.join(",") + "&key=" + apiKey} />
    )
  }
}

GoogleMapsStatic.propTypes = {
  altText: PropTypes.string,
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number)
  }),
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  zoom: PropTypes.number,
}

GoogleMapsStatic.defaultProps = {
  altText: "Map of venue",
  maxWidth: 640,
  maxHeight: 360,
  zoom: 10,
}

export default GoogleMapsStatic
