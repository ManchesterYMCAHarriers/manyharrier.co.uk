import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import GoogleMapsRoute from '../components/GoogleMapsRoute'
import Moment from 'moment'
import EventBox from '../components/EventBox'
import StandardContentContainer from '../components/StandardContentContainer'
import { H1, H2 } from '../components/Headings'
import {PanelFullWidth, Panels} from "../components/Panels";
import Hero from "../components/Hero";

export const RouteTemplate = ({
  contentComponent,
  events,
  googleMapsApiKey,
  title,
  heroImage,
  routeTrack,
  information,
}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <Panels>
        <PanelFullWidth>
          {heroImage ? (
            <Hero fluidImage={heroImage} title={title} />)
          : (
            <div className="panel red-bottom">
              <h1 className="heading-1">{title}</h1>
            </div>
          )}
        </PanelFullWidth>
        <PanelFullWidth>
          <div className="w-full relative" style={{ height: '70vh' }}>
            <GoogleMapsRoute
              googleMapsApiKey={googleMapsApiKey}
              id={'route-map'}
              paths={routeTrack}
              mapContainerClassName={'h-full'}
              zoom={14}
            />
          </div>
        </PanelFullWidth>
        {information && (
          <PanelFullWidth>
            <div className="content panel black-bottom" dangerouslySetInnerHTML={{__html: information}} />
          </PanelFullWidth>
        )}
        <PanelFullWidth>
          <div className="panel black-bottom">
            <h2 className="heading-2 mb-4">Upcoming events</h2>
            {events.length === 0 && (
              <p className="paragraph">There are no upcoming events on the {title} route.</p>
            )}
            {events.map(({ startsAt, slug, title }, i) => (
              <EventBox
                key={'route-event-' + i}
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

RouteTemplate.propTypes = {
  contentComponent: PropTypes.func,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      startsAt: PropTypes.instanceOf(Moment).isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
      title: PropTypes.string.isRequired,
    })
  ),
  googleMapsApiKey: PropTypes.string.isRequired,
  information: PropTypes.node,
  routeTrack: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
}

const Route = ({ data, pageContext }) => {
  const {
    site: {
      siteMetadata: {
        apiKey: { googleMaps: googleMapsApiKey },
      },
    },
    markdownRemark: route,
  } = data
  const { now } = pageContext

  const events = (route.frontmatter.routeEvents || [])
    .map(event => {
      const tags = []

      if (
        event.frontmatter.venue &&
        event.frontmatter.venue.frontmatter.venueKey
      ) {
        tags.push({
          key: 'venue',
          value: event.frontmatter.venue.frontmatter.venueKey,
        })
      }

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

      return {
        startsAt: Moment.utc(event.frontmatter.startsAt),
        slug: event.fields.slug,
        tags: tags,
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

  const routeTrack = JSON.parse(route.frontmatter.routeTrack).coordinates.map(
    coords => {
      return {
        lat: coords[1],
        lng: coords[0],
      }
    }
  )

  const heroImage = route.frontmatter.heroImage ? route.frontmatter.heroImage.childImageSharp.fluid : null

  return (
    <Layout path={route.fields.slug}>
      <RouteTemplate
        contentComponent={HTMLContent}
        events={events}
        googleMapsApiKey={googleMapsApiKey}
        information={route.html}
        routeTrack={routeTrack}
        title={route.frontmatter.routeKey}
        heroImage={heroImage}
      />
    </Layout>
  )
}

Route.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default Route

export const routeQuery = graphql`
  query RouteByID($id: String!) {
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
        heroImage {
          childImageSharp {
            fluid(maxWidth: 1344, maxHeight: 756) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        routeEvents {
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
            venue {
              id
              frontmatter {
                venueKey
              }
            }
          }
        }
        routeKey
        routeTrack
      }
    }
  }
`
