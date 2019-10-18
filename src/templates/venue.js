import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";
import GoogleMapsLocation from "../components/GoogleMapsLocation"
import PageTitle from "../components/PageTitle";
import Subtitle from "../components/Subtitle";
import GoogleMapsDirectionsLink from "../components/GoogleMapsDirectionsLink";
import Moment from "moment"
import Address from "../components/Address";
import EventBox from "../components/EventBox";

export const VenueTemplate = ({
  contentComponent,
                                title,
                                address,
                                location,
                                information,
                                events,
                              }) => {
  const PageContent = contentComponent || Content

  return (
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <PageTitle title={title} />
            <div className="subtitle is-size-4">
              <Address address={address} />
            </div>
            <div className="maps-container">
              <GoogleMapsLocation id={"venue-location-map"} zoom={14}
                                  location={location}
                                  mapContainerClassName={"maps-style"}
              />
            </div>
            <GoogleMapsDirectionsLink location={location}
                                      text={"Navigate to " + title + " with Google Maps"} />
            <Subtitle text={"Information"} />
            <PageContent content={information}
                         className={"information"} />
            <Subtitle text={"Upcoming events"} />
            {events.length === 0 &&
            <div>There are no upcoming events at {title}</div>
            }
            {events.map((event, i) => (
              <EventBox key={"venue-event-" + i} startsAt={event.startsAt} slug={event.slug} tags={event.tags} title={event.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

VenueTemplate.propTypes = {
  contentComponent: PropTypes.func,
  address: PropTypes.arrayOf(PropTypes.string),
  events: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    startsAt: PropTypes.instanceOf(Moment).isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    title: PropTypes.string.isRequired,
  })),
  information: PropTypes.node,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  title: PropTypes.string,
}

const Venue = ({data, pageContext}) => {
  const {markdownRemark: venue} = data
  const {now} = pageContext

  const coords = JSON.parse(venue.frontmatter.location).coordinates

  const location = {
    lat: coords[1],
    lng: coords[0]
  }

  const events = (venue.frontmatter.venueEvents || []).map(event => {
    const tags = []

    if (event.frontmatter.eventType) {
      tags.push({
        key: "eventType",
        value: event.frontmatter.eventType,
      })
    }

    if (event.frontmatter.terrain) {
      tags.push({
        key: "terrain",
        value: event.frontmatter.terrain,
      })
    }

    if (event.frontmatter.championshipForeignKey) {
      tags.push({
        key: "championship",
        value: event.frontmatter.championshipForeignKey,
      })
    }

    if (event.frontmatter.competitionForeignKey) {
      tags.push({
        key: "competition",
        value: event.frontmatter.competitionForeignKey,
      })
    }

    return {
      slug: event.fields.slug,
      startsAt: Moment.utc(event.frontmatter.startsAt),
      tags: tags,
      title: event.frontmatter.eventKey,
    }
  }).filter(event => {
    return event.startsAt.isAfter(now)
  }).sort((a, b) => {
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
        information={venue.html}
        address={venue.frontmatter.address.split("\n")}
        location={location}
        title={venue.frontmatter.venueKey}
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
