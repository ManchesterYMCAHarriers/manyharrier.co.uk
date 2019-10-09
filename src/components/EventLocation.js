import React from "react"
import PropTypes from "prop-types"
import {Link} from "gatsby"
import GoogleMapsDirectionsLink from "./GoogleMapsDirectionsLink";

class EventLocation extends React.Component {
  render() {
    const {venue} = this.props

    return (
      <div className="event-location">
        <div className="address">
          <Link className="is-size-5"
                to={venue.fields.slug}>{venue.frontmatter.title}</Link>
          {
            venue.frontmatter.address.split("\n").map((part, i) => (
              <div key={"venue-address-" + i}>{part}</div>
            ))
          }
        </div>
        <GoogleMapsDirectionsLink location={venue.fields.location}
                                  text={"Navigate with Google Maps"} />
      </div>
    )
  }
}

EventLocation.propTypes = {
  venue: PropTypes.object
}

export default EventLocation
