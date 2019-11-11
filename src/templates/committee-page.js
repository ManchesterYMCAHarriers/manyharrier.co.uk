import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from '../components/Content'
import StandardContentContainer from '../components/StandardContentContainer'
import {Helmet} from 'react-helmet'
import {PanelFullWidth, Panels} from "../components/Panels";
import Img from "gatsby-image";

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
      <Panels>
        <PanelFullWidth>
          <div className="panel red-bottom">
            <h1 className="heading-1 mb-4">{title}</h1>
            <div className="content"
                 dangerouslySetInnerHTML={{__html: intro}} />
          </div>
        </PanelFullWidth>
      </Panels>
      <Panels>
        {members.map(({name, role, description, image}, i) => (
          <PanelFullWidth
            key={'committee-member-' + i}
          >
            <div
              className={`flex panel black-bottom`}>
              <div className={`mx-auto mb-4 md:ml-4 md:mb-0 flex-shrink-0 flex-grow-0 md:order-2`}>
                <Img fixed={image} alt={'Photo of ' + name} className={`border-2 border-black-manyharrier`}/>
              </div>
              <div className="flex-shrink flex-grow md:order-1">
                <h3 className="heading-3 mb-4">
                  <span>{name}</span> -{' '}
                  <span className="text-gray-700">{role}</span>
                </h3>
                <div className="content"
                     dangerouslySetInnerHTML={{__html: description}} />
              </div>
            </div>
          </PanelFullWidth>
        ))}
      </Panels>
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
      image: PropTypes.object,
    })
  ),
}

const CommitteePage = ({data}) => {
  const {siteMetadata: title, markdownRemark: page} = data

  const members = page.frontmatter.members.map((member, i) => {
    member.description = page.fields.memberDescriptions[i]
    member.image = member.doubleImage ? member.doubleImage.childImageSharp.fixed : member.singleImage.childImageSharp.fixed
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
          singleImage {
            childImageSharp {
              fixed(width: 200, height: 250) {
                ...GatsbyImageSharpFixed_withWebp_tracedSVG
              }
            }
          }
          doubleImage {
            childImageSharp {
              fixed(width: 400, height: 250) {
                ...GatsbyImageSharpFixed_withWebp_tracedSVG
              }
            }
          }
        }
      }
    }
  }
`
