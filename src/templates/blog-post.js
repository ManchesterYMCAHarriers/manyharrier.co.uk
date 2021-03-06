import React from 'react'
import * as PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import Hero from '../components/Hero'
import { PanelFullWidth, Panels } from '../components/Panels'

export const BlogPostTemplate = ({
  content,
  title,
  heroImage,
  publishedAt,
}) => {
  return (
    <StandardContentContainer>
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
  title: PropTypes.string.isRequired,
  heroImage: PropTypes.object,
}

const BlogPost = ({ data, location }) => {
  const { markdownRemark: post } = data

  const heroImage = post.frontmatter.heroImage
    ? post.frontmatter.heroImage.childImageSharp.fluid
    : null

  return (
    <Layout title={post.frontmatter.blogKey} description={post.frontmatter.description} path={post.fields.slug} location={location}>
      <BlogPostTemplate
        content={post.html}
        date={post.frontmatter.publishedAt}
        title={post.frontmatter.blogKey}
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
