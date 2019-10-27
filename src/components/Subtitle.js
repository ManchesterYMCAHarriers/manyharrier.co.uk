import React from 'react'
import PropTypes from 'prop-types'

class Subtitle extends React.Component {
  render() {
    const { text } = this.props

    return <h2 className="is-size-3 has-text-weight-bold">{text}</h2>
  }
}

Subtitle.propTypes = {
  text: PropTypes.string,
}

export default Subtitle
