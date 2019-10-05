import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";
import Venue, {VenueTemplate} from "./venue";

export const EventTemplate = ({
                                contentComponent,
                                title,
                                venue,
                                type,
                                startsAt,
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
            <h2>Venue</h2>
            <VenueTemplate title={venue.title} address={venue.address} information={venue.information} location={venue.location} />
            <h2>Type</h2>
            <p>{type}</p>
            <h2>Starts at</h2>
            <p>{startsAt}</p>
            <h2>Information</h2>
            <InformationContent content={information} />
          </div>
        </div>
      </div>
    </section>
  )
}

EventTemplate.propTypes = {
  contentComponent: PropTypes.func,
  information: PropTypes.node,
  startsAt: PropTypes.instanceOf(Date),
  type: PropTypes.string,
  title: PropTypes.string,
  venue: PropTypes.node,
}

const Event = ({data}) => {
  const {markdownRemark: event} = data

  return (
    <Layout>
      <EventTemplate
        contentComponent={HTMLContent}
        information={event.html}
        startsAt={event.frontmatter.startsAt}
        type={event.frontmatter.type}
        title={event.frontmatter.title}
        venue={event.frontmatter.venue}
      />
    </Layout>
  )
}

Event.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  }),
}

export default Venue

export const eventQuery = graphql`
  query EventByID($id: String!) {
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
