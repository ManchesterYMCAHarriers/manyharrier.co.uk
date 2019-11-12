import React from 'react'
import * as PropTypes from "prop-types";
import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import {graphql} from "gatsby";
import {Panel, Panels} from "../../components/Panels";
import {CardCTA} from "../../components/Card";
import {CallToActionText} from "../../components/CallToAction";
import Address from "../../components/Address";

const VenuesIndex = ({data}) => {
  const venues = data.allMarkdownRemark.edges.map(({node}) => {
    return {
      title: node.frontmatter.venueKey,
      address: node.frontmatter.address.split("\n"),
      image: node.frontmatter.heroImage ? node.frontmatter.heroImage.childImageSharp.fluid : null,
      eventsCount: node.frontmatter.venueEvents ? node.frontmatter.venueEvents.length : 0,
      slug: node.fields.slug,
    }
  }).sort((a, b) => {
    if (a.eventsCount === b.eventsCount) {
      return a.title < b.title ? -1 : 1
    }
    return a.eventsCount > b.eventsCount ? -1 : 1
  })

  return (
    <Layout path={'/venues'}>
      <StandardContentContainer>
        <h1 className="heading-1">Venues</h1>
        <Panels>
          {venues.map(({title, address, image, slug}) => (
            <Panel key={slug}>
              <CardCTA to={slug} title={title} image={image}
                       borderColorClassName={`border-gray-400`}
                       borderColorHoverClassName={`border-red-manyharrier`}
                       callToAction={<CallToActionText
                         title={"More details"} />}>
                <Address address={address} />
              </CardCTA>
            </Panel>
          ))}
        </Panels>
      </StandardContentContainer>
    </Layout>
  )
}

VenuesIndex.propTypes = {
  data: PropTypes.object,
}

export default VenuesIndex

export const venuesQuery = graphql`
  query VenuesQuery {
    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "venue"}}}) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            address
            heroImage {
              childImageSharp {
                ...CardImage
              }
            }
            venueKey
            venueEvents {
              id
            }
          }
        }
      }
    }
  }
`
