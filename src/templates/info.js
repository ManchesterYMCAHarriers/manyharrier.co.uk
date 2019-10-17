import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import {HTMLContent} from "../components/Content";

export const InfoTemplate = ({
                               championshipName,
                               competitionName,
                               eventType,
                               terrain,
                               title,
                               information,
                             }) => {
  return (
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <HTMLContent content={information} />
          </div>
        </div>
      </div>
    </section>
  )
}

InfoTemplate.propTypes = {
  championshipName: PropTypes.string,
  competitionName: PropTypes.string,
  eventType: PropTypes.string,
  terrain: PropTypes.string,
  information: PropTypes.node,
  title: PropTypes.string,
}

const Info = ({data}) => {
  const {markdownRemark: info} = data

  return (
    <Layout>
      <InfoTemplate
        championshipName={info.frontmatter.forChampionshipKey}
        competitionName={info.frontmatter.forCompetitionKey}
        eventType={info.frontmatter.forEventType}
        terrain={info.frontmatter.forTerrain}
        information={info.html}
        title={info.frontmatter.infoKey}
      />
    </Layout>
  )
}

Info.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  }),
}

export default Info

export const infoQuery = graphql`
  query InfoByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        forChampionshipKey
        forCompetitionKey
        forEventType
        forTerrain
        infoKey
      }
    }
  }
`
