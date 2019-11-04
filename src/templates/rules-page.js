import React from 'react'
import PropTypes from 'prop-types'
import {graphql, Link} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from '../components/Content'
import StandardContentContainer from "../components/StandardContentContainer";
import {H1, H2} from "../components/Headings";
import {Helmet} from "react-helmet";

export const RulesPageTemplate = ({siteTitle, title, description, content, rulesDocument, contentComponent}) => {
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
      <H2 title={"Resources"} />
      <ul>
        <li>
          <Link to={rulesDocument}>{rulesDocument}</Link>
        </li>
      </ul>
    </StandardContentContainer>
  )
}

RulesPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  rulesDocument: PropTypes.string,
}

const RulesPage = ({data}) => {
  const {siteMetadata: title, markdownRemark: post} = data

  return (
    <Layout>
      <RulesPageTemplate
        contentComponent={HTMLContent}
        siteTitle={title}
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        content={post.html}
        rulesDocument={post.frontmatter.rulesDocument}
      />
    </Layout>
  )
}

RulesPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default RulesPage

export const rulesPageQuery = graphql`
  query RulesPage($id: String!) {
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
        rulesDocument
      }
    }
  }
`
