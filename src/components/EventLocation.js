import React from "react"
import PropTypes from "prop-types"
import {Link} from "gatsby"
import GoogleMapsDirectionsLink from "./GoogleMapsDirectionsLink";
import GoogleMapsLocation from "./GoogleMapsLocation";
import GoogleMapsLocationAndRoute from "./GoogleMapsLocationAndRoute";

class EventLocation extends React.Component {
  render() {
    const {address, location, mapOptions, slug, title, track} = this.props

    return (
      <div>
        <div>
          <div
            className="is-size-6 has-text-weight-bold">{title}</div>
          {
            address.map((part, i) => (
              <div key={"venue-address-" + i}>{part}</div>
            ))
          }
        </div>
        {track &&
        <GoogleMapsLocationAndRoute id={'location-and-route-map'}
                                    location={location} zoom={mapOptions.zoom}
                                    mapContainerStyle={mapOptions.mapsContainerStyle}
                                    track={track} />
        }
        {!track &&
        <GoogleMapsLocation id={'location-map'} location={location}
                            zoom={mapOptions.zoom}
                            mapsContainerStyle={mapOptions.mapsContainerStyle} />
        }
        <ul>
          <li><GoogleMapsDirectionsLink
            location={location}
            text={"Navigate to " + title + " with Google Maps"} /></li>
          <li><Link to={slug}
                    className={"is-block-mobile"}>Full
            venue information</Link></li>
        </ul>
      </div>
    )
  }
}

EventLocation.propTypes = {
  address: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  mapOptions: PropTypes.shape({
    mapsContainerStyle: PropTypes.object,
    zoom: PropTypes.number,
  }),
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  track: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }))
}

EventLocation.defaultProps = {
  mapOptions: {
    mapsContainerStyle: {
      height: "360px",
      width: "100%",
    },
    zoom: 14,
  },
}

export default EventLocation
