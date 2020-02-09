import React from 'react'
import * as PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Moment from 'moment'
import Layout from '../components/Layout'
import EventBox from '../components/EventBox'
import StandardContentContainer from '../components/StandardContentContainer'
import Form from '../components/Form'
import FieldsetMulti from '../components/FieldsetMulti'
import InputText from '../components/InputText'
import {
  AddToCart,
  GetSkuItems,
  RemoveFromCart,
  StorageAvailable,
} from '../components/Cart'
import Currency from '../components/Currency'
import Hero from '../components/Hero'
import { PanelFullWidth, Panels } from '../components/Panels'
import {
  CallToActionBackButton,
} from '../components/CallToAction'
import Overall from '../standings/overall'
import OverallStandings from "../components/OverallStandings";

export class ChampionshipTemplate extends React.Component {
  constructor(props) {
    super(props)

    const storageAvailable = StorageAvailable('sessionStorage')

    const items =
      storageAvailable && props.stripeSku ? GetSkuItems(props.stripeSku.id) : []

    this.state = {
      backValue: 'Add another',
      cart: {
        items: items,
      },
      stage: items.length > 0 ? 2 : 1,
      stages: 2,
      storageAvailable: storageAvailable,
      submitValue: items.length > 0 ? 'Checkout' : 'Enter',
      validationIssues: [],
    }
  }

  backHandler = ev => {
    ev.preventDefault()
    this.setState({
      stage: 1,
      submitValue: 'Enter',
    })
  }

  submitHandler = ev => {
    ev.preventDefault()
    // Check if visible elements validate
    let data = {}
    ev.target
      .querySelector('fieldset:not(.hidden)')
      .querySelectorAll('input')
      .forEach(input => {
        if (input.checkValidity()) {
          data[input.getAttribute('name')] = input.value
        }
      })

    // If validation fails, don't continue
    if (this.state.validationIssues.length > 0) {
      return
    }

    let nextStage = this.state.stage + 1

    this.setState(
      {
        stage: nextStage,
        submitValue: 'Checkout',
      },
      () => {
        if (this.state.stage === 2) {
          // Add to cart
          AddToCart({
            id:
              this.props.stripeSku.name +
              '_' +
              data.firstName +
              '_' +
              data.lastName,
            sku: this.props.stripeSku.id,
            maxQuantity: 1,
            quantity: 1,
            price: this.props.stripeSku.price,
            description: `${this.props.title} entry for ${data.firstName} ${data.lastName}`,
            firstName: data.firstName,
            lastName: data.lastName,
          })

          this.setState(
            {
              cart: {
                items: GetSkuItems(this.props.stripeSku.id),
              },
            },
            () => {
              // Reset form fields for adding additional entries
              ev.target.reset()

              // Scroll to page title
              document.querySelector('form#enter-championship').scrollIntoView()
              // Set focus on first visible input
              const firstVisibleInput = ev.target
                .querySelector('fieldset:not(.hidden)')
                .querySelector('button[type="submit"]')
              if (firstVisibleInput) {
                firstVisibleInput.focus({
                  preventScroll: true,
                })
              }
            }
          )
        }
        // ...or proceed to checkout
        else {
          window.location.href = '/checkout'
        }
      }
    )
  }

  removeItem = ev => {
    RemoveFromCart({
      id: ev.currentTarget.id,
      quantity: 1,
    })

    this.setState(
      {
        cart: {
          items: GetSkuItems(this.props.stripeSku.id),
        },
      },
      () => {
        if (this.state.cart.items.length === 0) {
          this.setState({
            stage: 1,
          })
        }
      }
    )
  }

  updateValidationIssues = ({ id, message }) => {
    const validationIssues = this.state.validationIssues
    for (let i = 0; i < validationIssues.length; i++) {
      if (validationIssues[i].id === id) {
        if (!message) {
          validationIssues.splice(i, 1)
          this.setState({
            validationIssues: validationIssues,
          })
          return
        }

        validationIssues[i].message = message
        this.setState({
          validationIssues: validationIssues,
        })
        return
      }
    }

    if (message) {
      validationIssues.push({
        id: id,
        message: message,
      })
    }

    this.setState({
      validationIssues: validationIssues,
    })
  }

