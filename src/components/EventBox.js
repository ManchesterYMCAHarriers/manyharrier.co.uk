import React from 'react'
import * as PropTypes from 'prop-types'
import Moment from 'moment'
import { Link } from 'gatsby'

class EventBox extends React.Component {
  render() {
    const { startsAt, slug, title, venue} = this.props

    return (
      <Link to={slug} className="w-full md:mx-2 flex flex-col border-b-2 border-gray-400 hover:border-red-400 hover:bg-gray-200 p-4 pb-2">
        <h3 className="text-xl order-2 font-semibold">{title}</h3>
        <p className="text-sm order-1 font-medium">{startsAt.format('dddd Do MMMM YYYY')}, {startsAt.format('h:mma')}</p>
        {venue && <p className="text-sm order-3 font-light">{venue}</p>}
        <div className="text-xs order-last text-right">
          Full details <span className="text-red-400">&rarr;</span>
        </div>
      </Link>
    )
  }
}

EventBox.propTypes = {
  startsAt: PropTypes.instanceOf(Moment).isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  venue: PropTypes.string,
}

export default EventBox
