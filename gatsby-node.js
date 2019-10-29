const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')
const Moment = require('moment')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const pages = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              calendarPage: startsAt(formatString: "YYYY-MM")
              templateKey
            }
          }
        }
      }
    }
  `)

  if (pages.errors) {
    pages.errors.forEach(e => console.error(e.toString()))
    return Promise.reject(result.errors)
  }

  pages.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const id = node.id
    const now = Moment.utc().format('YYYY-MM-DD HH:mm')
    const recent = Moment.utc().subtract(2, 'months').format('YYYY-MM-DD HH:mm')
    createPage({
      path: node.fields.slug,
      component: path.resolve(
        `src/templates/${String(node.frontmatter.templateKey)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
        now,
        recent,
        baseUrl: process.env.URL,
        getAddressApiKey: process.env.GET_ADDRESS_API_KEY,
        googleMapsApiKey: process.env.GOOGLE_MAPS_JAVASCRIPT_API_KEY,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      },
    })
  })

  // Event calendar pages
  let calendarPages = []
  // Iterate through each post, putting all found tags into `tags`
  pages.data.allMarkdownRemark.edges.forEach(({ node }) => {
    if (_.get(node, `frontmatter.calendarPage`)) {
      calendarPages = calendarPages.concat(node.frontmatter.calendarPage)
    }
  })

  calendarPages = _.uniq(calendarPages)

  calendarPages.forEach(month => {
    const thisMonthMoment = Moment.utc(month, 'YYYY-MM')
    const thisMonth = thisMonthMoment.format('YYYY-MM-DD HH:mm')
    const nextMonth = thisMonthMoment
      .clone()
      .add(1, 'month')
      .format('YYYY-MM-DD HH:mm')
    const calendarPagePath = `/events/${_.kebabCase(
      thisMonthMoment.format('MMMM-YYYY')
    )}`

    createPage({
      path: calendarPagePath,
      component: path.resolve(`src/templates/events-calendar.js`),
      context: {
        thisMonth: thisMonth,
        nextMonth: nextMonth,
      },
    })
  })
}

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = [
    `type MarkdownRemark implements Node { 
      frontmatter: Frontmatter 
    }`,
    `type Frontmatter {
      address: String
      championship: MarkdownRemark @link(by: "frontmatter.championshipKey", from: "championshipForeignKey") # championship for event
      championshipEvents: [MarkdownRemark!] @link(by: "frontmatter.championshipForeignKey", from: "championshipKey") # events for championship
      championshipKey: String
      championshipForeignKey: String
      competitionForeignKey: String
      competitionKey: String
      eventKey: String
      eventType: String
      forChampionshipKey: String
      forCompetitionKey: String
      forEventType: String
      forTerrain: String
      infoForChampionship: MarkdownRemark @link(by: "frontmatter.forChampionshipKey", from: "championshipForeignKey") # info for championship
      infoForCompetition: MarkdownRemark @link(by: "frontmatter.forCompetitionKey", from: "competitionForeignKey") # info for competition
      infoForEventType: MarkdownRemark @link(by: "frontmatter.forEventType", from: "eventType") # info for event type
      infoForTerrain: MarkdownRemark @link(by: "frontmatter.forTerrain", from: "terrain") # info for terraim
      location: String
      route: MarkdownRemark @link(by: "frontmatter.routeKey", from: "routeForeignKey") # route for event
      routeEvents: [MarkdownRemark!] @link(by: "frontmatter.routeForeignKey", from: "routeKey") # events for route
      routeForeignKey: String
      routeKey: String
      routeTrack: String
      session: MarkdownRemark @link(by: "frontmatter.sessionKey", from: "sessionForeignKey") # session for event
      sessionEvents: [MarkdownRemark!] @link(by: "frontmatter.sessionForeignKey", from: "sessionKey") # events for session
      sessionForeignKey: String
      sessionKey: String
      startsAt: Date @dateformat(formatString: "YYYY-MM-DD HH:mm")
      templateKey: String
      terrain: String
      title: String
      venue: MarkdownRemark @link(by: "frontmatter.venueKey", from: "venueForeignKey") # venue for event
      venueEvents: [MarkdownRemark!] @link(by: "frontmatter.venueForeignKey", from: "venueKey") # events for venue
      venueForeignKey: String
      venueKey: String
    }`,
  ]

  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  var value

  if (node.internal.type === `MarkdownRemark`) {
    value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  deletePage(page)
  // You can access the variable "house" in your page queries now
  createPage({
    ...page,
    context: {
      ...page.context,
      baseUrl: process.env.URL,
      getAddressApiKey: process.env.GET_ADDRESS_API_KEY,
      googleMapsApiKey: process.env.GOOGLE_MAPS_JAVASCRIPT_API_KEY,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  })
}
