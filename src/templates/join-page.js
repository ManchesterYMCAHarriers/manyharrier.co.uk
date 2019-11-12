import React from 'react'
import * as PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import {Helmet} from 'react-helmet'
import Currency from '../components/Currency'
import {Panel, PanelFullWidth, Panels} from "../components/Panels";
import {CallToActionLink} from "../components/CallToAction";
import {Card} from "../components/Card";
import Hero from "../components/Hero";

export const JoinPageTemplate = ({
                                   siteTitle,
                                   title,
                                   heroImage,
                                   description,
                                   howToJoinUs,
                                   membershipBenefitsIntro,
                                   membershipBenefits,
                                   yClubFacilities,
                                   firstClaimPrice,
                                   firstClaimValidTo,
                                 }) => {
  return (
    <StandardContentContainer>
      <Helmet>
        <title>{title + ` | ` + siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <Hero title={title}
            subtitle={`First claim membership until ${firstClaimValidTo} is just ${firstClaimPrice}!`}
            fluidImage={heroImage} />
      <Panels>
        <PanelFullWidth>
          <div className="panel red-bottom">
            <h2 className="heading-2">How to join us</h2>
            <div className="content"
                 dangerouslySetInnerHTML={{__html: howToJoinUs}} />
            <div className="text-right my-8">
              <CallToActionLink to={'/join/form'} title={'Join now!'} />
            </div>
          </div>
        </PanelFullWidth>
      </Panels>
      <Panels>
        <PanelFullWidth>
          <div className="panel black-bottom">
            <h2 className="heading-2">Membership benefits</h2>
            <div className="content"
                 dangerouslySetInnerHTML={{__html: membershipBenefitsIntro}} />
          </div>
        </PanelFullWidth>
      </Panels>
      <Panels>
        {membershipBenefits.map(({title, image, body, callToActionLink, callToActionTitle}, i) => (
          <Panel>
            <Card
              borderColorClassName={(i % 2 === 0 ? 'border-red-manyharrier' : 'border-black-manyharrier')}
              title={title} image={image} callToAction={callToActionLink &&
            <CallToActionLink to={callToActionLink}
                              title={callToActionTitle} />}>
              <div className="content"
                   dangerouslySetInnerHTML={{__html: body}} />
            </Card>
          </Panel>
        ))}
      </Panels>
    </StandardContentContainer>
  )
}

JoinPageTemplate.propTypes = {
  siteTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  heroImage: PropTypes.object,
  description: PropTypes.string,
  contentComponent: PropTypes.func,
  howToJoinUs: PropTypes.node.isRequired,
  membershipBenefitsIntro: PropTypes.node.isRequired,
  membershipBenefits: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
  yClubFacilities: PropTypes.node.isRequired,
  firstClaimValidTo: PropTypes.string.isRequired,
  firstClaimPrice: PropTypes.string.isRequired,
}

const JoinPage = ({data}) => {
  const {
    site: {
      siteMetadata: {title},
    },
    markdownRemark: page,
    stripeSku: firstClaimMembership,
  } = data

  const membershipBenefits = page.frontmatter.membershipBenefits.map(({title, image, callToActionLink, callToActionTitle}, i) => {
    return {
      title,
      image: image && image.childImageSharp.fluid,
      body: page.fields.membershipBenefits[i],
      callToActionLink,
      callToActionTitle,
    }
  })

  return (
    <Layout path={page.fields.slug}>
      <JoinPageTemplate
        siteTitle={title}
        title={page.frontmatter.title}
        heroImage={page.frontmatter.heroImage.childImageSharp.fluid}
        description={page.frontmatter.description}
        howToJoinUs={page.fields.howToJoinUs}
        membershipBenefitsIntro={page.fields.membershipBenefitsIntro}
        membershipBenefits={membershipBenefits}
        yClubFacilities={page.fields.yClubFacilities}
        firstClaimPrice={Currency(firstClaimMembership.price)}
        firstClaimValidTo={firstClaimMembership.attributes.valid_to}
      />
    </Layout>
  )
}

JoinPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default JoinPage

export const joinPageQuery = graphql`
  query JoinPage($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      html
      fields {
        howToJoinUs
        membershipBenefitsIntro
        membershipBenefits
        slug
      }
      frontmatter {
        title
        heroImage {
          childImageSharp {
            ...HeroImage
          }
        }
        description
        membershipBenefits {
          title
          image {
            childImageSharp {
              fluid(maxWidth: 672, maxHeight: 448) {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
            }
          }
          callToActionLink
          callToActionTitle
        }
      }
    }
    stripeSku(
      product: { name: { eq: "Membership" } }
      attributes: { claim: { eq: "First" } }
      active: { eq: true }
    ) {
      price
      attributes {
        valid_to
      }
    }
  }
`
