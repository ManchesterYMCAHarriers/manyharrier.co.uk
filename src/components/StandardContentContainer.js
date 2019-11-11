import React from 'react'
import PropTypes from 'prop-types'

class StandardContentContainer extends React.Component {
  render() {
    const { children } = this.props

    return (
      <main className="bg-gray-300">
        <div className="max-w-6xl mx-auto p-4">{children}</div>
      </main>
    )
  }
}

StandardContentContainer.propTypes = {
  children: PropTypes.node,
}

export default StandardContentContainer
