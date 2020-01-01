import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Moment from 'moment'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import { get } from 'lodash'
import Address from '../components/Address'
import GoogleMapsLocationAndRoute from '../components/GoogleMapsLocationAndRoute'
import GoogleMapsLocation from '../components/GoogleMapsLocation'
import EventTags from '../components/EventTags'
import Hero from '../components/Hero'
import { Panel, PanelFullWidth, Panels } from '../components/Panels'
import {
  CallToActionBackButton,
  CallToActionLink,
  CallToActionText,
} from '../components/CallToAction'
import Form from '../components/Form'
import FieldsetMulti from '../components/FieldsetMulti'
import Currency from '../components/Currency'
import InputText from '../components/InputText'
import {
  AddToCart,
  GetSkuItems,
  RemoveFromCart,
  StorageAvailable,
} from '../components/Cart'
import { CardCTA } from '../components/Card'
import Result from "../components/Result";
import Results from "../components/Results";

export class EventTemplate extends React.Component {
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
              document.querySelector('form#enter-event').scrollIntoView()
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
      championship,
      eventInfo,
      googleMapsApiKey,
      infoForChampionship,
      infoForCompetition,
      infoForEventType,
      infoForTerrain,
      results,
      resultsLink,
      resultsType,
      route,
      session,
      startsAt,
      stripeSku,
      tags,
      title,
      heroImage,
      venue,
    } = this.props
    const track = route ? route.track : null

    return (
      <StandardContentContainer>
        {heroImage ? (
          <Hero fluidImage={heroImage} title={title} />
        ) : (
          <h1 className="heading-1">{title}</h1>
        )}
        <Panels>
          <Panel>
            <div className="panel red-bottom">
              <p className="text-lg leading-relaxed">
                {startsAt.format('dddd Do MMMM YYYY, h:mm:a')}
              </p>
              <EventTags reactKey={'event'} tags={tags} />
            </div>
          </Panel>
          <Panel>
            <div className="panel black-bottom md:text-right">
              <Address address={venue.address} title={venue.title} />
            </div>
          </Panel>
        </Panels>
        <Panels>
          <PanelFullWidth>
            <div className="w-full relative" style={{ height: '70vh' }}>
              {track && (
                <GoogleMapsLocationAndRoute
                  googleMapsApiKey={googleMapsApiKey}
                  track={track}
                  id={'event-location-and-route'}
                  location={venue.location}
                  mapContainerClassName={'h-full'}
                />
              )}
              {!track && (
                <GoogleMapsLocation
                  googleMapsApiKey={googleMapsApiKey}
                  id={'event-location'}
                  location={venue.location}
                  mapContainerClassName={'h-full'}
                />
              )}
            </div>
          </PanelFullWidth>
        </Panels>
        <Panels>
          <PanelFullWidth>
            <div className="panel black-bottom">
              <CallToActionLink
                to={venue.slug}
                title={`${venue.title} facilities, directions, parking and travel information`}
              />
            </div>
          </PanelFullWidth>
        </Panels>
        {eventInfo && (
          <Panels>
            <PanelFullWidth>
              <div
                className="content panel red-bottom"
                dangerouslySetInnerHTML={{ __html: eventInfo }}
              />
            </PanelFullWidth>
          </Panels>
        )}
        {results && (
          <Panels>
            <PanelFullWidth>
              <div className="panel red-bottom">
                <h2 className="heading-2 mb-4">Results</h2>
                {resultsType === "Gendered" && (
                  <div className="flex flex-wrap md:flex-no-wrap md:-ml-4 md:mb-8">
                    <Results title={"Men"} results={results.men} />
                    <Results title={"Women"} results={results.women} />
                  </div>
                )}
                {resultsLink && (
                  <CallToActionLink title={"Full results"} to={resultsLink} />
                )}
              </div>
            </PanelFullWidth>
          </Panels>
        )}
        {stripeSku && this.state.storageAvailable && (
          <Panels>
            <PanelFullWidth>
              <div className="panel red-bottom">
                <h2 className="heading-2 mb-4">Event entry</h2>
                <Form
                  backHandler={this.backHandler}
                  backHighlighted={'+'}
                  backValue={this.state.backValue}
                  formId={'enter-event'}
                  method={'POST'}
                  netlify={false}
                  showBack={this.state.stage > 1}
                  showSubmit={true}
                  submitHandler={this.submitHandler}
                  submitValue={this.state.submitValue}
                >
                  <FieldsetMulti
                    legend={`Enter now for ${Currency(stripeSku.price)}`}
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
        {session && (
          <Panels>
            <PanelFullWidth>
              <div
                className="content panel red-bottom"
                dangerouslySetInnerHTML={{ __html: session }}
              />
            </PanelFullWidth>
          </Panels>
        )}
        {infoForTerrain && (
          <Panels>
            <PanelFullWidth>
              <div
                className="content panel red-bottom"
                dangerouslySetInnerHTML={{ __html: infoForTerrain }}
              />
            </PanelFullWidth>
          </Panels>
        )}
        {infoForEventType && (
          <Panels>
            <PanelFullWidth>
              <div
                className="content panel red-bottom"
                dangerouslySetInnerHTML={{ __html: infoForEventType }}
              />
            </PanelFullWidth>
          </Panels>
        )}
        {infoForCompetition && (
          <Panels>
            <PanelFullWidth>
              <div
                className="content panel red-bottom"
                dangerouslySetInnerHTML={{ __html: infoForCompetition }}
              />
            </PanelFullWidth>
          </Panels>
        )}
        {championship && (
          <Panels>
            <PanelFullWidth>
              <div className="panel black-bottom">
                <h2 className="heading-2 mb-4">Championships</h2>
                <CardCTA
                  to={championship.slug}
                  borderColorClassName={`border-gray-400`}
                  borderColorHoverClassName={`border-red-manyharrier`}
                  callToAction={
                    <CallToActionText title={'Championship details'} />
                  }
                >
                  <div className="content">
                    <p>This race is on the {championship.title}.</p>
                  </div>
                </CardCTA>
              </div>
            </PanelFullWidth>
          </Panels>
        )}
        {infoForChampionship && (
          <Panels>
            <PanelFullWidth>
              <div
                className="content panel red-bottom"
                dangerouslySetInnerHTML={{ __html: infoForChampionship }}
              />
            </PanelFullWidth>
          </Panels>
        )}
      </StandardContentContainer>
    )
  }
}

