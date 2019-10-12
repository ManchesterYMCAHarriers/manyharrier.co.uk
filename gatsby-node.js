const _ = require('lodash')
const path = require('path')
const {createFilePath} = require('gatsby-source-filesystem')
const {fmImagesToRelative} = require('gatsby-remark-relative-images')
const Moment = require('moment')

exports.createPages = ({actions, graphql}) => {
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
              location {
                coordinates
              }
            }
            frontmatter {
              address
              templateKey
              venueEvents {
                id
                fields {
                  slug
                }
                frontmatter {
                  startsAt
                  title
                }
              }
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
              eq: "championship"
            }
          }
        }
        sort: {
          order: ASC,
          fields: [
            frontmatter___title
          ]
        }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              championshipEvents {
                id
                fields {
                  slug
                }
                frontmatter {
                  startsAt
                  title
                  venue {
                    id
                    frontmatter {
                      address
                      title
                    }
                  }
                }
              }
              templateKey
              title
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
              eq: "session"
            }
          }
        }
        sort: {
          order: ASC,
          fields: [
            frontmatter___title
          ]
        }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              sessionEvents {
                id
                fields {
                  slug
                }
                frontmatter {
                  startsAt
                  title
                  venue {
                    id
                    frontmatter {
                      address
                      title
                    }
                  }
                }
              }
              templateKey
              title
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
              eq: "route"
            }
          }
        }
        sort: {
          order: ASC,
          fields: [
            frontmatter___title
          ]
        }
      ) {
        edges {
          node {
            id
            fields {
              routeTrack {
                coordinates
              }
              slug
            }
            frontmatter {
              routeEvents {
                id
                fields {
                  slug
                }
                frontmatter {
                  startsAt
                  title
                  venue {
                    id
                    frontmatter {
                      address
                      title
                    }
                  }
                }
              }
              templateKey
              title
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
        sort: {
          order: ASC,
          fields: [
            frontmatter___startsAt,
            frontmatter___title
          ]
        }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              championship {
                id
                fields {
                  slug
                }
                frontmatter {
                  title
                }
              }
              route {
                id
                fields {
                  routeTrack {
                    coordinates
                  }
                  slug
                }
                frontmatter {
                  title
                }
              }
              session {
                id
                fields {
                  slug
                }
                frontmatter {
                  title
                }
              }
              startsAt
              templateKey
              terrain
              title
              type
              venue {
                id
                fields {
                  slug
                  location {
                    coordinates
                  }
                }
                frontmatter {
                  address
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
    const championships = results[2]
    const sessions = results[3]
    const routes = results[4]
    const events = results[5]

    createBlogPosts(actions, blogPosts)
    createVenues(actions, venues)
    createChampionships(actions, championships)
    createRoutes(actions, routes)
    createSessions(actions, sessions)
    createEvents(actions, events)
    createEventsCalendar(actions, events)
  })
}

function createBlogPosts(actions, blogPosts) {
  const {createPage} = actions

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
  const {createPage} = actions

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

function createChampionships(actions, championships) {
  const {createPage} = actions

  championships.data.allMarkdownRemark.edges.forEach(edge => {
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

function createSessions(actions, sessions) {
  const {createPage} = actions

  sessions.data.allMarkdownRemark.edges.forEach(edge => {
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

function createRoutes(actions, sessions) {
  const {createPage} = actions

  sessions.data.allMarkdownRemark.edges.forEach(edge => {
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
  const {createPage} = actions

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

function createEventsCalendar(actions, result) {
  const {createPage} = actions

  const events = result.data.allMarkdownRemark.edges
  const firstEventMoment = Moment.utc(events[0].node.frontmatter.startsAt)
  const lastEventMoment = Moment.utc(events[events.length - 1].node.frontmatter.startsAt)
  const monthsToGenerate = []

  for (let date = firstEventMoment.clone().startOf('month'); date.isSameOrBefore(lastEventMoment); date.add(1, 'month')) {
    monthsToGenerate.push(date.clone().startOf('month'))
  }

  monthsToGenerate.forEach(month => {
    createPage({
      path: `/events/` + month.format("MMMM-YYYY").toLowerCase(),
      component: path.resolve(
        `src/templates/events-calendar.js`
      ),
      // additional data can be passed via context
      context: {
        events: events,
        month: month,
        firstMonth: firstEventMoment.clone().startOf('month'),
        lastMonth: lastEventMoment.clone().startOf('month'),
      },
    })
  })
}

exports.createSchemaCustomization = ({actions, schema}) => {
  const {createTypes} = actions
  const typeDefs = [
    `type MarkdownRemark implements Node { 
      frontmatter: Frontmatter 
    }`,
    `type Frontmatter {
      address: String
      championship: MarkdownRemark @link(by: "frontmatter.title", from: "championshipName") # championship for event
      championshipName: String
      championshipEvents: [MarkdownRemark!] @link(by: "frontmatter.championshipName", from: "title") # events for championship
      location: String
      route: MarkdownRemark @link(by: "frontmatter.title", from: "routeName") # route for event
      routeName: String
      routeTrack: String
      routeEvents: [MarkdownRemark!] @link(by: "frontmatter.routeName", from: "title") # events for route
      session: MarkdownRemark @link(by: "frontmatter.title", from: "sessionName") # session for event
      sessionName: String
      sessionEvents: [MarkdownRemark!] @link(by: "frontmatter.sessionName", from: "title") # events for session
      startsAt: Date @dateformat(formatString: "YYYY-MM-DD HH:mm")
      templateKey: String
      terrain: String
      title: String
      type: String
      venue: MarkdownRemark @link(by: "frontmatter.title", from: "venueName") # venue for event
      venueName: String
      venueEvents: [MarkdownRemark!] @link(by: "frontmatter.venueName", from: "title") # events for venue
    }`
  ]

  createTypes(typeDefs)
}

exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  var value

  if (node.internal.type === `MarkdownRemark`) {
    value = createFilePath({node, getNode})
    createNodeField({
      name: `slug`,
      node,
      value,
    })

    // TODO: these node fields will cause a problem if there is no data available;
    //  i.e. a location and a route must exist otherwise this fails. Why?

    // If we have a location, create it as a field
    if (node.frontmatter.location) {
      value = JSON.parse(node.frontmatter.location)
      value.coordinates = value.coordinates.reverse()
      createNodeField({
        node,
        name: "location",
        value: value,
      })
    }

    // If we have a route, create it as a field
    if (node.frontmatter.routeTrack) {
      value = JSON.parse(node.frontmatter.routeTrack)
      value.coordinates = value.coordinates.map(coords => {
        return coords.reverse()
      })
      createNodeField({
        node,
        name: "routeTrack",
        value: value,
      })
    }
  }
}
