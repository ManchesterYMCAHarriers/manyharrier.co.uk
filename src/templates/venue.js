import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import GoogleMapsLocation from '../components/GoogleMapsLocation'
import GoogleMapsDirectionsLink from '../components/GoogleMapsDirectionsLink'
import Moment from 'moment'
import Address from '../components/Address'
import EventBox from '../components/EventBox'
import StandardContentContainer from '../components/StandardContentContainer'
import {PanelFullWidth, Panels} from "../components/Panels";
import {CallToActionLink} from "../components/CallToAction";
import Hero from "../components/Hero";

export const VenueTemplate = ({
  contentComponent,
  googleMapsApiKey,
  heroImage,
  title,
  address,
  location,
  information,
  events,
}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      {heroImage && <Hero fluidImage={heroImage} />}
      <Panels>
        <PanelFullWidth>
          <div className="panel red-bottom">
            <h1 className="heading-1">{title}</h1>
            <Address address={address} />
          </div>
        </PanelFullWidth>
        <PanelFullWidth>
          <div className="w-full relative" style={{ height: '70vh' }}>
            <GoogleMapsLocation
              googleMapsApiKey={googleMapsApiKey}
              id={'venue-location-map'}
              zoom={14}
              location={location}
              mapContainerClassName={'h-full'}
            />
          </div>
        </PanelFullWidth>
        <PanelFullWidth>
          <div className="panel black-bottom">
            <CallToActionLink to={GoogleMapsDirectionsLink({location})} title={`Navigate to ${title} with Google Maps`} />
          </div>
        </PanelFullWidth>
        {information && (
          <PanelFullWidth>
            <div className="content panel black-bottom" dangerouslySetInnerHTML={{__html: information}} />
          </PanelFullWidth>
        )}
        <PanelFullWidth>
          <div className="panel black-bottom">
            <h2 className="heading-2 mb-4">Upcoming events at {title}</h2>
            {events.length === 0 && (
              <p className="paragraph">There are no upcoming events at {title}.</p>
            )}
            {events.map(({ startsAt, slug, title }, i) => (
              <EventBox
                key={'venue-event-' + i}
                startsAt={startsAt}
                slug={slug}
                title={title}
              />
            ))}
          </div>
        </PanelFullWidth>
      </Panels>
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
  title: PropTypes.string.isRequired,
  heroImage: PropTypes.object,
}

const Venue = ({ data, pageContext }) => {
  const {
    site: {
      siteMetadata: {
        apiKey: { googleMaps: googleMapsApiKey },
      },
    },
    markdownRemark: venue,
  } = data
  const { now } = pageContext

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

  const heroImage = venue.frontmatter.heroImage ? venue.frontmatter.heroImage.childImageSharp.fluid : null

  return (
    <Layout path={venue.fields.slug}>
      <VenueTemplate
        contentComponent={HTMLContent}
        events={events}
        googleMapsApiKey={googleMapsApiKey}
        information={venue.html}
        address={venue.frontmatter.address.split('\n')}
        location={location}
        title={venue.frontmatter.venueKey}
        heroImage={heroImage}
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
      fields {
        slug
      }
      frontmatter {
        address
        heroImage {
          childImageSharp {
            fluid(maxWidth: 1344, maxHeight: 756) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
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
