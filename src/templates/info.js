import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import EventTags from '../components/EventTags'
import StandardContentContainer from "../components/StandardContentContainer";
import {H1} from "../components/Headings";

export const InfoTemplate = ({
  contentComponent,
  tags,
  title,
  information,
}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <H1 title={title} />
      <EventTags reactKey={'info-for'} tags={tags} />
      <PageContent content={information} />
    </StandardContentContainer>
  )
}

InfoTemplate.propTypes = {
  contentComponent: PropTypes.func,
  information: PropTypes.node,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  title: PropTypes.string,
}

const Info = ({ data }) => {
  const { markdownRemark: info } = data

  const tags = []

  if (info.frontmatter.forChampionshipKey) {
    tags.push({
      key: 'championship',
      value: info.frontmatter.forChampionshipKey,
    })
  }

  if (info.frontmatter.forCompetitionKey) {
    tags.push({
      key: 'competition',
      value: info.frontmatter.forCompetitionKey,
    })
  }

  if (info.frontmatter.forEventType) {
    tags.push({
      key: 'eventType',
      value: info.frontmatter.forEventType,
    })
  }

  if (info.frontmatter.forTerrain) {
    tags.push({
      key: 'terrain',
      value: info.frontmatter.forTerrain,
    })
  }

  return (
    <Layout path={info.fields.slug}>
      <InfoTemplate
        contentComponent={HTMLContent}
        information={info.html}
        tags={tags}
        title={info.frontmatter.infoKey}
      />
    </Layout>
  )
}

Info.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
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
