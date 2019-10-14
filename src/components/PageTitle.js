import React from 'react'
import PropTypes from 'prop-types'

class PageTitle extends React.Component {
  render() {
    const { title } = this.props

    return (
      <h1 className="title is-size-2 has-text-weight-bold is-bold-light">{title}</h1>
    )
  }
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired
}

export default PageTitle
