import React from 'react'
import * as PropTypes from 'prop-types'
import Img from 'gatsby-image'
import { Link } from 'gatsby'

const CardContent = ({ image, imageAlt, title, children, callToAction }) => (
  <>
    {image && (
      <div className="w-full flex-shrink-0 flex-grow-0">
        <Img fluid={image} alt={imageAlt} />
      </div>
    )}
    <div className="w-full flex-shrink-0 flex-grow p-4 flex flex-col">
      {title && (
        <div className="w-full flex-shrink-0 flex-grow-0 my-2">
          <h3 className="heading-3">{title}</h3>
        </div>
      )}
      <div className="w-full flex-shrink flex-grow">{children}</div>
      {callToAction && (
        <div className="w-full flex-shrink-0 flex-grow-0 text-right pb-2">
          {callToAction}
        </div>
      )}
    </div>
  </>
)

export const CardCTA = ({
  to,
  image,
  imageAlt,
  title,
  children,
  callToAction,
  borderColorClassName,
  borderColorHoverClassName,
}) => {
  borderColorClassName = borderColorClassName || `border-transparent`
  borderColorHoverClassName =
    borderColorHoverClassName || `border-red-manyharrier`

  const className = `w-full bg-white-manyharrier flex flex-col justify-between border-b-4 opacity-75 ${borderColorClassName} hover:${borderColorHoverClassName} hover:opacity-100 hover:bg-gray-200 focus:${borderColorHoverClassName} focus:opacity-100 focus:bg-gray-200`

  if (to.charAt(0) === '/') {
    return (
      <Link to={to} className={className}>
        <CardContent
          image={image}
          imageAlt={imageAlt}
          title={title}
          callToAction={callToAction}
        >
          {children}
        </CardContent>
      </Link>
    )
  }

  return (
    <a href={to} className={className}>
      <CardContent
        image={image}
        imageAlt={imageAlt}
        title={title}
        callToAction={callToAction}
      >
        {children}
      </CardContent>
    </a>
  )
}

CardCTA.propTypes = {
  to: PropTypes.string.isRequired,
  image: PropTypes.object,
  imageAlt: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  callToAction: PropTypes.node,
  borderColorClassName: PropTypes.string,
  borderColorHoverClassName: PropTypes.string,
}

export const Card = ({
  image,
  imageAlt,
  title,
  children,
  callToAction,
  borderColorClassName,
}) => {
  borderColorClassName = borderColorClassName || `border-transparent`

  return (
    <div
      className={`w-full bg-white-manyharrier flex flex-col justify-between border-b-4 ${borderColorClassName}`}
    >
      <CardContent
        image={image}
        imageAlt={imageAlt}
        title={title}
        callToAction={callToAction}
      >
        {children}
      </CardContent>
    </div>
  )
}

Card.propTypes = {
  image: PropTypes.object,
  imageAlt: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  callToAction: PropTypes.node,
  borderColorClassName: PropTypes.string,
}
