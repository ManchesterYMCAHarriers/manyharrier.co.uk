import React from 'react'
import * as PropTypes from "prop-types";
import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import {graphql} from "gatsby";
import {Panel, Panels} from "../../components/Panels";
import {CardCTA} from "../../components/Card";
import {CallToActionText} from "../../components/CallToAction";

const SessionsIndex = ({data}) => {
  const sessions = data.allMarkdownRemark.edges.map(({node}) => {
    return {
      title: node.frontmatter.sessionKey,
      image: node.frontmatter.heroImage ? node.frontmatter.heroImage.childImageSharp.fluid : null,
      eventsCount: node.frontmatter.routeEvents ? node.frontmatter.routeEvents.length : 0,
      slug: node.fields.slug,
    }
  }).sort((a, b) => {
    if (a.eventsCount === b.eventsCount) {
      return a.title < b.title ? -1 : 1
    }
    return a.eventsCount > b.eventsCount ? -1 : 1
  })

  return (
    <Layout path={'/sessions'}>
      <StandardContentContainer>
        <h1 className="heading-1">Sessions</h1>
        <Panels>
          {sessions.map(({title, image, slug}) => (
            <Panel key={slug}>
              <CardCTA to={slug} title={title} image={image}
                       borderColorClassName={`border-gray-400`}
                       borderColorHoverClassName={`border-red-manyharrier`}
                       callToAction={<CallToActionText
                         title={"More details"} />} />
            </Panel>
          ))}
        </Panels>
      </StandardContentContainer>
    </Layout>
  )
}

SessionsIndex.propTypes = {
  data: PropTypes.object,
}

export default SessionsIndex

export const sessionsQuery = graphql`
  query SessionsQuery {
    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "session"}}}) {
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
            sessionKey
            sessionEvents {
              id
            }
          }
        }
      }
    }
  }
`
