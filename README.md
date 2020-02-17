# manyharrier.co.uk

[![Netlify Status](https://api.netlify.com/api/v1/badges/b06dbe2a-da15-435e-a03c-5ac030dd3433/deploy-status)](https://app.netlify.com/sites/manyharrier-alpha/deploys)

This is the source for the Manchester YMCA Harriers website at 
[manyharrier.co.uk](https://manyharrier.co.uk)

## Architecture
The website is built on [Gatsby](https://gatsbyjs.org) and hosted on 
[Netlify](https://netlify.com). Gatsby is a static site generator, which means 
that everything on the site is generated through a build process and then served 
by Netlify static files.

This approach has resulted in a number of benefits for us:

### Pages are served very fast to visitors
Static content can be served much more quickly than content which needs to be 
generated dynamically. For example, in order to produce the standings on each 
of our club championship pages ([here's an example](https://manyharrier.co.uk/championships/2019-20-cross-country-championship/)),
the site needs to:

1) Determine which races are in the championship;
1) Retrieve the results for each of those races;
1) Retrieve information about each runner in each of those races;
1) Calculate the standings based on those results; and
1) Render the information in a way that can be displayed in a web browser.

A dynamic website would need to do all this work every time that someone visited 
the page, whereas a static site generator does this work in advance and stores 
the result in a static file that is then served to the visitor. In non-tech
terms, it's a bit like having a party and ordering a pizza delivery when your
guests arrive, versus having a pizza ready-baked in the oven!

Netlify has a content delivery network (CDN), which means that our site is
hosted on lots of servers around the globe. Whenever you visit manyharrier.co.uk,
it will be served to you from a location that is near to you, which means 
browsing the site will be that much quicker! (Admittedly, a running club in
Manchester city centre isn't exactly a global concern, but it all comes as 
standard with Netlify!)

### It's more secure
Since static websites have no back-end server-side processing, securing the
website is much simpler. Threats such as SQL injection attacks aren't possible,
because the site isn't connecting to any databases when it serves its content.

### Lower maintenance and lower costs
Netlify offer a "starter" package which is free; it is perfectly sufficient for
our levels of usage. Netlify take care of keeping the servers running, secure, 
connected, _et cetera_, which is something that we've had to take care of 
ourselves in the past.

### Everything is backed up by default
Every page on manyharrier.co.uk is sourced from the code in this repository - 
we don't need to worry about backing up a databases for a content management
system like we have in the past.

---

So, what are the disadvantages of this approach? 

For us, the main disadvantage currently is the lack of a user interface to 
manage content. (Though this can be remedied by getting 
[NetlifyCMS](https://www.netlifycms.org/) working!) We need to create and
edit content in raw markdown files and commit them to the Git repository,
which is probably a bit beyond non-technical users.

The only other disadvantage is that any change to the site's content requires a
complete rebuild of the site in order for it to be published, which takes a 
couple of minutes to complete. (On a dynamic website, content changes would be 
published immediately.) Nothing we publish on our site is urgent enough that
it can't wait five minutes to see the world!

## Triggering a build
The site is rebuilt and redeployed on Netlify each time a code change is pushed
to the "master" branch in the repository on GitHub. However, we don't want
events that have already taken place to show on our home page. To tackle this
problem, we have used [GitHub Actions](https://github.com/features/actions) to
trigger a build every night just after midnight, and also to trigger a build at
times shortly after our club events regularly take place.

## Collecting data and taking payments
Our [join form](https://manyharrier.co.uk/join/form) and our shopping cart
checkout process utilises [Netlify forms](https://www.netlify.com/products/forms/)
to store and process the submitted data. We use [Netlify functions](https://www.netlify.com/products/functions/)
to process these forms further; for example to notify the relevant people at 
the Club by email when someone joins or makes a purchase. (We use 
[Mailgun](https://mailgun.com) for our transactional emails - again, their free
usage tier is totally sufficient for our needs.)

The join form uses the [getaddress.io API](https://getaddress.io) in order to
look up addresses using people's postcodes. (Unlike everything else so far, this
service actually costs a small amount of money!)

For taking payments, we offer the option of paying by BACS transfer, or paying 
by debit or credit card using [Stripe Checkout](https://stripe.com/payments/checkout).
(We had previously used Shopify Lite for our checkout process, but the 
monthly subscription charge was uneconomic for the volume of transactions we
were doing and the lack of an API meant that we couldn't properly integrate it
into our site; e.g. in our join process, we ask people for their name, address 
and email - then Shopify asks for this information again.)

## Strava
The main motivator for re-developing this website is because [Strava](https://strava.com)
changed the way of authenticating against their API. We used to use Strava as 
our "source of truth" for our club events; we would list our events on our 
[Strava club page](https://strava.com/clubs/manyharrier), then our website would 
consume these events from Strava. (Indeed, the Strava group events API we used
is [no longer included in the Strava API documentation](https://developers.strava.com/docs/reference/#api-Clubs)
- has it gone?)

A lot of our members use Strava and they have grown used to being notified about
[our events](https://manyharrier.co.uk/events/) through the Strava App. It is
important to us that we continue to list our events on Strava, however it is
pretty burdensome to have to manually maintain this information in two places -
and Strava do not appear to offer an API for this purpose. 

Our solution to this problem has been to automate the process of updating our 
Strava club events using [Puppeteer](https://pptr.dev). Puppeteer is a tool 
which you can use to control the Chromium web browser through code; e.g. 
navigating to pages, filling in forms, clicking on links and buttons, etc. So, 
Strava is now kept up-to-date with any new, changed or removed events using the 
data in this repository as the "source of truth". Strava will get updated each
time the site is built during "working hours". (We don't want to ping a load of
notifications to our members in the middle of the night!)
