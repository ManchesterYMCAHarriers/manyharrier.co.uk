import React from "react"
import PropTypes from "prop-types"
import {Link} from "gatsby"
import GoogleMapsDirectionsLink from "./GoogleMapsDirectionsLink";
import GoogleMapsLocation from "./GoogleMapsLocation";

class EventLocation extends React.Component {
  render() {
    const {venue} = this.props
    const {title, address} = venue.frontmatter
    const {location, slug} = venue.fields

    return (
      <div className="event-location" style={{
        marginBottom: "1rem"
      }}>
        <div className="address" style={{
          marginBottom: "1rem"
        }}>
          <div
            className="is-size-5 has-text-weight-bold">{title}</div>
          {
            address.split("\n").map((part, i) => (
              <div key={"venue-address-" + i}>{part}</div>
            ))
          }
        </div>
        <GoogleMapsLocation location={location} zoom={13} mapsContainerStyle={{
          marginBottom: "1rem",
          height: "360px",
          width: "100%",
        }} />
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
  venue: PropTypes.object
}

export default EventLocation
