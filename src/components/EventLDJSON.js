import React from 'react'
import * as PropTypes from "prop-types";
import Moment from "moment";
import {Helmet} from "react-helmet/es/Helmet";

class EventLDJSON extends React.Component {
  render() {
    const { name, startDate, endDate, description, location, image } = this.props

    location["@type"] = "place"
    location.address["@type"] = "PostalAddress"

    const event = {
      "@context": "https://schema.org",
      "@type": "event",
      "name": name,
      "startDate": startDate.format('YYYY-MM-DD[T]HH:mm'),
      "location": location,
    }

    if (endDate) {
      event.endDate = endDate.format('YYYY-MM-DD[T]HH:mm')
    }

    if (description) {
      event.description = description
    }

    if (image && image.length > 0) {
      event.image = image
    }

    return (
      <Helmet>
        <script type={"application/ld+json"}>
          {JSON.stringify(event)}
        </script>
      </Helmet>
    )
  }
}

EventLDJSON.propTypes = {
  name: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Moment).isRequired,
  endDate: PropTypes.instanceOf(Moment),
  description: PropTypes.string,
  image: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({
    address: PropTypes.shape({
      streetAddress: PropTypes.string.isRequired,
      addressLocality: PropTypes.string.isRequired,
      postalCode: PropTypes.string.isRequired,
      addressRegion: PropTypes.string,
      addressCountry: PropTypes.string,
    }).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,

}

export default EventLDJSON
