import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";
import ChampionshipFixtures from "../components/ChampionshipFixtures";

export const ChampionshipTemplate = ({
                                       contentComponent,
                                       events,
                                       title,
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
            <h2>Fixtures</h2>
            <ChampionshipFixtures events={events} />
            <h2>Information</h2>
            <InformationContent content={information} />
          </div>
        </div>
      </div>
    </section>
  )
}

ChampionshipTemplate.propTypes = {
  contentComponent: PropTypes.func,
  events: PropTypes.object,
  information: PropTypes.node,
  title: PropTypes.string,
}

const Championship = ({data}) => {
  const {markdownRemark: championship} = data

  return (
    <Layout>
      <ChampionshipTemplate
        contentComponent={HTMLContent}
        events={championship.frontmatter.championshipEvents}
        information={championship.html}
        title={championship.frontmatter.championshipKey}
      />
    </Layout>
  )
}

Championship.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  }),
}

export default Championship

export const championshipQuery = graphql`
  query ChampionshipByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        championshipEvents {
          id
          fields {
            slug
          }
          frontmatter {
            eventKey
            startsAt
            venue {
              id
              frontmatter {
                address
                title
              }
            }
          }
        }
        championshipKey
      }
    }
  }
`
