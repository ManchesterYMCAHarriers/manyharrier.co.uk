import React from "react";
import * as PropTypes from "prop-types";
import {Link} from "gatsby";

export const CallToActionLink = ({to, title}) => (
  <Link to={to} className="pb-2 border-b-2 border-gray-400 opacity-75 hover:border-red-manyharrier hover:opacity-100 focus:border-red-manyharrier focus:opacity-100">
    <span className="text-black-manyharrier">{title}</span>
    <span className="text-red-manyharrier ml-4">&rarr;</span>
  </Link>
)

CallToActionLink.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export const CallToActionBackLink = ({to, title}) => (
  <Link to={to} className="pb-2 border-b-2 border-gray-400 opacity-75 hover:border-red-manyharrier hover:opacity-100 focus:border-red-manyharrier focus:opacity-100">
    <span className="text-red-manyharrier mr-4">&larr;</span>
    <span className="text-black-manyharrier">{title}</span>
  </Link>
)

CallToActionBackLink.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export const CallToActionText = ({title}) => (
  <>
    <span className="text-black-manyharrier">{title}</span>
    <span className="text-red-manyharrier ml-4">&rarr;</span>
  </>
)

CallToActionText.propTypes = {
  title: PropTypes.string.isRequired
}

export const CallToActionBackText = ({title}) => (
  <>
    <span className="text-red-manyharrier mr-4">&larr;</span>
    <span className="text-black-manyharrier">{title}</span>
  </>
)

CallToActionBackText.propTypes = {
  title: PropTypes.string.isRequired
}
