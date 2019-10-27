import React from 'react'
import PropTypes from 'prop-types'

class SecondaryTitle extends React.Component {
  render() {
    const { title } = this.props

    return (
      <h2 className="title is-size-4 has-text-weight-bold is-bold-light">
        {title}
      </h2>
    )
  }
}

SecondaryTitle.propTypes = {
  title: PropTypes.string.isRequired,
}

export default SecondaryTitle
