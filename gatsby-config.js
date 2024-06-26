module.exports = {
  siteMetadata: {
    title: 'Manchester YMCA Harriers',
    description: 'A friendly running club based in Manchester city centre. Training on Tuesday and Thursday evenings. All abilities welcome!',
    siteUrl: process.env.URL,
    locale: 'en_GB',
    openGraphImage: {
      path: '/og-image.png',
      type: 'image/png',
      width: 1200,
      height: 630,
    },
    twitter: {
      site: '@ManYMCAHarriers',
    },
    apiKey: {
      getAddress: process.env.GET_ADDRESS_API_KEY,
      googleMaps: process.env.GOOGLE_MAPS_JAVASCRIPT_API_KEY,
      stripe: process.env.STRIPE_PUBLISHABLE_KEY,
    },
    social: {
      facebook: 'https://facebook.com/ManYMCAHarriers',
      instagram: 'https://instagram.com/ManYMCAHarriers',
      strava: 'https://strava.com/clubs/manyharrier',
      twitter: 'https://twitter.com/ManYMCAHarriers',
    },
    strava: {
      loginUrl: process.env.STRAVA_LOGIN_URL,
      clubUrl: process.env.STRAVA_CLUB_URL,
      accountEmail: process.env.STRAVA_EMAIL,
      accountPassword: process.env.STRAVA_PASSWORD,
    },
  },
  plugins: [
    'gatsby-plugin-sitemap',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-stripe',
    'gatsby-plugin-sass',
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/media`,
        name: 'media',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    {
      resolve: `gatsby-source-stripe`,
      options: {
        objects: ['Sku'],
        secretKey: process.env.STRIPE_SECRET_KEY,
        downloadFiles: true,
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'media',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 1152,
              linkImagesToOriginal: false,
              quality: 50,
              withWebP: {
                quality: 50,
              },
              wrapperStyle: fluidResult =>
                `border: 0.5em solid #272725; padding: 0.25em; ${
                  fluidResult.aspectRatio < 1
                    ? `height: 70vh; width: ` +
                      Math.round((fluidResult.aspectRatio * 70 * 100) / 100) +
                      `vh`
                    : ``
                };`,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: 'static',
            },
          },
        ],
      },
    },
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        tailwind: true,
      },
    },
    // must be after other CSS plugins
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
