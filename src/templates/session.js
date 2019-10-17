import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import {HTMLContent} from "../components/Content";

export const SessionTemplate = ({
                                       events,
                                       title,
                                       information,
                                     }) => {
  return (
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <h2>Information</h2>
            <HTMLContent content={information} />
          </div>
        </div>
      </div>
    </section>
  )
}

SessionTemplate.propTypes = {
  events: PropTypes.object,
  information: PropTypes.node,
  title: PropTypes.string,
}

const Session = ({data}) => {
  const {markdownRemark: session} = data

  return (
    <Layout>
      <SessionTemplate
        events={session.frontmatter.sessionEvents}
        information={session.html}
        title={session.frontmatter.sessionKey}
      />
    </Layout>
  )
}

Session.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  }),
}

export default Session

export const sessionQuery = graphql`
  query SessionByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        sessionKey
        sessionEvents {
          id
          fields {
            slug
          }
          frontmatter {
            eventKey
            startsAt
            venue {
              id
              frontmatter {
                address
                title
              }
            }
          }
        }
      }
    }
  }
`
