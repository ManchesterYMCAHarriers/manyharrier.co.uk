import React from "react";
import * as PropTypes from "prop-types";
import {Link} from "gatsby";

const CTAClassNames = "pb-2 border-b-2 leading-loose border-gray-400 opacity-75 hover:border-red-manyharrier hover:opacity-100 focus:border-red-manyharrier focus:opacity-100"

export const CallToActionButton = ({type, onClick, title, id, className, highlighted}) => {
  highlighted = highlighted || `&rarr;`;
  return (
    <button type={type} id={id} onClick={onClick}
            className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
      <span className="text-black-manyharrier">{title}</span>
      <span className="text-red-manyharrier ml-4"
            dangerouslySetInnerHTML={{__html: highlighted}} />
    </button>
  )
}

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

export const CallToActionBackButton = ({type, onClick, title, id, className, highlighted}) => {
  highlighted = highlighted || `&larr;`
  return (
    <button type={type} onClick={onClick} id={id}
            className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
      <span className="text-red-manyharrier mr-4"
            dangerouslySetInnerHTML={{__html: highlighted}} />
      <span className="text-black-manyharrier">{title}</span>
    </button>
  )
}

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

export const CallToActionLink = ({to, title, className, highlighted}) => {
  highlighted = highlighted || `&rarr;`;

  if (to.charAt(0) === "/") {
    return (
      <Link to={to}
            className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
        <span className="text-black-manyharrier">{title}</span>
        <span className="text-red-manyharrier ml-4"
              dangerouslySetInnerHTML={{__html: highlighted}} />
      </Link>
    )
  }

  return (
    <a href={to}
       className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
      <span className="text-black-manyharrier">{title}</span>
      <span className="text-red-manyharrier ml-4"
            dangerouslySetInnerHTML={{__html: highlighted}} />
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

export const CallToActionBackLink = ({to, title, className, highlighted}) => {
  highlighted = highlighted || `&larr;`

  if (to.charAt(0) === "/") {
    return (
      <Link to={to}
            className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
        <span className="text-red-manyharrier mr-4"
              dangerouslySetInnerHTML={{__html: highlighted}} />
        <span className="text-black-manyharrier">{title}</span>
      </Link>
    )
  }

  return (
    <a href={to}
       className={CTAClassNames.split(" ").concat(className.split(" ")).join(" ")}>
      <span className="text-red-manyharrier mr-4"
            dangerouslySetInnerHTML={{__html: highlighted}} />
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

export const CallToActionText = ({title, className, highlighted}) => {
  highlighted = highlighted || `&rarr;`
  return (
    <div className={className}>
      <span className="text-black-manyharrier">{title}</span>
      <span className="text-red-manyharrier ml-4"
            dangerouslySetInnerHTML={{__html: highlighted}} />
    </div>
  )
}

CallToActionText.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired
}

CallToActionText.defaultProps = {
  className: "",
}

export const CallToActionBackText = ({title, className, highlighted}) => {
  highlighted = highlighted || `&larr;`

  return (
    <div className={className}>
      <span className="text-red-manyharrier mr-4"
            dangerouslySetInnerHTML={{__html: highlighted}} />
      <span className="text-black-manyharrier">{title}</span>
    </div>
  )
}

CallToActionBackText.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired
}

CallToActionBackText.defaultProps = {
  className: "",
}
