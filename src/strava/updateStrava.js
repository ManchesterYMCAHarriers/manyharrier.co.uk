import * as Moment from "moment";

const puppeteer = require('puppeteer')

async function updateStrava({masterEvents}) {
  const stravaLoginUrl = process.env.STRAVA_LOGIN_URL
  const stravaClubUrl = process.env.STRAVA_CLUB_URL
  const stravaAccountEmail = process.env.STRAVA_EMAIL
  const stravaAccountPassword = process.env.STRAVA_PASSWORD

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Login to Strava
  await page.goto(stravaLoginUrl, {
    waitUntil: 'networkidle2'
  })
  await page.waitFor('#password')
  await page.type('#email', stravaAccountEmail)
  await page.type('#password', stravaAccountPassword)
  const [loginResponse] = await Promise.all([
    page.waitForNavigation({
      waitUntil: 'networkidle0'
    }),
    page.click('#login-button'),
  ]);
  if (!loginResponse.ok) {
    throw new Error(`Strava login failed: ${loginResponse.text}`)
  }

  // Go to Strava club page
  await page.goto(stravaClubUrl, {
    waitUntil: 'networkidle0'
  })

  // Loop through Strava club events
  const hrefs = await page.$$eval('#group-events > .group-event-snippets > li a.group-event-title', nodes => nodes.map(node => node.href))
  const stravaEvents = []
  for (const href of hrefs) {
    // Go to event
    const url = new URL(href, 'https://strava.com')
    await page.goto(url, {
      waitUntil: 'networkidle0'
    })

    // Get data from Strava club events
    const [title, date, month, time, address, description] = await Promise.all([
      await page.$eval('.group-event-container h1', node => node.innerText),
      await page.$eval('.group-event-container .date', node => node.innerText),
      await page.$eval('.group-event-container .month', node => node.innerText),
      await page.$eval('.group-event-container .group-event-time > strong', node => node.innerText),
      await page.$eval('.group-event-container .group-event-address > span:last-child', node => node.innerText),
      await page.$$eval('.group-event-container .group-event-details > div.spans13 > p', nodes => {
        return nodes.map(node => node.innerText).join("\n")
      }),
    ])

    // Parse Strava club events into a structured format
    const currentYear = new Date().getUTCFullYear()
    const currentMonth = new Date().getUTCMonth()
    const eventDay = parseInt(date.toString(), 10)
    const eventMonth = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(month.toUpperCase())
    const eventYear = (currentMonth > eventMonth) ? currentYear + 1 : currentYear
    const [eventHour, eventMinute] = time.replace(/\s[AP]M$/, '').split(':')
    stravaEvents.push({
      url: href,
      title,
      startsAt: Moment.utc(`${eventYear}-${eventMonth < 10 ? '0' : ''}${eventMonth}-${eventDay < 10 ? '0' : ''}${eventDay}T${eventHour < 10 ? '0' : ''}${eventHour}:${eventMinute}`),
      address,
      description
    })
  }

  const toCreate = []
  const toDelete = []

  // Create events that are in master and not on Strava
  masterEvents.forEach(masterEvent => {
    const existsOnStrava = stravaEvents.findIndex(stravaEvent => {
      return stravaEvent.title === masterEvent.title && stravaEvent.startsAt.isSame(masterEvent.startsAt) && stravaEvent.address === masterEvent.address && stravaEvent.description === masterEvent.url
    })

    if (existsOnStrava === -1) {
      toCreate.push(masterEvent)
    }
  })

  // Delete events that are on Strava and not in master
  stravaEvents.forEach(stravaEvent => {
    const existsInMaster = masterEvents.findIndex(masterEvent => {
      return stravaEvent.title === masterEvent.title && stravaEvent.startsAt.isSame(masterEvent.startsAt) && stravaEvent.address === masterEvent.address && stravaEvent.description === masterEvent.url
    })

    if (existsInMaster === -1) {
      toDelete.push(stravaEvent)
    }
  })

  // Create events on Strava
  for (const create of toCreate) {
    // Go to Strava club page
    await page.goto(stravaClubUrl, {
      waitUntil: 'networkidle0'
    })

    // Click "Add Club Event"
    await page.click('#club-event-js')

    // Wait for Save Club Event button to be visible
    await page.waitFor('#submit-event-js', {
      visible: true
    })

    // Set event title

    // Set address

    // Set description

    // Set date

    // Set time

    // Save
  }

  await browser.close()
}

module.exports = {updateStrava}
