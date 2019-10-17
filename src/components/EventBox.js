import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import {Link} from "gatsby";
import EventTags from "./EventTags";

class EventBox extends React.Component {
  render() {
    const {startsAt, slug, tags, title} = this.props

    return (
      <Link className={"box"} to={slug}>
        <div className="columns">
          <div className="column">
            <div className="title is-size-4">{title}</div>
            <div className="subtitle is-size-6">
              <div>{startsAt.format("dddd Do MMMM YYYY")}</div>
              <div>{startsAt.format("h:mma")}</div>
            </div>
          </div>
          <div className="column">
            <EventTags reactKey={"next-event-" + slug} tags={tags} />
          </div>
        </div>
      </Link>
    )
  }
}

EventBox.propTypes = {
  startsAt: PropTypes.instanceOf(Moment).isRequired,
  slug: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  title: PropTypes.string.isRequired,
}

export default EventBox
