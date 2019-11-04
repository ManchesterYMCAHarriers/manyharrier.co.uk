import React from 'react'
import * as PropTypes from 'prop-types'

export const H1 = ({title}) => (
  <h1 className="text-2xl mb-2 md:text-4xl md:mb-4">{title}</h1>
)

H1.propTypes = {
  title: PropTypes.string.isRequired
}

export const H2 = ({title}) => (
  <h2 className="text-xl mb-2 md:text-3xl md:mb-4">{title}</h2>
)

H2.propTypes = {
  title: PropTypes.string.isRequired
}

export const H3 = ({title}) => (
  <h3 className="text-lg mb-2 md:text-2xl md:mb-4">{title}</h3>
)

H3.propTypes = {
  title: PropTypes.string.isRequired
}
