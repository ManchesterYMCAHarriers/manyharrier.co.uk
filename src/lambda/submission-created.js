const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
})
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const mailchimpApiKey = process.env.MAILCHIMP_API_KEY
const mailchimpSubscribeURL = process.env.MAILCHIMP_SUBSCRIBE_URL
const fetch = require('node-fetch').default
const crypto = require('crypto')
const promiseRetry = require('promise-retry')

const recipientCheckout = process.env.RECIPIENT_CHECKOUT
const recipientJoin = process.env.RECIPIENT_JOIN
const recipientContact = process.env.RECIPIENT_CONTACT
const mailFrom = process.env.MAIL_FROM

const lineCharLength = 72

const retryOpts = {
    retries: 5,
    minTimeout: 100,
    maxTimeout: 1000
}

exports.handler = async ({body}) => {
    const {form_name, data} = JSON.parse(body).payload

    // Join form
    if (form_name === 'join') {
        await processJoinOrRenewalForm('join', data)
        return {
            statusCode: 200,
        }
    }

    // Renewal form
    if (form_name === 'renew') {
        await processJoinOrRenewalForm('renew', data)
        return {
            statusCode: 200,
        }
    }

    // Contact form
    if (form_name === 'contact') {
        await processContactForm(data)
        return {
            statusCode: 200,
        }
    }

    // Cart checkout
    if (form_name === 'checkout') {
        await processCheckout(data)
        return {
            statusCode: 200,
        }
    }

    throw new Error(`Unhandled form submission for ${form_name}`)
}

async function processJoinOrRenewalForm(action, body) {
    // Get data for Stripe SKU
    const membership = await getStripeSku(body.membership)

    // Create email body
    const message = `Hello!
  
${
        action === `join`
            ? `A new member has joined the club!`
            : `We've had a membership renewal!`
    }

PERSONAL DETAILS
================

First name:       ${body.firstName}
Last name:        ${body.lastName}
Date of birth:    ${body.dateOfBirth}
Gender:           ${body.gender}

CONTACT INFO
============
Address:          ${body.addressLine1}
                  ${body.addressLine2}
                  ${body.addressLine3}
                  ${body.addressLine4}
                  ${body.addressLocality}
                  ${body.addressTown}
                  ${body.addressCounty}
                  ${body.postcode}
                
Telephone:        ${body.telephone !== '' ? body.telephone : 'Not provided'}
Email:            ${body.email.toLowerCase()}

SUBSCRIPTIONS
=============
Newsletter:       ${body.newsletter}
WhatsApp:         ${body.telephone !== '' ? body.whatsApp : 'No'}

EMERGENCY CONTACT
=================
Name:             ${
        body.emergencyContactName !== ''
            ? body.emergencyContactName
            : 'Not provided'
    }
Telephone:        ${
        body.emergencyContactNumber !== ''
            ? body.emergencyContactNumber
            : 'Not provided'
    }

MEMBERSHIP INFO
===============
Claim:            ${membership.attributes.claim}
First claim club: ${
        membership.attributes.claim === 'First'
            ? 'Manchester YMCA Harriers'
            : body.firstClaimClub
    }
Valid until:      ${membership.attributes.valid_to}

Y CLUB MEMBERSHIP
=================
Y Club member:    ${body.yClubMembership}

DECLARATIONS
============
Accepted:         Yes

PAYMENT
=======
Amount due:       ${toCurrency(membership.price)}
Payment method:   ${body.paymentMethod}

Thanks!
`

    // Send to recipients
    await sendMessageWithMailgun({
        to: `${recipientJoin}`,
        subject: `${
            action === 'join' ? 'New' : 'Renewal for'
        } ${membership.attributes.claim.toLowerCase()}-claim member: ${
            body.firstName
        } ${body.lastName}`,
        body: message
    })

    // Sign-up for Newsletter (if opted in)
    if (body.newsletter.toLowerCase() === 'yes') {
        await subscribeToMailingList(body.email, body.firstName, body.lastName)
    } else {
        await unsubscribeFromMailingList(body.email)
    }
}

async function processContactForm(body) {
    // Create email body
    const message = `Hello!

We have received a message through the website:

DETAILS
=======

Name:               ${body.name}
Email address:      ${body.email}
Reason for message: ${body.reason}

MESSAGE
=======

