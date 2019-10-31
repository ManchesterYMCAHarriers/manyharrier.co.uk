import React from 'react'
import PropTypes from 'prop-types'

class SecondaryTitle extends React.Component {
  render() {
    const { title, subtitle } = this.props

    return (
      <div>
        <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
          {title}
        </h2>
        {subtitle && <p className="subtitle is-size-5">{subtitle}</p>}
      </div>
    )
  }
}

SecondaryTitle.propTypes = {
  title: PropTypes.string.isRequired,
}

export default SecondaryTitle
