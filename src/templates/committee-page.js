import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from '../components/Content'
import StandardContentContainer from "../components/StandardContentContainer";
import {H1, H2} from "../components/Headings";
import {Helmet} from "react-helmet";

export const CommitteePageTemplate = ({siteTitle, title, description, intro, members, contentComponent}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <Helmet>
        <title>{title + ` | ` + siteTitle}</title>
        {description &&
        <meta name="description" content={description} />
        }
      </Helmet>
      <H1 title={title} />
      <PageContent className="content" content={intro} />
      <H2 title={"Committee members"} />
      {members.map(({name, role, description, image}, i) => (
        <div key={"committee-member-" + i} className="flex">
          <img src={image} alt={name} />
          <h3 className="font-semibold text-lg">
            <span>{name}</span> - <span className="text-gray-700">{role}</span>
            {description}
          </h3>
        </div>
      ))}
    </StandardContentContainer>
  )
}

CommitteePageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  intro: PropTypes.node,
  members: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    description: PropTypes.node,
    image: PropTypes.string,
  }))
}

const CommitteePage = ({data}) => {
  const {siteMetadata: title, markdownRemark: page} = data

  return (
    <Layout>
      <CommitteePageTemplate
        contentComponent={HTMLContent}
        siteTitle={title}
        title={page.frontmatter.title}
        description={page.frontmatter.description}
        intro={page.fields.intro}
        members={page.frontmatter.members}
      />
    </Layout>
  )
}

CommitteePage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default CommitteePage

export const committeePageQuery = graphql`
  query CommitteePage($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      html
      fields {
        intro
      }
      frontmatter {
        title
        description
        members {
          name
          role
          description
          image
        }
      }
    }
  }
`
