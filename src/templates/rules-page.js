import React from 'react'
import * as PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import { PanelFullWidth, Panels } from '../components/Panels'
import { CallToActionLink } from '../components/CallToAction'
import Hero from '../components/Hero'

export const RulesPageTemplate = ({
  title,
  heroImage,
  content,
  rulesDocument,
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
          <div className="panel red-bottom">
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </PanelFullWidth>
        <PanelFullWidth>
          <div className="panel black-bottom">
            <h2 className="heading-2 mb-4">Resources</h2>
            <CallToActionLink
              to={rulesDocument}
              title={'Current rules document'}
            />
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

const RulesPage = ({ data, location }) => {
  const { markdownRemark: page } = data

  return (
    <Layout title={page.frontmatter.title} description={page.frontmatter.description} path={page.fields.slug} location={location}>
      <RulesPageTemplate
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
