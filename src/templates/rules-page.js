import React from 'react'
import * as PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import { Helmet } from 'react-helmet'
import {PanelFullWidth, Panels} from "../components/Panels";
import {CallToActionLink} from "../components/CallToAction";
import Hero from "../components/Hero";

export const RulesPageTemplate = ({
  siteTitle,
  title,
  heroImage,
  description,
  content,
  rulesDocument,
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
          <div className="panel red-bottom">
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
  rulesDocument: PropTypes.shape({
    publicURL: PropTypes.string.isRequired,
  }).isRequired,
}

const RulesPage = ({ data }) => {
  const { siteMetadata: title, markdownRemark: page } = data

  return (
    <Layout path={page.fields.slug}>
      <RulesPageTemplate
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
        heroImage {
          childImageSharp {
            ...HeroImage
          }
        }
        description
        rulesDocument {
          publicURL
        }
      }
    }
  }
`
