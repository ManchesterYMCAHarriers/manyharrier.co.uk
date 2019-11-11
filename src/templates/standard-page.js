import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from '../components/Content'
import StandardContentContainer from '../components/StandardContentContainer'
import {Helmet} from 'react-helmet'
import Hero from "../components/Hero";
import {PanelFullWidth, Panels} from "../components/Panels";

export const StandardPageTemplate = ({
                                       siteTitle,
                                       title,
  subtitle,
                                       description,
                                       heroImage,
                                       content,
                                       contentComponent,
                                     }) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <Helmet>
        <title>{title + ` | ` + siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      {heroImage && (
        <Hero title={title} subtitle={subtitle} fluidImage={heroImage} />
      )}
      <Panels>
        <PanelFullWidth>
          <div className="panel bottom-black">
            {!heroImage && <h1 className="heading-1">{title}</h1>}
            <div className="content"
                 dangerouslySetInnerHTML={{__html: content}} />
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
  contentComponent: PropTypes.func,
}

const StandardPage = ({data}) => {
  const {siteMetadata: title, markdownRemark: page} = data

  const heroImage = page.frontmatter.heroImage ? page.frontmatter.heroImage.childImageSharp.fluid : null

  return (
    <Layout path={page.fields.slug}>
      <StandardPageTemplate
        contentComponent={HTMLContent}
        siteTitle={title}
        title={page.frontmatter.title}
        subtitle={page.frontmatter.subtitle}
        heroImage={heroImage}
        description={page.frontmatter.description}
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
        heroImage {
          childImageSharp {
            fluid(maxWidth: 1344, maxHeight: 756) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    }
  }
`
