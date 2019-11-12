import React from 'react'
import * as PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import { Helmet } from 'react-helmet'
import Hero from "../components/Hero";
import {PanelFullWidth, Panels} from "../components/Panels";

export const KitPageTemplate = ({
  siteTitle,
  title,
  heroImage,
  description,
  content,
}) => {
  return (
    <StandardContentContainer>
      <Helmet>
        <title>{title + ` | ` + siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      {heroImage ? <Hero fluidImage={heroImage} title={title} /> : <h1 className="heading-1">{title}</h1>}
      <Panels>
        <PanelFullWidth>
          <div className="content panel black-bottom" dangerouslySetInnerHTML={{__html: content}} />
        </PanelFullWidth>
      </Panels>
    </StandardContentContainer>
  )
}

KitPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  heroImage: PropTypes.object,
  description: PropTypes.string,
  content: PropTypes.string,
}

const KitPage = ({ data }) => {
  const { siteMetadata: title, markdownRemark: post } = data

  const heroImage = post.frontmatter.heroImage ? post.frontmatter.heroImage.childImageSharp.fluid : null

  return (
    <Layout>
      <KitPageTemplate
        siteTitle={title}
        title={post.frontmatter.title}
        heroImage={heroImage}
        description={post.frontmatter.description}
        content={post.html}
      />
    </Layout>
  )
}

KitPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default KitPage

export const kitPageQuery = graphql`
  query KitPage($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        heroImage {
          childImageSharp {
            ...HeroImage
          }
        }
        description
      }
    }
  }
`
