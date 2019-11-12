import React from 'react'

import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import {graphql, Link} from 'gatsby'
import * as Moment from 'moment'
import Hero from "../../components/Hero";
import {Panel, PanelFullWidth, Panels} from "../../components/Panels";
import {Card, CardCTA} from "../../components/Card";
import {CallToActionText} from "../../components/CallToAction";

const ChampionshipsIndex = ({data}) => {
  const stripeSkus = data.allStripeSku.edges.map(({node}) => {
    const {
      attributes: {name},
    } = node

    return name
  })

  const championships = data.allMarkdownRemark.edges.reduce(
    (acc, {node}) => {
      const {
        fields: {slug},
      } = node
      const {
        frontmatter: {championshipKey, championshipEvents},
      } = node

      const now = Moment.utc()
      let previous = 0
      let future = 0
      championshipEvents.forEach(({frontmatter: {startsAt}}) =>
        Moment(startsAt, 'YYYY-MM-DD HH:mm')
          .utc()
          .isBefore(now)
          ? previous++
          : future++
      )

      let enterNow = false

      if (future > 0) {
        enterNow = stripeSkus.includes(championshipKey)
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

  const {current, future, previous} = championships

  const heroImage = data.file.childImageSharp.fluid

  return (
    <Layout path={'/championships'}>
      <StandardContentContainer>
        <Hero title={"Championships"} fluidImage={heroImage} />
        {current.length > 0 && (
          <Panels>
            <PanelFullWidth>
              <div className="panel black-bottom">
                <h2 className="heading-2 mb-4">In progress</h2>
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
                    <CardCTA
                      to={slug}
                      key={`current-${i}`}
                      title={championshipKey}
                      callToAction={<CallToActionText title={"More info"} />}
                      borderColorClassName={`border-gray-400`}
                      borderColorHoverClassName={`border-red-manyharrier`}
                    >
                      <p className="font-light">
                        {eventsCompleted} out of {totalEvents} races completed.
                      </p>
                      {enterNow && (
                        <p className="font-semibold">Entry still available!</p>
                      )}
                    </CardCTA>
                  )
                )}
              </div>
            </PanelFullWidth>
          </Panels>
        )}
        {future.length > 0 && (
          <Panels>
            <PanelFullWidth>
              <div className="panel black-bottom">
                <h2 className="heading-2">Coming up</h2>
                {future.map(({slug, championshipKey, enterNow}, i) => (
                  <CardCTA
                    to={slug}
                    key={`current-${i}`}
                    title={championshipKey}
                    callToAction={<CallToActionText title={"More info"} />}
                    borderColorClassName={`border-gray-400`}
                    borderColorHoverClassName={`border-red-manyharrier`}
                  >
                    {enterNow && (
                      <p className="font-semibold">Enter now!</p>
                    )}
                  </CardCTA>
                ))}
              </div>
            </PanelFullWidth>
          </Panels>
        )}
        <Panels>
          <Panel>
            <Card borderColorClassName={`border-black-manyharrier`}
                  title={"Cross country championship"}>
              <div className="content">
                <p>
                  Our cross country championship takes place each winter,
                  starting in October and finishing in February.
                </p>
                <p>
                  The championship normally consists of nine races; five from
                  the
                  Manchester Area Cross Country League and four from the South
                  East Lancs Cross Country League.
                </p>
                <p>
                  Participants need to complete any five of the nine races in
                  order
                  to qualify for the championship.
                </p>
              </div>
            </Card>
          </Panel>
          <Panel>
            <Card borderColorClassName={`border-red-manyharrier`}
                  title={"Summer championship"}>
              <div className="content">
                <p>
                  Our summer championship starts in May and finishes in October.
                </p>
                <p>
                  The championship consists of nine races; three road, three
                  trail
                  and three fell, with a short, medium and long distance race
                  from
                  each terrain.
                </p>
                <p>
                  Participants need to complete any five of the nine races in
                  order
                  to qualify for the championship. Those who qualify for the
                  Summer championship stand a better chance of being awarded our
                  club's <Link to={"/about/london-marathon-place"}>London
                  Marathon
                  place</Link>.
                </p>
              </div>
            </Card>
          </Panel>
        </Panels>
        {previous.length > 0 && (
          <Panels>
            <PanelFullWidth>
              <div className="panel red-bottom">
                <h2 className="heading-2">Past results</h2>
                {previous.map(({slug, championshipKey}, i) => (
                  <CardCTA
                    to={slug}
                    key={`current-${i}`}
                    title={championshipKey}
                    callToAction={<CallToActionText title={"More info"} />}
                    borderColorClassName={`border-gray-400`}
                    borderColorHoverClassName={`border-red-manyharrier`}
                  />
                ))}
              </div>
            </PanelFullWidth>
          </Panels>
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
        product: { name: { eq: "Championship" }, active: { eq: true } }
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
    file(relativePath: {eq: "championships-hero.jpg"}) {
      childImageSharp {
        ...HeroImage
      }
    }
  }
`
