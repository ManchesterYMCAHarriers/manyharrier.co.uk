import React from 'react'
import PropTypes from 'prop-types'
import {graphql, Link} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";

export const EventTemplate = ({
                                contentComponent,
                                title,
                                venue,
                                startDate,
  startTime,
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
            <p className="is-size-4">
              <Link to={venue.fields.slug} className="is-inline-tablet">{venue.frontmatter.title}</Link>
              <div className="is-inline is-hidden-mobile">, </div>
              <div className="is-inline-tablet">{startDate}</div>
              <div className="is-inline is-hidden-mobile"> at </div>
              <div className="is-inline-tablet">{startTime}</div>
            </p>
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
  startDate: PropTypes.string,
  startTime: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  venue: PropTypes.object,
}

const Event = ({data}) => {
  const {markdownRemark: event} = data

  return (
    <Layout>
      <EventTemplate
        contentComponent={HTMLContent}
        information={event.html}
        startDate={event.frontmatter.startDate}
        startTime={event.frontmatter.startTime}
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

export default Event

export const eventQuery = graphql`
  query EventByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        startDate: startsAt(formatString: "Do MMMM YYYY")
        startTime: startsAt(formatString: "h:mma")
        type
        venue {
          id
          fields {
            slug
            location {
              coordinates
            }
          }
          frontmatter {
            address
            title
          }
        }
      }
    }
  }
`
