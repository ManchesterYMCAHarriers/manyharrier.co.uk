import React from 'react'
import * as PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import { PanelFullWidth, Panels } from '../components/Panels'
import Hero from '../components/Hero'
import { CommitteePanel } from '../components/CommitteePanel'

export const CommitteePageTemplate = ({
  title,
  heroImage,
  intro,
  members,
}) => {
  return (
    <StandardContentContainer>
      {heroImage ? (
        <Hero fluidImage={heroImage} title={title} />
      ) : (
        <h1 className="heading-1">{title}</h1>
      )}
      <Panels>
        <PanelFullWidth>
          <div className="panel red-bottom">
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: intro }}
            />
          </div>
        </PanelFullWidth>
      </Panels>
      <div className="grid grid-cols-4 gap-4 max-w-6xl pt-9">
        {members.map(({ name, role, description, keySkill, favouriteRace, image }, i) => (
          <CommitteePanel
            key={"committee-member-" + i}
            name={name}
            role={role}
            description={description}
            keySkill={keySkill}
            favouriteRace={favouriteRace}
            image={image}
          />
        ))}
      </div>
    </StandardContentContainer>
  )
}

CommitteePageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  intro: PropTypes.node,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      description: PropTypes.node.isRequired,
      keySkill: PropTypes.string,
      favouriteRace: PropTypes.string,
      image: PropTypes.object.isRequired,
    })
  ),
}

const CommitteePage = ({ data, location }) => {
  const { markdownRemark: page } = data

  const members = page.frontmatter.members.map((member, i) => {
    member.description = page.fields.memberDescriptions[i]
    member.image = member.doubleImage
      ? member.doubleImage.childImageSharp.fixed
      : member.singleImage.childImageSharp.fixed
    return member
  })

  const heroImage = page.frontmatter.heroImage
    ? page.frontmatter.heroImage.childImageSharp.fluid
    : null

  return (
    <Layout title={page.frontmatter.title} description={page.frontmatter.description} path={page.fields.slug} location={location}>
      <CommitteePageTemplate
        title={page.frontmatter.title}
        heroImage={heroImage}
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
        heroImage {
          childImageSharp {
            ...HeroImage
          }
        }
        members {
          name
          role
          description
          keySkill
          favouriteRace
          singleImage {
            childImageSharp {
              fixed(width: 256, height: 384) {
                ...GatsbyImageSharpFixed_withWebp_tracedSVG
              }
            }
          }
        }
      }
    }
  }
`