  render() {
    const {
      events,
      title,
      heroImage,
      intro,
      information,
      overallStandings,
      standingsType,
      stripeSku,
    } = this.props
    let hint = ``
    const now = Moment.utc()
    const remainingEvents = events.filter(({ startsAt }) =>
      startsAt.isAfter(now)
    )
    if (stripeSku) {
      if (remainingEvents.length < events.length) {
        hint = `Enter the remaining ${
          remainingEvents.length !== 1 ? remainingEvents.length : ''
        } race${
          remainingEvents.length === 1 ? '' : 's'
        } in the ${title} for ${Currency(stripeSku.price)}`
      } else {
        hint = `Enter all ${events.length} races in the ${title} for ${Currency(
          stripeSku.price
        )}`
      }
    }

    return (
      <StandardContentContainer>
        {heroImage ? (
          <Hero fluidImage={heroImage} title={title} />
        ) : (
          <h1 className="heading-1">{title}</h1>
        )}
        <Panels>
          <PanelFullWidth>
            <div className="content panel red-bottom">
              <div dangerouslySetInnerHTML={{ __html: intro }} />
            </div>
          </PanelFullWidth>
        </Panels>
        {information && (
          <Panels>
            <PanelFullWidth>
              <div
                className="content panel black-bottom"
                dangerouslySetInnerHTML={{ __html: information }}
              />
            </PanelFullWidth>
          </Panels>
        )}
        {stripeSku && this.state.storageAvailable && (
          <Panels>
            <PanelFullWidth>
              <div className="panel red-bottom">
                <h2 className="heading-2 mb-4">Championship entry</h2>
                <Form
                  backHandler={this.backHandler}
                  backHighlighted={'+'}
                  backValue={this.state.backValue}
                  formId={'enter-championship'}
                  method={'POST'}
                  netlify={false}
                  showBack={this.state.stage > 1}
                  showSubmit={true}
                  submitHandler={this.submitHandler}
                  submitValue={this.state.submitValue}
                >
                  <FieldsetMulti
                    legend={`Enter now for ${Currency(stripeSku.price)}`}
                    hint={hint}
                    validationIssues={this.state.validationIssues}
                    visible={this.state.stage === 1}
                  >
                    <InputText
                      inputId={'firstName'}
                      inputSizes={'w-full md:w-1/2'}
                      inputType={'text'}
                      inputAttributes={{ required: true }}
                      setFormValidationState={this.updateValidationIssues}
                      validationMessages={{
                        valueMissing: 'Enter your first name',
                      }}
                      label={'First name'}
                    />
                    <InputText
                      inputId={'lastName'}
                      inputSizes={'w-full md:w-1/2'}
                      inputType={'text'}
                      inputAttributes={{ required: true }}
                      setFormValidationState={this.updateValidationIssues}
                      validationMessages={{
                        valueMissing: 'Enter your last name',
                      }}
                      label={'Last name'}
                    />
                  </FieldsetMulti>
                  <FieldsetMulti
                    legend={`Check your details`}
                    validationIssues={this.state.validationIssues}
                    visible={this.state.stage === 2}
                  >
                    {this.state.cart.items.map(item => (
                      <div
                        key={'subcheckout-' + item.id}
                        className="flex flex-wrap md:flex-no-wrap justify-around items-center pb-2 mb-2 border-b border-gray-400"
                      >
                        <p className="w-full md:w-auto mb-2 flex-shrink flex-grow">
                          {item.description}
                        </p>
                        <p className="mb-2 flex-shrink-0 flex-grow-0 mx-4">
                          {Currency(stripeSku.price)}
                        </p>
                        <div className="flex-shrink-0 flex-grow-0">
                          <CallToActionBackButton
                            type="button"
                            id={item.id}
                            onClick={this.removeItem}
                            title={'Remove'}
                            highlighted={'-'}
                          />
                        </div>
                      </div>
                    ))}
                  </FieldsetMulti>
                </Form>
              </div>
            </PanelFullWidth>
          </Panels>
        )}
        {overallStandings && (
          <Panels>
            <PanelFullWidth>
              <div className="panel red-bottom">
                <h2 className="heading-2 mb-4">Overall Standings</h2>
                {standingsType === "Gendered" && (
                  <div className="flex flex-wrap md:flex-no-wrap md:-ml-4 md:mb-8">
                    <OverallStandings key={"overall-standings-men"} title={"Men"} standings={overallStandings.men} />
                    <OverallStandings key={"overall-standings-women"} title={"Women"} standings={overallStandings.women} />
                  </div>
                )}
              </div>
            </PanelFullWidth>
          </Panels>
        )}
        <Panels>
          <PanelFullWidth>
            <div className="panel black-bottom">
              <h2 className="heading-2 mb-4">Fixtures</h2>
              {events.map(({ startsAt, slug, title, venue }, i) => (
                <EventBox
                  key={'championship-event-' + i}
                  startsAt={startsAt}
                  slug={slug}
                  title={title}
                  venue={venue}
                />
              ))}
            </div>
          </PanelFullWidth>
        </Panels>
      </StandardContentContainer>
    )
  }
}