${body.message}
`
    await sendMessageWithMailgun({
        to: `${recipientContact}`,
        subject: body.reason,
        body: message,
        replyTo: body.email
    })
}

async function processCheckout(body) {
    // Get data for Stripe SKUs
    let total = 0

    const items = []

    const submittedItems = JSON.parse(body.items)

    for (let item of submittedItems) {
        const stripeSku = await getStripeSku(item.sku)
        item.price = stripeSku.price
        total += item.price * item.quantity
        const line = `${item.quantity} x ${item.description} @ ${toCurrency(
            item.price
        )}`
        item.category = stripeSku.attributes.category
        const subtotal = `${toCurrency(item.quantity * item.price)}`
        const spaces = lineCharLength - (line.length + subtotal.length)
        items.push({
            sortKey: item.description,
            category: item.category,
            line: `${line}${' '.repeat(Math.max(spaces, 1))}${subtotal}`,
        })
    }

    items.sort((a, b) => {
        return a.sortKey < b.sortKey ? -1 : 1
    })

    total = `Total: ${toCurrency(total)}`
    const totalLine = ' '.repeat(lineCharLength - total.length) + total

    // Create email body for whole order
    let message = `Hello!
  
An order has been placed through the website:

CUSTOMER DETAILS
================

First name:       ${body.firstName}
Last name:        ${body.lastName}
Email:            ${body.email}

ORDER
=====
`

    items.forEach(({line}) => {
        message += line + '\n'
    })

    message += `${'-'.repeat(lineCharLength)}` + '\n'
    message += `${totalLine}` + '\n'
    message += `${'-'.repeat(lineCharLength)}` + '\n'

    message += `

Payment method: ${body.paymentMethod}

Thanks!
`
    await sendMessageWithMailgun({
        to: `${recipientCheckout}`,
        subject: `Order received from ${body.firstName} ${body.lastName}`,
        body: message
    })
}

async function sendMessageWithMailgun({to, subject, body, replyTo}) {
    let data = {
        to: to instanceof Array ? to.join(',') : to,
        from: mailFrom,
        subject: subject,
        text: body,
    }

    if (replyTo) {
        data["h:Reply-To"] = replyTo
    }

    return promiseRetry((retry) => {
        return mailgun.messages().send(data)
            .catch(retry)
    }, retryOpts)
}

async function getStripeSku(id) {
    return promiseRetry((retry) => {
        return getStripeSkuPromise(id)
            .catch(retry)
    }, retryOpts)
}

async function getStripeSkuPromise(id) {
    return new Promise((resolve, reject) => {
        stripe.skus.retrieve(id, (err, sku) => {
            if (err) {
                reject(err)
                return
            }
            resolve(sku)
        })
    })
}

async function subscribeToMailingList(email, firstName, lastName) {
    const emailHash = crypto
        .createHash('md5')
        .update(email.toLowerCase())
        .digest('hex')

    const isAlreadySubscribed = await fetch(mailchimpSubscribeURL + emailHash, {
        headers: {
            Authorization: `Basic ${Buffer.from('user:' + mailchimpApiKey).toString(
                'base64'
            )}`,
        },
    })

    if (isAlreadySubscribed.ok) {
        return
    }

    if (isAlreadySubscribed.status !== 404) {
        throw new Error(
            `error checking isAlreadySubscribed: response from Mailchimp API was ${isAlreadySubscribed.status}: ${isAlreadySubscribed.body}`
        )
    }

    const data = {
        email_address: email.toLowerCase(),
        status: 'pending',
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
        },
    }

    const createSubscription = await fetch(mailchimpSubscribeURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            Authorization: `Basic ${Buffer.from('user:' + mailchimpApiKey).toString(
                'base64'
            )}`,
            'Content-Type': 'application/json',
        },
    })

    if (!createSubscription.ok) {
        throw new Error(
            `error creating subscription: response from Mailchimp API was ${createSubscription.status}: ${createSubscription.body}`
        )
    }
}

async function unsubscribeFromMailingList(email) {
    const emailHash = crypto
        .createHash('md5')
        .update(email.toLowerCase())
        .digest('hex')

    const isSubscribed = await fetch(mailchimpSubscribeURL + emailHash, {
        headers: {
            Authorization: `Basic ${Buffer.from('user:' + mailchimpApiKey).toString(
                'base64'
            )}`,
        },
    })

    if (!isSubscribed.ok) {
        if (isSubscribed.status !== 404) {
            return
        }
        `error checking isSubscribed: response from Mailchimp API was ${isSubscribed.status}: ${isSubscribed.body}`
    }

    const data = {
        status: 'unsubscribed',
    }

    const unsubscribe = await fetch(mailchimpSubscribeURL + emailHash, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            Authorization: `Basic ${Buffer.from('user:' + mailchimpApiKey).toString(
                'base64'
            )}`,
            'Content-Type': 'application/json',
        },
    })

    if (!unsubscribe.ok) {
        throw new Error(
            `cannot unsubscribe ${email}: response from Mailchimp API was ${unsubscribe.status}: ${unsubscribe.body}`
        )
    }
}

function toCurrency(val) {
    return '£' + (parseInt(val, 10) / 100).toFixed(2)
}
