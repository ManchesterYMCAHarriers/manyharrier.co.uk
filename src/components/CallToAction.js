import React from "react";
import * as PropTypes from "prop-types";
import {Link} from "gatsby";

const CTAClassNames = "pb-2 border-b-2 border-gray-400 opacity-75 hover:border-red-manyharrier hover:opacity-100 focus:border-red-manyharrier focus:opacity-100"

export const CallToActionButton = ({type, onClick, title, id, className}) => (
  <button type={type} id={id} onClick={onClick} className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
    <span className="text-black-manyharrier">{title}</span>
    <span className="text-red-manyharrier ml-4">&rarr;</span>
  </button>
)

CallToActionButton.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
}

CallToActionButton.defaultProps = {
  className: "",
  type: "button"
}

export const CallToActionBackButton = ({type, onClick, title, id, className}) => (
  <button type={type} onClick={onClick} id={id} className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
    <span className="text-red-manyharrier mr-4">&larr;</span>
    <span className="text-black-manyharrier">{title}</span>
  </button>
)

CallToActionBackButton.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
}

CallToActionBackButton.defaultProps = {
  className: "",
  type: "button",
}

export const CallToActionLink = ({to, title, className}) => {
  if (to.charAt(0) === "/") {
    return (
      <Link to={to}
          className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
        <span className="text-black-manyharrier">{title}</span>
        <span className="text-red-manyharrier ml-4">&rarr;</span>
      </Link>
    )
  }

  return (
    <a href={to}
        className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
      <span className="text-black-manyharrier">{title}</span>
      <span className="text-red-manyharrier ml-4">&rarr;</span>
    </a>
  )
}

CallToActionLink.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

CallToActionLink.defaultProps = {
  className: "",
}

export const CallToActionBackLink = ({to, title, className}) => {
  if (to.charAt(0) === "/") {
    return (
      <Link to={to}
            className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
        <span className="text-red-manyharrier mr-4">&larr;</span>
        <span className="text-black-manyharrier">{title}</span>
      </Link>
    )
  }

  return (
    <a href={to}
          className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
      <span className="text-red-manyharrier mr-4">&larr;</span>
      <span className="text-black-manyharrier">{title}</span>
    </a>
  )
}

CallToActionBackLink.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

CallToActionBackLink.defaultProps = {
  className: "",
}

export const CallToActionText = ({title, className}) => (
  <div className={className}>
    <span className="text-black-manyharrier">{title}</span>
    <span className="text-red-manyharrier ml-4">&rarr;</span>
  </div>
)

CallToActionText.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired
}

CallToActionText.defaultProps = {
  className: "",
}

export const CallToActionBackText = ({title, className}) => (
  <div className={className}>
    <span className="text-red-manyharrier mr-4">&larr;</span>
    <span className="text-black-manyharrier">{title}</span>
  </div>
)

CallToActionBackText.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired
}

CallToActionBackText.defaultProps = {
  className: "",
}
