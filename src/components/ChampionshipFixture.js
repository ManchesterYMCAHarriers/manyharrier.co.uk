import React from "react"
import PropTypes from "prop-types"
import {Link} from "gatsby"
import Moment from "moment"

class ChampionshipFixture extends React.Component {
  render() {
    const { event } = this.props
    const { slug } = event
    const { title, venue } = event.frontmatter
    const startsAt = Moment.utc(event.frontmatter.startsAt)

    return (
      <Link className={"box"} to={slug} key={slug}>
        <div className="columns">
          <div className="column">
            <h3>{title}</h3>
            <div className="is-inline-tablet">{startsAt.format("dddd Do MMMM YYYY")}</div>
            <span className="is-hidden-mobile">, </span>
            <div className="is-inline-tablet">{startsAt.format("h:mma")}</div>
          </div>
          <div className="column">
            <div className="has-text-weight-bold">{venue.frontmatter.title}</div>
            {venue.frontmatter.address.split("\n").map(part => (
              <div>{part}</div>
            ))}
          </div>
        </div>
      </Link>
    )
  }
}

ChampionshipFixture.propTypes = {
  event: PropTypes.shape({
    slug: PropTypes.string,
    frontmatter: PropTypes.shape({
      startsAt: PropTypes.string,
      title: PropTypes.string,
      venue: PropTypes.object,
    }),
  })
}

export default ChampionshipFixture
