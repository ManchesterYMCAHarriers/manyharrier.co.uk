import React from "react"
import * as PropTypes from "prop-types"
import Img from "gatsby-image"

const Hero = ({fluidImage, title, subtitle}) => (
  <div className="-ml-4 -mr-4 -mt-4">
    <div className="w-full relative">
      <Img fluid={fluidImage} />
      {title && (
        <div className="absolute bottom-0 left-0 w-full bg-white opacity-75 p-4">
          <h1 className="heading-1">{title}</h1>
          {subtitle && <p className="heading-3">{subtitle}</p>}
        </div>
      )}
    </div>
  </div>
)

Hero.propTypes = {
  fluidImage: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string
}

export default Hero
