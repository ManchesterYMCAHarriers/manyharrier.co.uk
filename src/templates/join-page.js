import React from 'react'
import PropTypes from 'prop-types'
import {graphql, Link} from 'gatsby'
import Layout from '../components/Layout'
import Content, {HTMLContent} from '../components/Content'
import StandardContentContainer from "../components/StandardContentContainer";
import {H1, H2} from "../components/Headings";
import {Helmet} from "react-helmet";

export const JoinPageTemplate = ({siteTitle, title, description, contentComponent, howToJoinUs, membershipBenefits, yClubFacilities, firstClaimPrice, firstClaimValidTo}) => {
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
      <div className="content">
        <p>First claim membership until {firstClaimValidTo} is
          just {firstClaimPrice}!</p>
      </div>
      <H2 title={"How to join us"} />
      <PageContent className="content" content={howToJoinUs} />
      <div className="text-center my-8">
        <Link to={'/join/form'}
              className="px-4 py-2 font-semibold text-lg border rounded border-gray-700 bg-teal-600 text-white hover:bg-teal-800 focus:bg-teal-800">
          Join us now!
        </Link>
      </div>
      <H2 title={"Membership benefits"} />
      <PageContent className="content" content={membershipBenefits} />
      <div className="text-center my-8">
        <Link to={'/join/form'}
              className="px-4 py-2 font-semibold text-lg border rounded border-gray-700 bg-teal-600 text-white hover:bg-teal-800 focus:bg-teal-800">
          Join us now!
        </Link>
      </div>
      <H2 title={"A note on the use of Y Club facilities"} />
      <PageContent className="content" content={yClubFacilities} />
    </StandardContentContainer>
  )
}

JoinPageTemplate.propTypes = {
  siteTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  contentComponent: PropTypes.func,
  howToJoinUs: PropTypes.node.isRequired,
  membershipBenefits: PropTypes.node.isRequired,
  yClubFacilities: PropTypes.node.isRequired,
  firstClaimValidTo: PropTypes.string.isRequired,
  firstClaimPrice: PropTypes.string.isRequired,
}

const JoinPage = ({data}) => {
  const {site: {siteMetadata: {title}}, markdownRemark: page, stripeSku: firstClaimMembership } = data

  return (
    <Layout>
      <JoinPageTemplate
        contentComponent={HTMLContent}
        siteTitle={title}
        title={page.frontmatter.title}
        description={page.frontmatter.description}
        howToJoinUs={page.fields.howToJoinUs}
        membershipBenefits={page.fields.membershipBenefits}
        yClubFacilities={page.fields.yClubFacilities}
        firstClaimPrice={"£" + (firstClaimMembership.price / 100).toFixed(2)}
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
        membershipBenefits
        yClubFacilities
      }
      frontmatter {
        title
        description
      }
    }
    stripeSku(product: {name: {eq: "membership"}}, attributes: {claim: {eq: "First"}}, active: {eq: true}) {
      price
      attributes {
        valid_to
      }
    }
  }
`
