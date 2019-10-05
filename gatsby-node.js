const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.createPages = ({ actions, graphql }) => {
  return Promise.all([
    graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: {
            templateKey: {
              eq: "blog-post"
            }
          }
        }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }`),
    graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: {
            templateKey: {
              eq: "venue"
            }
          }
        }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              address
              location
              templateKey
            }
          }
        }
      }
    }`),
    graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: {
            templateKey: {
              eq: "event"
            }
          }
        }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              startsAt
              type
              templateKey
              venue {
                id
                fields {
                  slug
                }
                frontmatter {
                  address
                  location
                  title
                }
              }
            }
          }
        }
      }
    }`),
  ]).then(results => {
    const errors = []
    results.forEach(result => {
      if (result.errors) {
        errors.push(...result.errors)
        result.errors.forEach(e => console.error(e.toString()))
      }
    })

    if (errors.length > 0) {
      return Promise.reject(errors)
    }

    const blogPosts = results[0]
    const venues = results[1]
    const events = results[2]

    createBlogPosts(actions, blogPosts)
    createVenues(actions, venues)
    createEvents(actions, events)
  })
}

function createBlogPosts(actions, blogPosts) {
  const { createPage } = actions

  blogPosts.data.allMarkdownRemark.edges.forEach(edge => {
    const id = edge.node.id
    createPage({
      path: edge.node.fields.slug,
      tags: edge.node.frontmatter.tags,
      component: path.resolve(
        `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
      },
    })
  })

  // Tag pages:
  let tags = []
  // Iterate through each post, putting all found tags into `tags`
  blogPosts.data.allMarkdownRemark.edges.forEach(edge => {
    if (_.get(edge, `node.frontmatter.tags`)) {
      tags = tags.concat(edge.node.frontmatter.tags)
    }
  })
  // Eliminate duplicate tags
  tags = _.uniq(tags)

  // Make tag pages
  tags.forEach(tag => {
    const tagPath = `/tags/${_.kebabCase(tag)}/`

    createPage({
      path: tagPath,
      component: path.resolve(`src/templates/tags.js`),
      context: {
        tag,
      },
    })
  })
}

function createVenues(actions, venues) {
  const { createPage } = actions

  venues.data.allMarkdownRemark.edges.forEach(edge => {
    const id = edge.node.id
    createPage({
      path: edge.node.fields.slug,
      component: path.resolve(
        `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
      },
    })
  })
}


function createEvents(actions, events) {
  const { createPage } = actions

  events.data.allMarkdownRemark.edges.forEach(edge => {
    const id = edge.node.id
    createPage({
      path: edge.node.fields.slug,
      component: path.resolve(
        `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
      },
    })
  })
}

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = [
    "type MarkdownRemark implements Node { frontmatter: Frontmatter }",
    `type Frontmatter {
      address: String!
      events: [MarkdownRemark!]! @link(by: "frontmatter.venue.title", from: "venue") # events for venue
      location: String!
      startsAt: Date! @dateformat
      templateKey: String
      title: String
      type: String!
      venue: MarkdownRemark! @link(by: "frontmatter.title") # venue for event
    }`,
  ]

  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

// exports.sourceNodes = ({ actions, getNodesByType }) => {
//   // Add relations
//   const markdownNodes = getNodesByType("MarkdownRemark")
//     .forEach(node => {
//       // Add venues
//       if (node.frontmatter.venue) {
//         const venueNode = getNodesByType("MarkdownRemark")
//           .find(queryNode => queryNode.frontmatter.templateKey === "venue" && queryNode.frontmatter.title === node.frontmatter.venue)
//
//         if (venueNode) {
//           createNodeField({
//             node,
//             name: "venue",
//             value: venueNode.id,
//           })
//         }
//       }
//     })
// }
