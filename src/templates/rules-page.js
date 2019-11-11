import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import StandardContentContainer from '../components/StandardContentContainer'
import { H1, H2 } from '../components/Headings'
import { Helmet } from 'react-helmet'
import {PanelFullWidth, Panels} from "../components/Panels";
import {CallToActionLink} from "../components/CallToAction";

export const RulesPageTemplate = ({
  siteTitle,
  title,
  description,
  content,
  rulesDocument,
  contentComponent,
}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <Helmet>
        <title>{title + ` | ` + siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <Panels>
        <PanelFullWidth>
          <div className="panel red-bottom">
            <h1 className="heading-1 mb-4">{title}</h1>
            <div className="content" dangerouslySetInnerHTML={{__html: content}} />
          </div>
        </PanelFullWidth>
        <PanelFullWidth>
          <div className="panel black-bottom">
            <h2 className="heading-2 mb-4">Resources</h2>
            <CallToActionLink to={rulesDocument} title={"Current rules document"}/>
          </div>
        </PanelFullWidth>
      </Panels>
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

const RulesPage = ({ data }) => {
  const { siteMetadata: title, markdownRemark: page } = data

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
