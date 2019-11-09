import React from 'react'
import PropTypes from 'prop-types'
import { StandardPageTemplate } from '../../templates/standard-page'

const CommitteePagePreview = ({ entry, widgetFor }) => {
  const entryCommitteeMembers = entry.getIn(['data', 'members'])
  const committeeMembers = entryCommitteeMembers
    ? entryCommitteeMembers.toJS()
    : []

  return (
    <StandardPageTemplate
      title={entry.getIn(['data', 'title'])}
      description={entry.getIn(['data', 'description'])}
      intro={entry.getIn(['data', 'intro'])}
      members={committeeMembers}
    />
  )
}

CommitteePagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default CommitteePagePreview
