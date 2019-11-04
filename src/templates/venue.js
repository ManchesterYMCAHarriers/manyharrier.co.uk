import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from '../components/Content'
import GoogleMapsLocation from '../components/GoogleMapsLocation'
import GoogleMapsDirectionsLink from '../components/GoogleMapsDirectionsLink'
import Moment from 'moment'
import Address from '../components/Address'
import EventBox from '../components/EventBox'
import {H1, H2} from "../components/Headings";
import StandardContentContainer from "../components/StandardContentContainer";

export const VenueTemplate = ({
                                contentComponent,
                                googleMapsApiKey,
                                title,
                                address,
                                location,
                                information,
                                events,
                              }) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <H1 title={title} />
      <div className="subtitle is-size-4">
        <Address address={address} />
      </div>
      <div className="w-full mt-6 relative" style={{height: "70vh"}}>
        <GoogleMapsLocation
          googleMapsApiKey={googleMapsApiKey}
          id={'venue-location-map'}
          zoom={14}
          location={location}
          mapContainerClassName={'h-full'}
        />
      </div>
      <div className="mt-2 mb-4">
        <GoogleMapsDirectionsLink
          location={location}
          text={'Navigate to ' + title + ' with Google Maps'}
        />
      </div>
      {information && <PageContent content={information} />}
      <H2 title={'Upcoming events at ' + title} />
      {events.length === 0 && (
        <div>There are no upcoming events at {title}</div>
      )}
      {events.map(({startsAt, slug, title}, i) => (
        <EventBox
          key={'venue-event-' + i}
          startsAt={startsAt}
          slug={slug}
          title={title}
        />
      ))}
    </StandardContentContainer>
  )
}

VenueTemplate.propTypes = {
  contentComponent: PropTypes.func,
  address: PropTypes.arrayOf(PropTypes.string),
  events: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      startsAt: PropTypes.instanceOf(Moment).isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  googleMapsApiKey: PropTypes.string.isRequired,
  information: PropTypes.node,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  title: PropTypes.string,
}

const Venue = ({data, pageContext}) => {
  const {site: {siteMetadata: {apiKey: {googleMaps: googleMapsApiKey}}}, markdownRemark: venue} = data
  const {now} = pageContext

  const coords = JSON.parse(venue.frontmatter.location).coordinates

  const location = {
    lat: coords[1],
    lng: coords[0],
  }

  const events = (venue.frontmatter.venueEvents || [])
    .map(event => {
      return {
        slug: event.fields.slug,
        startsAt: Moment.utc(event.frontmatter.startsAt),
        title: event.frontmatter.eventKey,
      }
    })
    .filter(event => {
      return event.startsAt.isAfter(now)
    })
    .sort((a, b) => {
      if (a.startsAt.isSame(b.startsAt)) {
        return a.title < b.title ? -1 : 1
      }
      return a.startsAt.isBefore(b.startsAt) ? -1 : 1
    })

  return (
    <Layout>
      <VenueTemplate
        contentComponent={HTMLContent}
        events={events}
        googleMapsApiKey={googleMapsApiKey}
        information={venue.html}
        address={venue.frontmatter.address.split('\n')}
        location={location}
        title={venue.frontmatter.venueKey}
      />
    </Layout>
  )
}

Venue.propTypes = {
  data: PropTypes.object,
}

export default Venue

export const venueQuery = graphql`
  query VenueByID($id: String!) {
    site {
      siteMetadata {
        apiKey {
          googleMaps
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        address
        location
        venueEvents {
          id
          fields {
            slug
          }
          frontmatter {
            championshipForeignKey
            competitionForeignKey
            eventKey
            eventType
            startsAt
            terrain
          }
        }
        venueKey
      }
    }
  }
`
