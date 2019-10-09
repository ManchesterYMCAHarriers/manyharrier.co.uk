import React from 'react'
import PropTypes from 'prop-types'

class TagChampionship extends React.Component {
  render() {
    const { tag } = this.props

    return (
      <span className={"tag is-championship"}>{tag}</span>
    )
  }
}

TagChampionship.propTypes = {
  tag: PropTypes.string
}

export default TagChampionship
