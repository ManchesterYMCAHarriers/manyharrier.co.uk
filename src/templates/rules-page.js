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
      <div className={"content"}>
        <ul>
          <li>
            <Link to={rulesDocument}>Current rules document</Link>
          </li>
        </ul>
      </div>
    </StandardContentContainer>
  )
}

RulesPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  content: PropTypes.string.isRequired,
  contentComponent: PropTypes.func,
  rulesDocument: PropTypes.shape({
    publicURL: PropTypes.string.isRequired,
  }).isRequired,
}

const RulesPage = ({data}) => {
  const {siteMetadata: title, markdownRemark: page} = data

  return (
    <Layout path={page.fields.slug}>
      <RulesPageTemplate
        contentComponent={HTMLContent}
        siteTitle={title}
        title={page.frontmatter.title}
        description={page.frontmatter.description}
        content={page.html}
        rulesDocument={page.frontmatter.rulesDocument.publicURL}
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
      fields {
        slug
      }
      frontmatter {
        title
        description
        rulesDocument {
          publicURL
        }
      }
    }
  }
`
