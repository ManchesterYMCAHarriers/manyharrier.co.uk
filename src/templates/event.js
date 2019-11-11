import React from 'react'
import PropTypes from 'prop-types'
import {graphql, Link} from 'gatsby'
import Moment from 'moment'
import Layout from '../components/Layout'
import Content, {HTMLContent} from '../components/Content'
import StandardContentContainer from '../components/StandardContentContainer'
import {get} from 'lodash'
import Address from '../components/Address'
import GoogleMapsLocationAndRoute
  from '../components/GoogleMapsLocationAndRoute'
import GoogleMapsLocation from '../components/GoogleMapsLocation'
import GoogleMapsDirectionsLink from '../components/GoogleMapsDirectionsLink'
import EventTags from '../components/EventTags'
import {H1} from '../components/Headings'
import Hero from "../components/Hero";
import {Panel, PanelFullWidth, Panels} from "../components/Panels";
import {CallToActionLink} from "../components/CallToAction";

export const EventTemplate = ({
                                contentComponent,
                                championship,
                                eventInfo,
                                googleMapsApiKey,
                                infoForChampionship,
                                infoForCompetition,
                                infoForEventType,
                                infoForTerrain,
                                route,
                                session,
                                startsAt,
                                tags,
                                title,
                                heroImage,
                                venue,
                              }) => {
  const track = route ? route.track : null

  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      {heroImage && <Hero title={title} fluidImage={heroImage} />}
      {!heroImage && <h1 className="heading-1">{title}</h1>}
      <Panels>
        <Panel>
          <div className="panel red-bottom">
            <p className="text-lg leading-relaxed">
              {startsAt.format('dddd Do MMMM YYYY, h:mm:a')}
            </p>
            <EventTags reactKey={'event'} tags={tags} />
          </div>
        </Panel>
        <Panel>
          <div className="panel black-bottom md:text-right">
            <Address address={venue.address} title={venue.title} />
          </div>
        </Panel>
      </Panels>
      <Panels>
        <PanelFullWidth>
          <div className="w-full relative" style={{height: '70vh'}}>
            {track && (
              <GoogleMapsLocationAndRoute
                googleMapsApiKey={googleMapsApiKey}
                track={track}
                id={'event-location-and-route'}
                location={venue.location}
                mapContainerClassName={'h-full'}
              />
            )}
            {!track && (
              <GoogleMapsLocation
                googleMapsApiKey={googleMapsApiKey}
                id={'event-location'}
                location={venue.location}
                mapContainerClassName={'h-full'}
              />
            )}
          </div>
        </PanelFullWidth>
      </Panels>
      <Panels>
        <Panel>
          <div className="panel black-bottom">
            <CallToActionLink to={GoogleMapsDirectionsLink(venue)} title={`Navigate to ${venue.title} with Google Maps`} />
          </div>
        </Panel>
        <Panel>
          <div className="panel black-bottom">
            <CallToActionLink to={venue.slug} title={`Full venue info`}/>
          </div>
        </Panel>
      </Panels>
      {eventInfo && (
        <Panels>
          <PanelFullWidth>
            <div className="content panel red-bottom" dangerouslySetInnerHTML={{__html: eventInfo}} />
          </PanelFullWidth>
        </Panels>
      )}
      {session && (
        <Panels>
          <PanelFullWidth>
            <div className="content panel red-bottom" dangerouslySetInnerHTML={{__html: session}} />
          </PanelFullWidth>
        </Panels>
      )}
      {infoForTerrain && (
        <Panels>
          <PanelFullWidth>
            <div className="content panel red-bottom" dangerouslySetInnerHTML={{__html: infoForTerrain}} />
          </PanelFullWidth>
        </Panels>
      )}
      {infoForEventType && (
        <Panels>
          <PanelFullWidth>
            <div className="content panel red-bottom" dangerouslySetInnerHTML={{__html: infoForEventType}} />
          </PanelFullWidth>
        </Panels>
      )}
      {infoForCompetition && (
        <Panels>
          <PanelFullWidth>
            <div className="content panel red-bottom" dangerouslySetInnerHTML={{__html: infoForCompetition}} />
          </PanelFullWidth>
        </Panels>
      )}
      {infoForChampionship && (
        <Panels>
          <PanelFullWidth>
            <div className="content panel red-bottom" dangerouslySetInnerHTML={{__html: infoForChampionship}} />
          </PanelFullWidth>
        </Panels>
      )}
    </StandardContentContainer>
  )
}

