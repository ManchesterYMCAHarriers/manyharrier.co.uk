import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";
import GoogleMapsStatic from "../components/GoogleMapsStatic"

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
            <p style={{ marginTop: "-1rem", whiteSpace: "pre"}}>{address}</p>
            <GoogleMapsStatic altText={"Location of " + title} maxWidth={640} maxHeight={360} zoom={10} location={location} />
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
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number)
  }),
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
        location={venue.fields.location}
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
      fields {
        location {
          coordinates
        }
      }
      frontmatter {
        title
        address
      }
    }
  }
`
