import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import {Link} from "gatsby";

class EventBox extends React.Component {
  render() {
    const { eventTitle, preTitle, startsAt, slug, venueName } = this.props

    return (
      <Link className={"box"} to={slug}>
        {preTitle && <div className="has-text-weight-semibold has-text-grey">{preTitle}: </div>}
        <div className="is-size-4 has-text-weight-bold">{eventTitle}</div>
        <div className="is-inline-tablet is-6 has-text-weight-semibold">
          <span className="is-block-mobile">{startsAt.format("dddd Do MMMM YYYY")}</span>
          <span className="is-hidden-mobile">, </span>
          <span className="is-block-mobile">{startsAt.format("h:mma")}</span>
        </div>
        <div>{venueName}</div>
      </Link>
    )
  }
}

EventBox.propTypes = {
  eventTitle: PropTypes.string.isRequired,
  preTitle: PropTypes.string,
  startsAt: PropTypes.instanceOf(Moment).isRequired,
  slug: PropTypes.string.isRequired,
  venueName: PropTypes.string.isRequired
}

export default EventBox
