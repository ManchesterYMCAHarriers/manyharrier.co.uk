import React from 'react'
import * as PropTypes from 'prop-types'
import {Link} from "gatsby";

const PrimaryCallToAction = ({to, title}) => (
  <Link to={to}
        className="px-4 py-2 font-semibold text-lg border-b-2 border-gray-700 hover:border-red-400 hover:bg-gray-200 focus:border-red-400 focus:bg-gray-200">
    {title}<span className="ml-2 text-red-400">&rarr;</span>
  </Link>
)

PrimaryCallToAction.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

export default PrimaryCallToAction