ChampionshipTemplate.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      startsAt: PropTypes.instanceOf(Moment).isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      venue: PropTypes.string.isRequired,
    })
  ),
  information: PropTypes.node,
  stripeSku: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }),
  title: PropTypes.string.isRequired,
  heroImage: PropTypes.object,
  intro: PropTypes.node.isRequired,
}

const Championship = ({ data }) => {
  const {
    stripeSku,
    markdownRemark: championship,
    member: {
      allMember: {
        data: members,
      }
    },
  } = data

  let eventsWithResults = 0

  const events = (championship.frontmatter.championshipEvents || [])
    .map(event => {
      let results

      if (event.frontmatter.results) {
        eventsWithResults++
        if (!event.frontmatter.resultsType) {
          throw new Error("No resultsType specified")
        }

        if (event.frontmatter.resultsType === "Gendered") {
          results = {
            men: [],
            women: [],
          }

          event.frontmatter.results.forEach(({urn, time}) => {
            const runner = members.find(member => {
              return member.urn === urn
            })

            if (!runner) {
              throw new Error(`Member for URN ${urn} not found`)
            }

            const {gender} = runner

            const result = {
              urn: urn,
              time: time,
            }

            if (gender === "F") {
              results.women.push(result)
            } else {
              results.men.push(result)
            }
          })
        }
      }

      return {
        results: results,
        startsAt: Moment.utc(event.frontmatter.startsAt),
        slug: event.fields.slug,
        title: event.frontmatter.eventKey,
        venue: event.frontmatter.venue.frontmatter.venueKey,
      }
    })
    .sort((a, b) => {
      if (a.startsAt.isSame(b.startsAt)) {
        return a.title < b.title ? -1 : 1
      }
      return a.startsAt.isBefore(b.startsAt) ? -1 : 1
    })

  let stripeSkuData
  if (stripeSku) {
    stripeSkuData = {
      id: stripeSku.id,
      name: stripeSku.attributes.name,
      price: stripeSku.price,
    }
  }

  const heroImage = championship.frontmatter.heroImage
    ? championship.frontmatter.heroImage.childImageSharp.fluid
    : null

  let overallStandings
  if (eventsWithResults > 0) {
    overallStandings = {
      men: Overall({
        eventsInChampionship: events.length,
        members,
        results: events.map(({results}) => {
          if (results && results.men) {
            return results.men
          }
          return null
        }).filter(val => val !== null),
        qualificationCriteria: championship.frontmatter.qualificationCriteria,
      }),
      women: Overall({
        eventsInChampionship: events.length,
        members,
        results: events.map(({results}) => {
          if (results && results.women) {
            return results.women
          }
          return null
        }).filter(val => val !== null),
        qualificationCriteria: championship.frontmatter.qualificationCriteria,
      })
    }
  }

  return (
    <Layout path={championship.fields.slug}>
      <ChampionshipTemplate
        events={events}
        heroImage={heroImage}
        intro={championship.fields.intro}
        information={championship.html}
        overallStandings={overallStandings}
        standingsType={championship.frontmatter.championshipType}
        stripeSku={stripeSkuData}
        title={championship.frontmatter.championshipKey}
      />
    </Layout>
  )
}

Championship.propTypes = {
  data: PropTypes.object,
}

export default Championship

export const championshipQuery = graphql`
  query ChampionshipByID($id: String!, $stripeSkuName: String!) {
    site {
      siteMetadata {
        title
      }
    }
    stripeSku(
      active: { eq: true }
      attributes: {
        name: { eq: $stripeSkuName }
        category: { eq: "Championship" }
      }
    ) {
      attributes {
        name
      }
      id
      price
    }
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        intro
        slug
      }
      frontmatter {
        championshipEvents {
          id
          fields {
            slug
          }
          frontmatter {
            eventKey
            startsAt
            results {
              urn
              time
            }
            resultsType
            venue {
              frontmatter {
                venueKey
              }
            }
          }
        }
        championshipKey
        championshipType
        heroImage {
          childImageSharp {
            ...HeroImage
          }
        }
        qualificationCriteria {
          numberOfRaces
        }
        terrain
      }
    }
    member {
      allMember(_size: 1000) {
        data {
          urn
          firstName
          lastName
          gender
          dateOfBirth
        }
      }
    }
  }
`
