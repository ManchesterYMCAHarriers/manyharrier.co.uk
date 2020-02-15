const ical = require('ical-generator')
const Moment = require('moment-timezone')
const path = require('path')

const createCalendar = ({siteUrl, events}) => {
  const url = new URL('calendar.ics', siteUrl)

  const timezone = 'Europe/London'

  const cal = ical({
    domain: url.host,
    name: 'Manchester YMCA Harriers Events',
    prodId: {
      company: 'Manchester YMCA Harriers',
      product: 'Events',
    },
    scale: 'GREGORIAN',
    timezone,
    ttl: 60 * 60 * 24,
    url: url.toString(),
  })

  cal.events(events.map(({node}) => {
    const {
      fields: {
        slug: slug,
      },
      frontmatter: {
        cancelled,
        competitionForeignKey,
        eventKey,
        eventType,
        startsAt,
        venue: {
          frontmatter: {
            venueKey,
            address,
            location,
          }
        }
      }
    } = node

    let summary = ``
    if (cancelled) {
      summary += `**CANCELLED** `
    }
    summary += eventKey

    const start = Moment.tz(startsAt, timezone)

    const end = Moment.tz(startsAt, timezone)

    if (eventType === 'Marathon training') {
      end.add(3, 'hours')
    } else {
      end.add(1, 'hours').add(30, 'minutes')
    }

    const eventUrl = new URL(slug, siteUrl)

    let description = ``
    if (cancelled) {
      description += `THIS EVENT HAS BEEN CANCELLED`
    }
    description += `Manchester YMCA Harriers `

    if (competitionForeignKey) {
      description += `and ${competitionForeignKey} `
    }
    if (node.frontmatter.championship) {
      description += `${node.frontmatter.championship.frontmatter.championshipKey} `
    }
    if (eventType) {
      description += `${eventType.toLowerCase()} `
    } else {
      description += 'event '
    }
    description += `on ${start.format("Do MMMM YYYY")} at ${start.format("h:mma")} at ${node.frontmatter.venue.frontmatter.venueKey}` +
      "\n" +
      `More information at ${eventUrl.toString()}`

    let htmlDescription = ``
    if (cancelled) {
      htmlDescription += `<p><strong>THIS EVENT HAS BEEN CANCELLED</strong></p>`
    }
    htmlDescription += `<p>Manchester YMCA Harriers `
    if (competitionForeignKey) {
      description += `and ${competitionForeignKey} `
    }
    if (node.frontmatter.championship) {
      description += `${node.frontmatter.championship.frontmatter.championshipKey} `
    }
    if (eventType) {
      description += `${eventType.toLowerCase()} `
    } else {
      description += 'event '
    }
    description += `on ${start.format("Do MMMM YYYY")} at ${start.format("h:mma")} at ${node.frontmatter.venue.frontmatter.venueKey}</p>` +
      `<p>More information at <a href="${eventUrl.toString()}">${eventUrl.toString()}</a></p>"}`

    let geo = JSON.parse(location)

    return {
      uid: slug,
      start,
      end,
      timezone,
      summary,
      description,
      htmlDescription,
      location: [venueKey].concat(address.split("\n")).join(", "),
      geo: {
        lat: geo.coordinates[1],
        lon: geo.coordinates[0],
      },
      status: cancelled ? 'cancelled' : 'confirmed',
      url: eventUrl,
    }
  }))

  cal.save(path.join('./public', url.pathname), () => {
    console.log('iCal saved')
  })
}

module.exports = createCalendar
