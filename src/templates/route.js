import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";
import GoogleMapsRoute from "../components/GoogleMapsRoute";

export const RouteTemplate = ({
                                contentComponent,
                                events,
                                title,
                                routeTrack,
                                information,
                              }) => {
  const InformationContent = contentComponent || Content

  return (
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <GoogleMapsRoute routeTrack={routeTrack} />
            <h2>Information</h2>
            <InformationContent content={information} />
          </div>
        </div>
      </div>
    </section>
  )
}

RouteTemplate.propTypes = {
  contentComponent: PropTypes.func,
  events: PropTypes.object,
  information: PropTypes.node,
  routeTrack: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
  }),
  title: PropTypes.string,
}

const Route = ({data}) => {
  const {markdownRemark: route} = data

  return (
    <Layout>
      <RouteTemplate
        contentComponent={HTMLContent}
        events={route.frontmatter.routeEvents}
        information={route.html}
        routeTrack={route.fields.routeTrack}
        title={route.frontmatter.title}
      />
    </Layout>
  )
}

Route.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  }),
}

export default Route

export const routeQuery = graphql`
  query RouteByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        routeTrack {
          coordinates
        }
        slug
      }
      frontmatter {
        routeEvents {
          id
          fields {
            slug
          }
          frontmatter {
            startsAt
            title
            venue {
              id
              frontmatter {
                address
                title
              }
            }
          }
        }
        title
      }
    }
  }
`
