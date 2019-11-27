import React from 'react'
import * as PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import Hero from '../components/Hero'
import { PanelFullWidth, Panels } from '../components/Panels'
import {Helmet} from "react-helmet";

export const BlogPostTemplate = ({
  content,
  title,
  siteTitle,
  description,
  heroImage,
  publishedAt,
}) => {
  return (
    <StandardContentContainer>
      <Helmet>
        <title>{`${title} | Blog | ${siteTitle}`}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      {heroImage ? (
        <Hero fluidImage={heroImage} title={title} />
      ) : (
        <h1 className="heading-1">{title}</h1>
      )}
      <Panels>
        <PanelFullWidth>
          <div
            className="content panel black-bottom"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </PanelFullWidth>
      </Panels>
    </StandardContentContainer>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  publishedAt: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
  heroImage: PropTypes.object,
}

const BlogPost = ({ data }) => {
  const { site: { siteMetadata: { title: siteTitle }}, markdownRemark: post } = data

  const heroImage = post.frontmatter.heroImage
    ? post.frontmatter.heroImage.childImageSharp.fluid
    : null

  return (
    <Layout path={post.fields.slug}>
      <BlogPostTemplate
        content={post.html}
        date={post.frontmatter.publishedAt}
        description={post.frontmatter.description}
        title={post.frontmatter.blogKey}
        siteTitle={siteTitle}
        heroImage={heroImage}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.object,
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        blogKey
        publishedAt(formatString: "Do MMMM YYYY")
        description
        heroImage {
          childImageSharp {
            ...HeroImage
          }
        }
      }
    }
  }
`
