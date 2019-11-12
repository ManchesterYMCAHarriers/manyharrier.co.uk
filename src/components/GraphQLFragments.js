import { graphql } from "gatsby";

export const HeroImageQuery = graphql`
  fragment HeroImage on ImageSharp {
    fluid(maxWidth: 1152, maxHeight: 648) {
      ...GatsbyImageSharpFluid_withWebp_tracedSVG
    }
  }
`

export const CardImageQuery = graphql`
  fragment CardImage on ImageSharp {
    fluid(maxWidth: 576, maxHeight: 324) {
      ...GatsbyImageSharpFluid_withWebp_tracedSVG
    }
  }
`
