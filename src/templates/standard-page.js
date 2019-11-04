import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from '../components/Content'
import StandardContentContainer from "../components/StandardContentContainer";
import {H1} from "../components/Headings";
import {Helmet} from "react-helmet";

export const StandardPageTemplate = ({siteTitle, title, description, content, contentComponent}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <Helmet>
        <title>{title + ` | ` + siteTitle}</title>
        {description &&
        <meta name="description" content={description} />
        }
      </Helmet>
      <H1 title={title} />
      <PageContent className="content" content={content} />
    </StandardContentContainer>
  )
}

StandardPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const StandardPage = ({data}) => {
  const {siteMetadata: title, markdownRemark: post} = data

  return (
    <Layout>
      <StandardPageTemplate
        contentComponent={HTMLContent}
        siteTitle={title}
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        content={post.html}
      />
    </Layout>
  )
}

StandardPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default StandardPage

export const standardPageQuery = graphql`
  query StandardPage($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        description
      }
    }
  }
`
