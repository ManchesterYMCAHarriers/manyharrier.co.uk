import React from 'react'
import PropTypes from 'prop-types'

class PageTitle extends React.Component {
  render() {
    const {title, subtitle} = this.props

    return (
      <div>
        <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
          {title}
        </h1>
        {subtitle && (
          <p className="subtitle is-size-4">{subtitle}</p>
        )}
      </div>
    )
  }
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
}

export default PageTitle
