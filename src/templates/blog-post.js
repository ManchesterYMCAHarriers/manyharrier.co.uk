import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import StandardContentContainer from '../components/StandardContentContainer'
import { H1 } from '../components/Headings'

export const BlogPostTemplate = ({
  contentComponent,
  content,
  title,
  helmet,
}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <H1 title={title} />
      <PageContent content={content} />
    </StandardContentContainer>
  )
}

BlogPostTemplate.propTypes = {
  contentComponent: PropTypes.func,
  content: PropTypes.node.isRequired,
  description: PropTypes.string,
  title: PropTypes.string.isRequired,
  helmet: PropTypes.object,
}

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout path={post.fields.slug}>
      <BlogPostTemplate
        contentComponent={HTMLContent}
        content={post.html}
        description={post.frontmatter.description}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${post.frontmatter.blogKey}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        title={post.frontmatter.blogKey}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
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
        date(formatString: "Do MMMM YYYY")
        description
      }
    }
  }
`
