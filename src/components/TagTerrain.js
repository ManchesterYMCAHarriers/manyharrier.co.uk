import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'

class TagTerrain extends React.Component {
  render() {
    const { tag } = this.props
    const tagClassName = kebabCase("is-" + tag)

    return (
      <span className={"tag " + tagClassName}>{tag}</span>
    )
  }
}

TagTerrain.propTypes = {
  tag: PropTypes.string
}

export default TagTerrain
