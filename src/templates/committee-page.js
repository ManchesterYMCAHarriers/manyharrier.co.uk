import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import StandardContentContainer from '../components/StandardContentContainer'
import { H1, H2 } from '../components/Headings'
import { Helmet } from 'react-helmet'

export const CommitteePageTemplate = ({
  siteTitle,
  title,
  description,
  intro,
  members,
  contentComponent,
}) => {
  const PageContent = contentComponent || Content

  return (
    <StandardContentContainer>
      <Helmet>
        <title>{title + ` | ` + siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <H1 title={title} />
      <PageContent className="content" content={intro} />
      <H2 title={'Committee members'} />
      {members.map(({ name, role, description, image }, i) => (
        <div
          key={'committee-member-' + i}
          className="flex flex-wrap md:flex-no-wrap my-4 pb-4 border-b-2 border-gray-700 last:border-b-0"
        >
          <div
            className={
              'mx-auto mb-4 md:ml-4 md:mb-0 flex-shrink-0 flex-grow-0 md:order-2'
            }
          >
            <img
              src={image.publicURL}
              alt={'Photo of ' + name}
              className={'border-2 border-gray-700'}
            />
          </div>
          <div className="flex-shrink flex-grow md:order-1">
            <h3 className="font-semibold text-lg">
              <span>{name}</span> -{' '}
              <span className="text-gray-700">{role}</span>
            </h3>
            <PageContent className="content" content={description} />
          </div>
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
  members: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      description: PropTypes.node.isRequired,
      image: PropTypes.shape({
        publicURL: PropTypes.string.isRequired,
      }).isRequired,
    })
  ),
}

const CommitteePage = ({ data }) => {
  const { siteMetadata: title, markdownRemark: page } = data

  const members = page.frontmatter.members.map((member, i) => {
    member.description = page.fields.memberDescriptions[i]
    return member
  })

  return (
    <Layout path={page.fields.slug}>
      <CommitteePageTemplate
        contentComponent={HTMLContent}
        siteTitle={title}
        title={page.frontmatter.title}
        description={page.frontmatter.description}
        intro={page.fields.intro}
        members={members}
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
        memberDescriptions
        slug
      }
      frontmatter {
        title
        description
        members {
          name
          role
          image {
            publicURL
          }
        }
      }
    }
  }
`
