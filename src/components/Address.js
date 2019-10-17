import React from 'react'
import PropTypes from 'prop-types'

class Address extends React.Component {
  render() {
    const {address, title} = this.props

    return (
      <div>
        {title &&
        <div className="is-size-5 has-text-weight-bold">{title}</div>
        }
        {address.map((line, i) => (
          <div key={"address-line-" + i}>{line}</div>
        ))}
      </div>
    )
  }
}

Address.propTypes = {
  address: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
}

export default Address