EventTemplate.propTypes = {
  championship: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
  }),
  contentComponent: PropTypes.func,
  eventInfo: PropTypes.node,
  googleMapsApiKey: PropTypes.string.isRequired,
  heroImage: PropTypes.object,
  infoForChampionship: PropTypes.node,
  infoForCompetition: PropTypes.node,
  infoForEventType: PropTypes.node,
  infoForTerrain: PropTypes.node,
  results: PropTypes.node,
  resultsType: PropTypes.string,
  route: PropTypes.shape({
    description: PropTypes.node,
    title: PropTypes.string,
    track: PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      })
    ),
  }),
  session: PropTypes.node,
  startsAt: PropTypes.instanceOf(Moment).isRequired,
  stripeSku: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }),
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  title: PropTypes.string.isRequired,
  venue: PropTypes.shape({
    address: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    slug: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
}

const Event = ({ data, pageContext }) => {
  const {
    site: {
      siteMetadata: {
        apiKey: { googleMaps: googleMapsApiKey },
      },
    },
    stripeSku,
    markdownRemark: event,
    member: {
      allMember: {
        data: members,
      }
    }
  } = data

  const startsAt = Moment.utc(event.frontmatter.startsAt)

  let championship, route, venue

  if (event.frontmatter.championship) {
    championship = {
      slug: event.frontmatter.championship.fields.slug,
      title: event.frontmatter.championship.frontmatter.championshipKey,
    }
  }

  if (event.frontmatter.route) {
    route = {
      description: event.frontmatter.route.html,
      title: event.frontmatter.route.frontmatter.routeKey,
    }
    const routeTrack = event.frontmatter.route.frontmatter.routeTrack
    if (routeTrack) {
      route.track = JSON.parse(routeTrack).coordinates.map(coords => {
        return {
          lat: coords[1],
          lng: coords[0],
        }
      })
    }
  }

  if (event.frontmatter.venue) {
    let coords = JSON.parse(event.frontmatter.venue.frontmatter.location)
      .coordinates
    venue = {
      address: event.frontmatter.venue.frontmatter.address.split('\n'),
      location: {
        lat: coords[1],
        lng: coords[0],
      },
      slug: event.frontmatter.venue.fields.slug,
      title: event.frontmatter.venue.frontmatter.venueKey,
    }
  }

  let results

  if (event.frontmatter.results) {
    if (!event.frontmatter.resultsType) {
      throw new Error("No resultsType specified")
    }

    if (event.frontmatter.resultsType === "Gendered") {
      results = {
        men: [],
        women: []
      }

      event.frontmatter.results.forEach(({urn, time}) => {
        const timeMoment = Moment.utc(time)
        const runner = members.find(member => {
          return member.urn === urn
        })

        if (!runner) {
          throw new Error(`Member for URN ${urn} not found`)
        }

        const { firstName, lastName, gender, dateOfBirth } = runner

        const result = {
          name: `${firstName} ${lastName}`,
          time: time,
          timeForSorting: timeMoment,
        }

        if (gender === "F") {
          results.women.push(result)
        } else {
          results.men.push(result)
        }
      })

      results.women.sort((a, b) => {
        return a.timeForSorting.isBefore(b.timeForSorting) ? -1 : 1
      })

      results.men.sort((a, b) => {
        return a.timeForSorting.isBefore(b.timeForSorting) ? -1 : 1
      })
    }
  }

  const tags = []

  if (event.frontmatter.eventType) {
    tags.push({
      key: 'eventType',
      value: event.frontmatter.eventType,
    })
  }

  if (event.frontmatter.terrain) {
    tags.push({
      key: 'terrain',
      value: event.frontmatter.terrain,
    })
  }

  if (event.frontmatter.championshipForeignKey) {
    tags.push({
      key: 'championship',
      value: event.frontmatter.championshipForeignKey,
    })
  }

  if (event.frontmatter.competitionForeignKey) {
    tags.push({
      key: 'competition',
      value: event.frontmatter.competitionForeignKey,
    })
  }

  let stripeSkuData
  if (stripeSku) {
    stripeSkuData = {
      id: stripeSku.id,
      name: stripeSku.attributes.name,
      price: stripeSku.price,
    }
  }

  const heroImage = event.frontmatter.heroImage
    ? event.frontmatter.heroImage.childImageSharp.fluid
    : null

  return (
    <Layout path={event.fields.slug}>
      <EventTemplate
        championship={championship}
        eventInfo={event.html}
        googleMapsApiKey={googleMapsApiKey}
        heroImage={heroImage}
        infoForChampionship={get(event.frontmatter.infoForChampionship, [
          'html',
        ])}
        infoForCompetition={get(event.frontmatter.infoForCompetition, ['html'])}
        infoForEventType={get(event.frontmatter.infoForEventType, ['html'])}
        infoForTerrain={get(event.frontmatter.infoForChampionship, ['html'])}
        results={results}
        resultsLink={event.frontmatter.resultsLink}
        resultsType={event.frontmatter.resultsType}
        route={route}
        session={get(event.frontmatter.session, ['html'])}
        startsAt={startsAt}
        stripeSku={stripeSkuData}
        tags={tags}
        title={event.frontmatter.eventKey}
        venue={venue}
      />
    </Layout>
  )
}

Event.propTypes = {
  data: PropTypes.object,
}

export default Event

export const eventQuery = graphql`
  query EventByID($id: String!, $stripeSkuName: String!) {
    site {
      siteMetadata {
        apiKey {
          googleMaps
        }
      }
    }
    stripeSku(
      active: { eq: true }
      attributes: {
        name: { eq: $stripeSkuName }
        category: { in: ["Race", "Social"] }
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
        slug
      }
      frontmatter {
        championship {
          fields {
            slug
          }
          frontmatter {
            championshipKey
          }
        }
        eventKey
        eventType
        #        infoForChampionship {
        #          html
        #        }
        heroImage {
          childImageSharp {
            ...HeroImage
          }
        }
        infoForCompetition {
          html
        }
        infoForEventType {
          html
        }
        infoForTerrain {
          html
        }
        resultsLink
        resultsType
        results {
          urn
          time
        }
        route {
          html
          frontmatter {
            routeKey
            routeTrack
          }
        }
        session {
          html
          fields {
            slug
          }
          frontmatter {
            sessionKey
          }
        }
        startsAt
        terrain
        venue {
          fields {
            slug
          }
          frontmatter {
            address
            location
            venueKey
          }
        }
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
