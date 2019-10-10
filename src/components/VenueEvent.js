import React from "react"
import PropTypes from "prop-types"
import Moment from "moment"
import { Link } from "gatsby"

class VenueEvent extends React.Component {
  render() {
    const { event } = this.props
    const { slug } = event
    const { title } = event.frontmatter

    const startsAt = Moment.utc(event.frontmatter.startsAt)

    return (
      <Link to={slug} className="box">
        <h3>{title}</h3>
        <div className="is-inline-tablet">{startsAt.format("dddd Do MMMM YYYY")}</div>
        <span className="is-hidden-mobile">, </span>
        <div className="is-inline-tablet">{startsAt.format("h:mma")}</div>
      </Link>
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
