import React from "react"
import PropTypes from "prop-types"

class StandardContentContainer extends React.Component {
  render() {
    const {children} = this.props

    return (
      <section className="section">
        <div className="container content">
          <div className="columns">
            <div className="column is-10 is-offset-1">
              {children}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

StandardContentContainer.propTypes = {
  children: PropTypes.node
}

export default StandardContentContainer
