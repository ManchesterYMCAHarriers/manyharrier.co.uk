import React from 'react'
import PropTypes from 'prop-types'
import { InfoTemplate } from '../../templates/info'

const InfoPreview = ({ entry, widgetFor }) => {
  return (
    <InfoTemplate
      title={entry.getIn(['data', 'title'])}
      information={widgetFor('body')}
    />
  )
}

InfoPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default InfoPreview
