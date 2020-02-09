import React from 'react'
import * as PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import Hero from '../components/Hero'
import { PanelFullWidth, Panels } from '../components/Panels'

export const StandardPageTemplate = ({
  title,
  subtitle,
  heroImage,
  content,
}) => {
  return (
    <StandardContentContainer>
      {heroImage ? (
        <Hero title={title} subtitle={subtitle} fluidImage={heroImage} />
      ) : (
        <h1 className="heading-1">{title}</h1>
      )}
      <Panels>
        <PanelFullWidth>
          <div className="panel bottom-black">
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </PanelFullWidth>
      </Panels>
    </StandardContentContainer>
  )
}

StandardPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  heroImage: PropTypes.object,
  description: PropTypes.string,
  content: PropTypes.string,
}

const StandardPage = ({ data, location }) => {
  const { markdownRemark: page } = data

  const heroImage = page.frontmatter.heroImage
    ? page.frontmatter.heroImage.childImageSharp.fluid
    : null

  return (
    <Layout title={page.frontmatter.title} description={page.frontmatter.description} path={page.fields.slug} location={location}>
      <StandardPageTemplate
        title={page.frontmatter.title}
        subtitle={page.frontmatter.subtitle}
        heroImage={heroImage}
        content={page.html}
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
    markdownRemark(id: { eq: $id }) {
      html
      fields {
        slug
      }
      frontmatter {
        title
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
