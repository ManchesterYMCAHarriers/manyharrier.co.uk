const _ = require('lodash')
const path = require('path')
const {createFilePath} = require('gatsby-source-filesystem')
const {fmImagesToRelative} = require('gatsby-remark-relative-images')
const Moment = require('moment')

exports.createPages = async ({actions, graphql}) => {
  const {createPage} = actions

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
    }`)

  if (pages.errors) {
    pages.errors.forEach(e => console.error(e.toString()))
    return Promise.reject(result.errors)
  }

  pages.data.allMarkdownRemark.edges.forEach(({node}) => {
    const id = node.id
    const now = Moment.utc().format("YYYY-MM-DD HH:mm")
    createPage({
      path: node.fields.slug,
      component: path.resolve(
        `src/templates/${String(node.frontmatter.templateKey)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
        now
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
    const thisMonthMoment = Moment.utc(month, "YYYY-MM")
    const thisMonth = thisMonthMoment.format("YYYY-MM-DD HH:mm")
    const nextMonth = thisMonthMoment.clone().add(1, 'month').format("YYYY-MM-DD HH:mm")
    const calendarPagePath = `/events/${_.kebabCase(thisMonthMoment.format("MMMM-YYYY"))}`

    createPage({
      path: calendarPagePath,
      component: path.resolve(`src/templates/events-calendar.js`),
      context: {
        thisMonth: thisMonth,
        nextMonth: nextMonth
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
      competitionName: String
      eventType: String
      infoForChampionship: MarkdownRemark @link(by: "frontmatter.forChampionship", from: "championshipName") # info for championship
      infoForCompetition: MarkdownRemark @link(by: "frontmatter.forCompetition", from: "competitionName") # info for competition
      infoForEventType: MarkdownRemark @link(by: "frontmatter.forEventType", from: "eventType") # info for event type
      infoForTerrain: MarkdownRemark @link(by: "frontmatter.forTerrain", from: "terrain") # info for terraim
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
