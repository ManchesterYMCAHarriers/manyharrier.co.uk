import React from 'react'

import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import { H1, H2, H3 } from '../../components/Headings'
import { graphql, Link } from 'gatsby'
import * as Moment from 'moment'

const ChampionshipsIndex = ({ data }) => {
  const stripeSkus = data.allStripeSku.edges.map(({ node }) => {
    const {
      attributes: { name },
    } = node

    return name
  })

  const championships = data.allMarkdownRemark.edges.reduce(
    (acc, { node }) => {
      const {
        fields: { slug },
      } = node
      const {
        frontmatter: { championshipKey, championshipEvents },
      } = node

      const now = Moment.utc()
      let previous = 0
      let future = 0
      championshipEvents.forEach(({ frontmatter: { startsAt } }) =>
        Moment(startsAt, 'YYYY-MM-DD HH:mm')
          .utc()
          .isBefore(now)
          ? previous++
          : future++
      )

      let enterNow = false

      if (future > 0) {
        const stripeSkuMatch = slug.match(/^\/championships\/([A-z0-9-]+)\/?$/)
        if (stripeSkuMatch) {
          enterNow = stripeSkus.includes(stripeSkuMatch[1])
        }
      }

      const championship = {
        slug,
        championshipKey,
        eventsCompleted: previous,
        totalEvents: previous + future,
        enterNow: enterNow,
      }

      if (previous > 0 && future > 0) {
        acc.current.push(championship)
      } else if (previous > 0) {
        acc.previous.push(championship)
      } else if (future > 0) {
        acc.future.push(championship)
      }

      return acc
    },
    {
      current: [],
      future: [],
      previous: [],
    }
  )

  const { current, future, previous } = championships

  return (
    <Layout path={'/championships'}>
      <StandardContentContainer>
        <H1 title={'Championships'} />
        {current.length > 0 && (
          <>
            <H2 title={'In progress'} />
            {current.map(
              (
                {
                  slug,
                  championshipKey,
                  eventsCompleted,
                  totalEvents,
                  enterNow,
                },
                i
              ) => (
                <Link
                  to={slug}
                  key={`current-${i}`}
                  className="block border-b-2 border-gray-200 hover:border-red-400 focus:border-red-400 hover:bg-gray-200 focus:bg-gray-200 p-4"
                >
                  <H3 title={championshipKey} />
                  <p className="font-light">
                    {eventsCompleted} out of {totalEvents} races completed.
                  </p>
                  {enterNow && (
                    <p className="font-semibold">Entry still available!</p>
                  )}
                  <p className="text-right py-2">
                    <span className="border-b-2 border-red-400 py-2">
                      More info
                      <span className="ml-2 text-red-400">&rarr;</span>
                    </span>
                  </p>
                </Link>
              )
            )}
          </>
        )}
        {future.length > 0 && (
          <div className="mt-8">
            <H2 title={'Coming up'} />
            {future.map(({ slug, championshipKey, enterNow }, i) => (
              <Link
                to={slug}
                key={`future-${i}`}
                className="block border-b-2 border-gray-200 hover:border-red-400 focus:border-red-400 hover:bg-gray-200 focus:bg-gray-200 p-4"
              >
                <H3 title={championshipKey} />
                {enterNow && <p className="font-semibold">Enter now!</p>}
                <p className="text-right py-2">
                  <span className="border-b-2 border-red-400 py-2">
                    More info
                    <span className="ml-2 text-red-400">&rarr;</span>
                  </span>
                </p>
              </Link>
            ))}
          </div>
        )}
        {previous.length > 0 && (
          <div className="mt-8">
            <H2 title={'Past results'} />
            {future.map(({ slug, championshipKey }, i) => (
              <Link
                to={slug}
                key={`previous-${i}`}
                className="block border-b-2 border-gray-200 hover:border-red-400 focus:border-red-400 hover:bg-gray-200 focus:bg-gray-200 p-4"
              >
                <H3 title={championshipKey} />
                <p className="text-right py-2">
                  <span className="border-b-2 border-red-400 py-2">
                    More info
                    <span className="ml-2 text-red-400">&rarr;</span>
                  </span>
                </p>
              </Link>
            ))}
          </div>
        )}
      </StandardContentContainer>
    </Layout>
  )
}

export default ChampionshipsIndex

export const championshipsQuery = graphql`
  query championshipsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "championship" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            championshipKey
            championshipEvents {
              frontmatter {
                startsAt
              }
            }
          }
        }
      }
    }
    allStripeSku(
      filter: {
        product: { name: { eq: "championship" }, active: { eq: true } }
      }
    ) {
      edges {
        node {
          attributes {
            name
          }
        }
      }
    }
  }
`
