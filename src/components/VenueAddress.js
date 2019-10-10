import React from "react"
import PropTypes from "prop-types"

class VenueAddress extends React.Component {
  render() {
    const { address } = this.props

    return (
      <div className="is-size-5" style={{
        marginBottom: "1rem"
      }}>
        {address.split("\n").map(line => (
          <div>{line}</div>
        ))}
      </div>
    )
  }
}

VenueAddress.propTypes = {
  address: PropTypes.string
}

export default VenueAddress
