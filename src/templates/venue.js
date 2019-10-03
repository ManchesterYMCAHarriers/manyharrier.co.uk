import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";

export const VenueTemplate = ({
                                contentComponent,
                                title,
                                address,
                                location,
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
            <h2>Address</h2>
            <p>{address}</p>
            <h2>Location</h2>
            <p>{location}</p>
            <h2>Information</h2>
            <InformationContent content={information} />
          </div>
        </div>
      </div>
    </section>
  )
}

VenueTemplate.propTypes = {
  address: PropTypes.string,
  contentComponent: PropTypes.func,
  information: PropTypes.node,
  location: PropTypes.object,
  title: PropTypes.string,
}

const Venue = ({data}) => {
  const { markdownRemark: venue } = data

  return (
    <Layout>
      <VenueTemplate
        contentComponent={HTMLContent}
        information={venue.html}
        address={venue.frontmatter.address}
        location={venue.frontmatter.location}
        title={venue.frontmatter.title}
      />
    </Layout>
  )
}

Venue.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  }),
}

export default Venue

export const venueQuery = graphql`
  query VenueByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        address
        location
      }
    }
  }
`
