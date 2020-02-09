import React from 'react'
import * as PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import { graphql } from 'gatsby'
import { Panel, Panels } from '../../components/Panels'
import { CardCTA } from '../../components/Card'
import { CallToActionText } from '../../components/CallToAction'

const RoutesIndex = ({ data, location }) => {
  const routes = data.allMarkdownRemark.edges
    .map(({ node }) => {
      return {
        title: node.frontmatter.routeKey,
        image: node.frontmatter.heroImage
          ? node.frontmatter.heroImage.childImageSharp.fluid
          : null,
        eventsCount: node.frontmatter.routeEvents
          ? node.frontmatter.routeEvents.length
          : 0,
        slug: node.fields.slug,
      }
    })
    .sort((a, b) => {
      if (a.eventsCount === b.eventsCount) {
        return a.title < b.title ? -1 : 1
      }
      return a.eventsCount > b.eventsCount ? -1 : 1
    })

  return (
    <Layout title={'Routes'} description={'Routes for group runs and races'} path={'/routes'} location={location}>
      <StandardContentContainer>
        <h1 className="heading-1">Routes</h1>
        <Panels>
          {routes.map(({ title, image, slug }) => (
            <Panel key={slug}>
              <CardCTA
                to={slug}
                title={title}
                image={image}
                borderColorClassName={`border-gray-400`}
                borderColorHoverClassName={`border-red-manyharrier`}
                callToAction={<CallToActionText title={'More details'} />}
              />
            </Panel>
          ))}
        </Panels>
      </StandardContentContainer>
    </Layout>
  )
}

RoutesIndex.propTypes = {
  data: PropTypes.object,
}

export default RoutesIndex

export const routesQuery = graphql`
  query RoutesQuery {
    allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "route" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            heroImage {
              childImageSharp {
                ...CardImage
              }
            }
            routeKey
            routeEvents {
              id
            }
          }
        }
      }
    }
  }
`
