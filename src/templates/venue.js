import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";
import GoogleMapsLocation from "../components/GoogleMapsLocation"
import PageTitle from "../components/PageTitle";
import VenueAddress from "../components/VenueAddress";
import Subtitle from "../components/Subtitle";
import GoogleMapsDirectionsLink from "../components/GoogleMapsDirectionsLink";
import UpcomingEvents from "../components/UpcomingEvents";

export const VenueTemplate = ({
                                contentComponent,
                                title,
                                address,
                                location,
                                information,
                                events,
                              }) => {
  const InformationContent = contentComponent || Content

  return (
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <PageTitle title={title} />
            <VenueAddress address={address} />
            <GoogleMapsLocation zoom={13} location={location} />
            <Subtitle text={"Directions"} />
            <ul>
              <li><GoogleMapsDirectionsLink location={location}
                                            text={"Navigate to " + title + " with Google Maps"} />
              </li>
            </ul>
            <Subtitle text={"Information"} />
            <InformationContent content={information}
                                className={"information"} />
            <Subtitle text={"Upcoming events"} />
            <UpcomingEvents events={events} venueName={title} />
          </div>
        </div>
      </div>
    </section>
  )
}

VenueTemplate.propTypes = {
  address: PropTypes.string,
  contentComponent: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.object),
  information: PropTypes.node,
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number)
  }),
  title: PropTypes.string,
}

const Venue = ({data}) => {
  const {markdownRemark: venue} = data

  return (
    <Layout>
      <VenueTemplate
        contentComponent={HTMLContent}
        events={venue.frontmatter.venueEvents}
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
        venueEvents {
          id
          fields {
            slug
          }
          frontmatter {
            title
            startsAt
          }
        }
      }
    }
  }
`
