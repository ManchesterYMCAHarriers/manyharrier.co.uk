import React from 'react'
import * as PropTypes from 'prop-types'
import Layout from '../components/Layout'
import Moment from 'moment'
import { graphql } from 'gatsby'
import StandardContentContainer from '../components/StandardContentContainer'
import { Panel, PanelFullWidth, Panels } from '../components/Panels'
import {
  CallToActionBackLink,
  CallToActionLink,
  CallToActionText,
} from '../components/CallToAction'
import { CardCTA } from '../components/Card'

export class BlogIndexTemplate extends React.Component {
  render() {
    const { posts, previousIndexLink, nextIndexLink } = this.props

    return (
      <StandardContentContainer>
        <h1 className="heading-1 mb-4">Blog</h1>
        <Panels>
          {posts.map(({ slug, publishedAt, title, excerpt, heroImage }) => (
            <Panel key={`blog-index-${slug}`}>
              <CardCTA
                title={title}
                image={heroImage}
                to={slug}
                callToAction={<CallToActionText title={'Read'} />}
                borderColorClassName={'border-gray-400'}
                borderColorHoverClassName={'border-red-manyharrier'}
              >
                <p className="text-right text-sm text-gray-600 mb-4">
                  {publishedAt}
                </p>
                <p className="mb-4 font-light">{excerpt}</p>
              </CardCTA>
            </Panel>
          ))}
        </Panels>
        <Panels>
          <PanelFullWidth>
            <div className="panel black-bottom flex justify-between">
              {previousIndexLink ? (
                <CallToActionBackLink title={'Newer'} to={previousIndexLink} />
              ) : (
                <span />
              )}
              {nextIndexLink ? (
                <CallToActionLink title={'Older'} to={nextIndexLink} />
              ) : (
                <span />
              )}
            </div>
          </PanelFullWidth>
        </Panels>
      </StandardContentContainer>
    )
  }
}

BlogIndexTemplate.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      publishedAt: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired,
      heroImage: PropTypes.object,
    })
  ),
  nextIndexLink: PropTypes.string,
  previousIndexLink: PropTypes.string,
}

const BlogIndex = ({ data, pageContext }) => {
  const previousIndexLink =
    pageContext.skip > 0
      ? pageContext.skip > 10
        ? `/blog/${pageContext.skip / 10}`
        : `/blog`
      : null
  const nextIndexLink =
    pageContext.skip + 10 < pageContext.totalBlogPosts
      ? `/blog/${(pageContext.skip + 20) / 10}`
      : null

  const posts = data.allMarkdownRemark.edges.map(({ node }) => {
    return {
      slug: node.fields.slug,
      publishedAt: node.frontmatter.publishedAt,
      title: node.frontmatter.blogKey,
      excerpt: node.excerpt,
      heroImage: node.frontmatter.heroImage
        ? node.frontmatter.heroImage.childImageSharp.fluid
        : null,
    }
  })

  return (
    <Layout path={'/blog'}>
      <BlogIndexTemplate
        posts={posts}
        nextIndexLink={nextIndexLink}
        previousIndexLink={previousIndexLink}
      />
    </Layout>
  )
}

BlogIndex.propTypes = {
  data: PropTypes.object,
}

export default BlogIndex

export const blogIndexQuery = graphql`
  query BlogIndexQuery($skip: Int!) {
    allMarkdownRemark(
      limit: 10
      sort: { fields: frontmatter___publishedAt, order: DESC }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            blogKey
            publishedAt(formatString: "Do MMMM YYYY")
            heroImage {
              childImageSharp {
                ...CardImage
              }
            }
          }
          excerpt(format: PLAIN, pruneLength: 156, truncate: false)
        }
      }
    }
  }
`
