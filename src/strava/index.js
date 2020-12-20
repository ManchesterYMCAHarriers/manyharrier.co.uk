const fs = require('fs')
const path = require('path')
const Moment = require('moment')
const puppeteer = require('puppeteer')

async function updateStrava({masterEvents, strava: {loginUrl, clubUrl, accountEmail, accountPassword}}) {
    let errOccurred = false

    const toCreate = []
    const toDelete = []

    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    // Set cookies to stop
    try {
        const cookies = fs.readFileSync(path.join(__dirname, 'cookies.json'), 'utf-8')
        const deserializedCookies = JSON.parse(cookies)
        await page.setCookie(...deserializedCookies)
        console.log(`Set cookie to accept cookies (!)`)
    } catch (err) {
        console.error(`Error setting cookies: ${err.message}`)
        errOccurred = true
    }

    if (!errOccurred) {
        try {
            // Login to Strava
            console.log(`Logging in to Strava`)
            await page.goto(loginUrl, {
                waitUntil: 'networkidle0'
            })
            await page.type('#email', accountEmail)
            await page.type('#password', accountPassword)

            const [loginResponse] = await Promise.all([
                page.waitForNavigation({
                    timeout: 60000,
                    waitUntil: 'networkidle0',
                }),
                page.click('#login-button'),
            ]);
            if (loginResponse.ok) {
                console.log("Login successful")
            } else {
                throw new Error(`Strava login failed: ${loginResponse.text}`)
            }
        } catch (err) {
            console.error(`Error logging in to Strava: ${err.message}`)
            errOccurred = true
        }
    }

    // Go to Strava club page
    if (!errOccurred) {
        try {
            await page.goto(clubUrl)

            // Loop through Strava club events
            const hrefs = await page.$$eval('#group-events > .group-event-snippets > li a.group-event-title', nodes => nodes.map(node => node.href))
            const stravaEvents = []
            console.log(`${hrefs.length} event(s) on Strava`)
            for (const href of hrefs) {
                // Go to event
                const url = new URL(href, 'https://strava.com')
                console.log(`Retrieving data for event at ${url}`)
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
                console.log(`Event time as retrieved from Strava is ${time}`)
                const [eventHour, eventMinute, amOrPm] = time.split(/:|\s/)
                let eventHourInt = parseInt(eventHour, 10)
                if (typeof amOrPm !== 'undefined') {
                    if (eventHourInt < 12 && amOrPm === "PM") {
                        eventHourInt += 12
                    } else if (eventHourInt === 12 && amOrPm === "AM") {
                        eventHourInt = 0
                    }
                }
                console.log(`Event time we're going to process is ${eventHourInt}:${eventMinute}`)
                const startsAt = Moment.utc().year(eventYear).month(eventMonth).date(eventDay).hour(eventHourInt).minute(parseInt(eventMinute, 10)).startOf('minute')
                console.log(`Event retrieved from ${url}: ${title}; ${startsAt.format('YYYY-MM-DD HH:mm')}; ${address}`)

                stravaEvents.push({
                    url,
                    title,
                    startsAt,
                    address,
                    description
                })
            }

            // Create events that are in master and not on Strava
            console.log(`Determining events to add to Strava`)
            masterEvents.forEach(masterEvent => {
                if (masterEvent.cancelled) {
                    // Skip events that are cancelled - these will be deleted on Strava
                    // if they exist
                    return
                }

                const existsOnStrava = stravaEvents.findIndex(stravaEvent => {
                    return stravaEvent.title === masterEvent.title && stravaEvent.startsAt.isSame(masterEvent.startsAt) && stravaEvent.address === masterEvent.address
                })

                if (existsOnStrava === -1) {
                    console.log(`Event ${masterEvent.title} on ${masterEvent.startsAt.format('YYYY-MM-DD HH:mm')} at ${masterEvent.address} does not exist on Strava - queued for creation`)
                    toCreate.push(masterEvent)
                } else {
                    console.log(`Event ${masterEvent.title} on ${masterEvent.startsAt.format('YYYY-MM-DD HH:mm')} at ${masterEvent.address} exists on Strava - ignoring`)
                }
            })

            // Delete events that are on Strava and not in master
            stravaEvents.forEach(stravaEvent => {
                const existsInMaster = masterEvents.findIndex(masterEvent => {
                    return stravaEvent.title === masterEvent.title && stravaEvent.startsAt.isSame(masterEvent.startsAt) && stravaEvent.address === masterEvent.address
                })

                if (existsInMaster === -1 || masterEvents[existsInMaster].cancelled) {
                    console.log(`Event ${stravaEvent.title} on ${stravaEvent.startsAt.format('YYYY-MM-DD HH:mm')} at ${stravaEvent.address} does not exist in Master - queued for deletion`)
                    toDelete.push(stravaEvent)
                } else {
                    console.log(`Event ${stravaEvent.title} on ${stravaEvent.startsAt.format('YYYY-MM-DD HH:mm')} at ${stravaEvent.address} exists in Master - ignoring`)
                }
            })
        } catch (err) {
            errOccurred = true
            console.error(`Cannot build list of events to create and delete: ${err.message}`)
        }
    }

    // Accept dialog prompts when deleting events
    page.on('dialog', async dialog => {
        console.log("Accept delete confirmation dialog")
        await dialog.accept()
    })

    let i = 0

    if (!errOccurred) {
        // Delete events on Strava
        console.log(`Deleting events...`)
        for (const {url} of toDelete) {
            try {
                console.log(`Deleting event ${url}...`)
                // Go to event page
                await page.goto(url, {
                    waitUntil: 'networkidle0'
                })

                // Wait for event on page
                await page.waitFor('.group-event-container', {
                    timeout: 10000,
                    visible: true,
                })

                // Click edit dropdown
                console.log(`Click edit dropdown...`)
                await page.click('.group-event-container .drop-down-menu.edit-drop-down.enabled')

                // Wait for delete option to be visible
                await page.waitFor('#delete-event-js', {
                    visible: true
                })

                // Click the delete button
                console.log(`Click delete button...`)

                // Wait for page to navigate away
                const [deleteEventResponse] = await Promise.all([
                    page.waitForNavigation({
                        waitUntil: 'networkidle0',
                        timeout: 10000,
                    }),
                    page.click('#delete-event-js'),
                ])
                if (deleteEventResponse.ok) {
                    console.log(`Event deleted!`)
                    i++
                } else {
                    throw new Error(`delete Strava event failed: ${deleteEventResponse.text}`)
                }
            } catch (err) {
                errOccurred = true
                console.error(`Error occurred deleting event at ${url}: ${err.message}`)
                break
            }
        }
        console.log(`${i} event(s) deleted!`)
    }

    // Create events on Strava
    if (!errOccurred) {
        i = 0
        console.log(`Creating ${toCreate.length} event(s)...`)
        for (let {title, startsAt, address, description, terrain, route} of toCreate) {
            try {
                console.log(`Creating event ${title} on ${startsAt.format('YYYY-MM-DD')} at ${startsAt.format('h:mm A')}...`)

                // Go to Strava club page
                await page.goto(clubUrl, {
                    waitUntil: 'networkidle0'
                })

                console.log("Now on Strava Club page")
                // Click "Add Club Event"
                await page.click('#club-event-js')

                console.log("Populating event...")
                // Wait for Save Club Event button in the form to be visible
                await page.waitFor('#submit-event-js', {
                    timeout: 10000,
                    visible: true,
                })

                console.log("Setting event title...")
                // Set event title
                await page.type('#title', title)

                console.log("Setting address...")
                // Set address
                await page.type('#address', address)

                console.log("Setting description...")
                // Set description
                await page.type('#description', description)

                console.log("Setting date...")
                // Set date
                await page.click('#start_date')
                await page.waitFor('#ui-datepicker-div', {
                    timeout: 5000,
                    visible: true,
                })
                let yearValue = await page.$eval('#ui-datepicker-div .ui-datepicker-title .ui-datepicker-year', node => node.innerText)
                let monthValue = await page.$eval('#ui-datepicker-div .ui-datepicker-title .ui-datepicker-month', node => node.innerText.toUpperCase())

                console.log(`Datepicker currently on ${monthValue} ${yearValue} - want ${startsAt.format('MMMM YYYY').toUpperCase()}`)
                // All events should be in the present month or in the future
                while (yearValue !== startsAt.format('YYYY') || monthValue !== startsAt.format('MMMM').toUpperCase()) {
                    console.log("Navigate to next datepicker month")
                    await Promise.all([
                        page.waitForFunction(month => document.querySelector("#ui-datepicker-div .ui-datepicker-title .ui-datepicker-month").innerText !== month, {
                            timeout: 5000,
                        }, monthValue),
                        page.click('#ui-datepicker-div .ui-datepicker-header a.ui-datepicker-next')
                    ]);
                    yearValue = await page.$eval('#ui-datepicker-div .ui-datepicker-title .ui-datepicker-year', node => node.innerText)
                    monthValue = await page.$eval('#ui-datepicker-div .ui-datepicker-title .ui-datepicker-month', node => node.innerText.toUpperCase())
                    console.log(`Datepicker now on ${monthValue} ${yearValue} - want ${startsAt.format('MMMM YYYY').toUpperCase()}`)
                }

                // Click matching date
                console.log(`Select day ${startsAt.format('D')} on datepicker...`)
                await page.$$eval('#ui-datepicker-div .ui-datepicker-calendar tbody a', async (anchors, day) => {
                    for (const anchor of anchors) {
                        if (anchor.innerText === day) {
                            await anchor.click();
                            break
                        }
                    }
                }, startsAt.format('D'))

                // Set time
                console.log("Setting time...")
                // Clear time first
                await page.click('#start_time', {clickCount: 3})
                await page.keyboard.press('Backspace')
                // Now set the time
                await page.type('#start_time', startsAt.format('h:mm A'))

                // Set organiser
                console.log("Setting organizer...")
                const organizerDropdown = await page.$x("//label[text()='Organizer']/following-sibling::div")
                await organizerDropdown[0].click()
                await page.waitFor('.drop-down-block.drop-down-menu.active > ul.options.open-menu', {
                    timeout: 5000,
                    visible: true,
                })
                if (terrain !== 'Road' && terrain !== 'Trail') {
                    terrain = 'Mixed'
                }
                await page.$$eval('.drop-down-block.drop-down-menu.active > ul.options.open-menu a', async (anchors) => {
                    for (const anchor of anchors) {
                        if (anchor.innerText === 'None') {
                            await anchor.click();
                            break
                        }
                    }
                })

                // Set terrain
                console.log("Setting terrain...")
                await page.click('label[for="terrain"] + .drop-down-block.drop-down-menu')
                await page.waitFor('label[for="terrain"] + .drop-down-block.drop-down-menu.active > ul.options.open-menu', {
                    timeout: 5000,
                    visible: true,
                })
                if (terrain === 'Track') {
                    terrain = 'Road'
                } else if (terrain !== 'Road' && terrain !== 'Trail') {
                    terrain = 'Mixed'
                }
                await page.$$eval('label[for="terrain"] + .drop-down-block.drop-down-menu.active > ul.options.open-menu a', async (anchors, terrain) => {
                    for (const anchor of anchors) {
                        if (anchor.innerText === terrain) {
                            await anchor.click();
                            break
                        }
                    }
                }, terrain)

                // Set route
                if (route) {
                    console.log("Setting route...")
                    await page.click('label[for="route_id"] + .drop-down-block.drop-down-menu')
                    await page.waitFor('label[for="route_id"] + .drop-down-block.drop-down-menu.active > ul.options.open-menu', {
                        timeout: 5000,
                        visible: true,
                    })
                    await page.$$eval('label[for="route_id"] + .drop-down-block.drop-down-menu.active > ul.options.open-menu a', async (anchors, route) => {
                        let routeClicked = false
                        for (const anchor of anchors) {
                            if (anchor.innerText === route) {
                                await anchor.click();
                                routeClicked = true
                                break
                            }
                        }
                        if (!routeClicked) {
                            await anchors[0].click()
                        }
                    }, route)
                }
            } catch (err) {
                console.error(`Error creating event ${title} on ${startsAt.format('YYYY-MM-DD HH:mm')}: ${err.message}`)
                break
            }

            // Save
            console.log("Saving event...")
            try {
                await page.waitFor(500)
                const [createEventResponse] = await Promise.all([
                    page.waitForNavigation({
                        timeout: 10000,
                        waitUntil: 'networkidle0',
                    }),
                    page.click('#submit-event-js'),
                ]);
                if (createEventResponse.ok) {
                    console.log(`Event created!`)
                    i++
                }
                // Toggle for testing
                // await page.click('#cancel-event-js')
            } catch (err) {
                console.error(`Create event request timed out: ${err.message} (probably because of 429 too many requests error)`)
                errOccurred = true
                break
            }
        }
        console.log(`${i} events created!`)
    }

    await browser.close()
}

module.exports = updateStrava