EventTemplate.propTypes = {
  championship: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
  }),
  contentComponent: PropTypes.func,
  eventInfo: PropTypes.node,
  googleMapsApiKey: PropTypes.string.isRequired,
  infoForChampionship: PropTypes.node,
  infoForCompetition: PropTypes.node,
  infoForEventType: PropTypes.node,
  infoForTerrain: PropTypes.node,
  route: PropTypes.shape({
    description: PropTypes.node,
    title: PropTypes.string,
    track: PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      })
    ),
  }),
  session: PropTypes.node,
  startsAt: PropTypes.instanceOf(Moment).isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  title: PropTypes.string.isRequired,
  venue: PropTypes.shape({
    address: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    slug: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
}

const Event = ({data, pageContext}) => {
  const {
    site: {
      siteMetadata: {
        apiKey: {googleMaps: googleMapsApiKey},
      },
    },
    markdownRemark: event,
  } = data

  const startsAt = Moment.utc(event.frontmatter.startsAt)

  let championship, route, venue

  if (event.frontmatter.championship) {
    championship = {
      slug: event.frontmatter.championship.fields.slug,
      title: event.frontmatter.championship.frontmatter.championshipKey,
    }
  }

  if (event.frontmatter.route) {
    route = {
      description: event.frontmatter.route.html,
      title: event.frontmatter.route.frontmatter.routeKey,
    }
    const routeTrack = event.frontmatter.route.frontmatter.routeTrack
    if (routeTrack) {
      route.track = JSON.parse(routeTrack).coordinates.map(coords => {
        return {
          lat: coords[1],
          lng: coords[0],
        }
      })
    }
  }

  if (event.frontmatter.venue) {
    let coords = JSON.parse(event.frontmatter.venue.frontmatter.location)
      .coordinates
    venue = {
      address: event.frontmatter.venue.frontmatter.address.split('\n'),
      location: {
        lat: coords[1],
        lng: coords[0],
      },
      slug: event.frontmatter.venue.fields.slug,
      title: event.frontmatter.venue.frontmatter.venueKey,
    }
  }

  const tags = []

  if (event.frontmatter.eventType) {
    tags.push({
      key: 'eventType',
      value: event.frontmatter.eventType,
    })
  }

  if (event.frontmatter.terrain) {
    tags.push({
      key: 'terrain',
      value: event.frontmatter.terrain,
    })
  }

  if (event.frontmatter.championshipForeignKey) {
    tags.push({
      key: 'championship',
      value: event.frontmatter.championshipForeignKey,
    })
  }

  if (event.frontmatter.competitionForeignKey) {
    tags.push({
      key: 'competition',
      value: event.frontmatter.competitionForeignKey,
    })
  }

  return (
    <Layout path={event.fields.slug}>
      <EventTemplate
        championship={championship}
        contentComponent={HTMLContent}
        eventInfo={event.html}
        googleMapsApiKey={googleMapsApiKey}
        infoForChampionship={get(event.frontmatter.infoForChampionship, [
          'html',
        ])}
        infoForCompetition={get(event.frontmatter.infoForCompetition, ['html'])}
        infoForEventType={get(event.frontmatter.infoForEventType, ['html'])}
        infoForTerrain={get(event.frontmatter.infoForChampionship, ['html'])}
        route={route}
        session={get(event.frontmatter.session, ['html'])}
        startsAt={startsAt}
        tags={tags}
        title={event.frontmatter.eventKey}
        venue={venue}
      />
    </Layout>
  )
}

Event.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default Event

export const eventQuery = graphql`
  query EventByID($id: String!) {
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
        championship {
          fields {
            slug
          }
          frontmatter {
            championshipKey
          }
        }
        eventKey
        eventType
        #        infoForChampionship {
        #          html
        #        }
        infoForCompetition {
          html
        }
        infoForEventType {
          html
        }
        infoForTerrain {
          html
        }
        route {
          html
          frontmatter {
            routeKey
            routeTrack
          }
        }
        session {
          html
          fields {
            slug
          }
          frontmatter {
            sessionKey
          }
        }
        startsAt
        terrain
        venue {
          fields {
            slug
          }
          frontmatter {
            address
            location
            venueKey
          }
        }
      }
    }
  }
`
