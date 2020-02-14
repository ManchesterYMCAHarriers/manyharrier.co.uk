import React from 'react'
import * as PropTypes from 'prop-types'
import Moment from 'moment'
import { CardCTA } from './Card'
import { CallToActionText } from './CallToAction'

class EventBox extends React.Component {
  render() {
    const { cancelled, startsAt, slug, title, venue } = this.props

    const fullTitle = cancelled ? `**CANCELLED** ${title}` : title

    return (
      <CardCTA
        to={slug}
        borderColorClassName={`border-gray-400`}
        borderColorHoverClassName={`border-red-manyharrier`}
        title={fullTitle}
        callToAction={<CallToActionText title={'Full details'} />}
      >
        <p className="text-sm font-medium">
          {startsAt.format('dddd Do MMMM YYYY')}, {startsAt.format('h:mma')}
        </p>
        {venue && <p className="text-sm font-light">{venue}</p>}
      </CardCTA>
    )
  }
}

EventBox.propTypes = {
  cancelled: PropTypes.bool,
  startsAt: PropTypes.instanceOf(Moment).isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  venue: PropTypes.string,
}

export default EventBox
