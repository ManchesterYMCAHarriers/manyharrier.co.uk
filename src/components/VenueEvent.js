import React from "react"
import PropTypes from "prop-types"
import Moment from "moment"
import { Link } from "gatsby"

class VenueEvent extends React.Component {
  render() {
    const { event } = this.props
    const { slug } = event.fields
    const { title } = event.frontmatter

    const startsAt = Moment.utc(event.frontmatter.startsAt)

    return (

    )
  }
}

VenueEvent.propTypes = {
  event: PropTypes.shape({
    fields: PropTypes.shape({
      slug: PropTypes.string,
    }),
    frontmatter: PropTypes.shape({
      startsAt: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}

export default VenueEvent
