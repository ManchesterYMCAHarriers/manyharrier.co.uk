import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from "../components/Content";

export const InfoTemplate = ({
                               contentComponent,
                               championshipName,
                               competitionName,
                               eventType,
                               terrain,
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
            <InformationContent content={information} />
          </div>
        </div>
      </div>
    </section>
  )
}

InfoTemplate.propTypes = {
  contentComponent: PropTypes.func,
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
        contentComponent={HTMLContent}
        championshipName={info.frontmatter.championshipName}
        competitionName={info.frontmatter.championshipName}
        eventType={info.frontmatter.eventType}
        terrain={info.frontmatter.terrain}
        information={info.html}
        title={info.frontmatter.title}
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
        championshipName
        competitionName
        eventType
        terrain
        title
      }
    }
  }
`
