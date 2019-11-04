import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from '../components/Content'
import StandardContentContainer from "../components/StandardContentContainer";
import {H1} from "../components/Headings";
import {Helmet} from "react-helmet";

export const KitPageTemplate = ({siteTitle, title, description, content, contentComponent}) => {
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

KitPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const KitPage = ({data}) => {
  const {siteMetadata: title, markdownRemark: post} = data

  return (
    <Layout>
      <KitPageTemplate
        contentComponent={HTMLContent}
        siteTitle={title}
        title={post.frontmatter.title}
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
        description
      }
    }
  }
`
