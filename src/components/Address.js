import React from 'react'
import PropTypes from 'prop-types'

class Address extends React.Component {
  render() {
    const { address, title } = this.props

    return (
      <>
        {title && <div className="font-semibold">{title}</div>}
        {address.map((line, i) => (
          <div key={'address-line-' + i}>{line}</div>
        ))}
      </>
    )
  }
}

Address.propTypes = {
  address: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
}

export default Address
