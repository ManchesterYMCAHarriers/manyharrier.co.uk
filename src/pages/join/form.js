import React from 'react'
import Layout from '../../components/Layout'
import InputText from '../../components/InputText'
import HTMLForm from '../../components/Form'
import FieldsetMulti from '../../components/FieldsetMulti'
import InputDate from '../../components/InputDate'
import Moment from 'moment'
import FieldsetRadios from '../../components/FieldsetRadios'
import FieldsetText from '../../components/FieldsetText'
import FieldsetCheckbox from '../../components/FieldsetCheckbox'
import FieldsetPostcode from '../../components/FieldsetPostcode'
import FieldsetSelect from '../../components/FieldsetSelect'
import {graphql, StaticQuery} from 'gatsby'
import StandardContentContainer from '../../components/StandardContentContainer'
import {H1} from '../../components/Headings'
import Currency from '../../components/Currency'
import Encode from '../../components/Encode'
import {PanelFullWidth, Panels} from '../../components/Panels'

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addressSelectorDisplayOptions: [],
      addressSelectorOptionsMap: [],
      siteUrl: null,
      data: {
        paymentMethod: "BACS",
      },
      externalError: null,
      formAction: '/join/form',
      getAddressApiError: false,
      getAddressApiKey: null,
      stage: 1,
      stages: 16,
      stripePublishableKey: null,
      stripeSkus: {
        firstClaim: null,
        secondClaim: null,
        unaffiliated: null,
      },
      submitValue: 'Next',
      validationIssues: [],
    }
  }

  getPossibleAddresses = async () => {
    const postcodeForQuery = this.state.data.postcode
      .toLowerCase()
      .replace(/\s/g, '')

    // This data will come from getAddress API
    try {
      const response = await Promise.race([
        fetch(
          'https://api.getAddress.io/find/' +
          postcodeForQuery +
          '?api-key=' +
          this.state.getAddressApiKey +
          '&sort=true'
        ),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject({
              ok: false,
            })
          }, 5000)
        }),
      ])

      // Invalid postcode format or postcode not found
      if (response.status === 400 || response.status === 404) {
        return {
          error: true,
        }
      }

      // Other error - 401 = api key not valid, 429 = too many requests, 500 = internal server error
      // Effectively API is down
      if (!response.ok) {
        return {
          apiError: true,
        }
      }

      const {latitude, longitude, addresses} = await response.json()

      const optionsArray = addresses.map(option => {
        return option.split(',').map(line => line.trim())
      })

      const displayOptions = optionsArray.map(option =>
        option.filter(line => line !== '').join(', ')
      )

      const optionsMap = optionsArray.map(option => {
        return {
          line1: option[0],
          line2: option[1],
          line3: option[2],
          line4: option[3],
          locality: option[4],
          town: option[5],
          county: option[6],
        }
      })

      return {
        displayOptions: displayOptions,
        optionsMap: optionsMap,
        latitude: latitude,
        longitude: longitude,
        ok: true,
      }
    } catch (err) {
      return {
        apiError: true,
      }
    }
  }

  backHandler = ev => {
    ev.preventDefault()
    if (this.state.stage > 1) {
      let prevStage = this.state.stage - 1
      // Exceptions
      const data = this.state.data
      if (
        this.state.stage === 6 &&
        data.membership !== this.state.stripeSkus.secondClaim
      ) {
        // Skip first claim club question if membership type is not second claim
        prevStage -= 1
      } else if (this.state.stage === 9 && this.state.getAddressApiError) {
        // Skip address selection if there has been an API error
        prevStage -= 1
      } else if (this.state.stage === 10 && data.selectedAddress !== 'none') {
        // Skip manual address entry if an address has been selected
        prevStage -= 1
      } else if (this.state.stage === 14 && !data.telephone) {
        // Skip WhatsApp sign up if no telephone number has been entered
        prevStage -= 1
      }

      this.setState(
        {
          stage: prevStage,
          submitValue: 'Next',
          validationIssues: [],
        },
        () => {
          // Scroll to page title
          document.querySelector('h1').scrollIntoView()
          // Set focus on first visible input
          const firstVisibleInput = document
            .querySelector('fieldset:not(.hidden)')
            .querySelector('input:not([type="hidden"]), textarea, select')
          if (firstVisibleInput) {
            firstVisibleInput.focus({
              preventScroll: true,
            })
          }
        }
      )
    }
  }

  submitHandler = async ev => {
    ev.preventDefault()
    // Check if visible elements validate
    let data = this.state.data
    ev.target
      .querySelector('fieldset:not(.hidden)')
      .querySelectorAll('input, textarea, select')
      .forEach(input => {
        if (input.checkValidity()) {
          if (input.tagName.toLowerCase() === 'input') {
            if (
              input.getAttribute('type').toLowerCase() === 'radio' ||
              input.getAttribute('type').toLowerCase() === 'checkbox'
            ) {
              if (input.checked) {
                data[input.getAttribute('name')] = input.value
              }
            } else {
              data[input.getAttribute('name')] = input.value
            }
          } else if (input.tagName.toLowerCase() === 'textarea') {
            data[input.getAttribute('name')] = input.value
          } else if (input.tagName.toLowerCase() === 'select') {
            data[input.getAttribute('name')] =
              input.options[input.selectedIndex].value
          }
        }
      })

    // If validation fails, don't continue
    if (this.state.validationIssues.length > 0) {
      return
    }

    let nextStage = this.state.stage + 1

    // If we're on the postcode lookup
    // Get postcode data from getAddress.io
    if (this.state.stage === 7) {
      try {
        const {
          apiError,
          error,
          displayOptions,
          optionsMap,
          latitude,
          longitude,
        } = await this.getPossibleAddresses()

        if (error) {
          this.updateValidationIssues({
            id: 'postcode',
            message: 'Enter a valid UK postcode',
          })
          return
        }

        // Skip to manual address entry in case of API error
        if (apiError) {
          this.setState({
            getAddressApiError: true,
          })
          nextStage += 1
        } else {
          // Set lat/long data
          data.latitude = latitude
          data.longitude = longitude
          // Set address lookup data
          this.setState({
            addressSelectorDisplayOptions: displayOptions,
            addressSelectorOptionsMap: optionsMap,
          })
        }
      } catch (err) {
        this.setState({
          getAddressApiError: true,
        })
        nextStage += 1
      }
    }

    if (this.state.stage === 8) {
      if (data.selectedAddress === 'none') {
        data.addressLine1 = ''
        data.addressLine2 = ''
        data.addressLine3 = ''
        data.addressLine4 = ''
        data.addressLocality = ''
        data.addressTown = ''
        data.addressCounty = ''
      } else {
        const idx = parseInt(data.selectedAddress, 10)
        document.getElementById('addressLine1').value = ''
        document.getElementById('addressLine2').value = ''
        document.getElementById('addressLine3').value = ''
        document.getElementById('addressLine4').value = ''
        document.getElementById('addressLocality').value = ''
        document.getElementById('addressTown').value = ''
        document.getElementById('addressCounty').value = ''
        data.addressLine1 = this.state.addressSelectorOptionsMap[idx].line1
        data.addressLine2 = this.state.addressSelectorOptionsMap[idx].line2
        data.addressLine3 = this.state.addressSelectorOptionsMap[idx].line3
        data.addressLine4 = this.state.addressSelectorOptionsMap[idx].line4
        data.addressLocality = this.state.addressSelectorOptionsMap[
          idx
          ].locality
        data.addressTown = this.state.addressSelectorOptionsMap[idx].town
        data.addressCounty = this.state.addressSelectorOptionsMap[idx].county
      }
    }

    this.setState(
      {
        data: data,
      },
      () => {
        // Navigate to the next page in the form...
        // Exceptions
        if (
          this.state.stage === 4 &&
          data.membership !== this.state.stripeSkus.secondClaim
        ) {
          nextStage += 1
        } else if (this.state.stage === 8 && data.selectedAddress !== 'none') {
          nextStage += 1
        } else if (this.state.stage === 12 && !data.telephone) {
          nextStage += 1
        }

        if (this.state.stage < this.state.stages) {
          let submitValue = 'Next'
          if (this.state.stage === this.state.stages - 1) {
            submitValue =
              data.paymentMethod === 'Stripe' ? 'Make payment' : 'Submit'
          }
          this.setState(
            {
              stage: nextStage,
              submitValue: submitValue,
            },
            () => {
              // Scroll to page title
              document.querySelector('h1').scrollIntoView()
              // Set focus on first visible input
              const firstVisibleInput = ev.target
                .querySelector('fieldset:not(.hidden)')
                .querySelector('input:not([type="hidden"]), textarea, select')
              if (firstVisibleInput) {
                firstVisibleInput.focus({
                  preventScroll: true,
                })
              }
            }
          )
        }
        // ...or proceed to payment
        else if (this.state.stage === this.state.stages) {
          data['form-name'] = ev.target.getAttribute('name')
          this.setState(
            {
              data: data,
            },
            async () => {
              try {
                const {status, ok} = await this.submitFormData()

                if (!ok) {
                  console.error('Submit form data error', status)
                  this.setState({
                    externalError: true,
                  })
                  return
                }
              } catch (err) {
                console.error('Submit form data network error', err)
                this.setState({
                  externalError: true,
                })
                return
              }

              if (this.state.data.paymentMethod === 'BACS') {
                this.setState(
                  {
                    externalError: false,
                    stage: nextStage,
                    submitValue: 'Back to Home',
                  },
                  () => {
                    document.querySelector('h1').scrollIntoView()
                  }
                )
                return
              }

              const {error} = await this.redirectToCheckout()
              if (error) {
                this.setState({
                  externalError: true,
                })
                console.error('Redirect to checkout error', error)
              }
            }
          )
        } else {
          window.location.href = '/'
        }
      }
    )
  }

  submitFormData = async () => {
    return await fetch(this.state.formAction, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }),
      body: Encode(this.state.data),
    })
  }

  redirectToCheckout = async () => {
    return await this.stripe.redirectToCheckout({
      items: [
        {
          sku: this.state.data.membership,
          quantity: 1,
        },
      ],
      successUrl: this.getSuccessUrl(this.state.data.membership),
      cancelUrl: this.state.siteUrl + `/join/cancel`,
      customerEmail: this.state.data.email,
      billingAddressCollection: 'auto',
      submitType: 'pay',
    })
  }

  getSuccessUrl = membershipType => {
    if (membershipType === this.state.stripeSkus.firstClaim) {
      return this.state.siteUrl + `/join/success-first-claim`;
    }

    if (membershipType === this.state.stripeSkus.secondClaim) {
      return this.state.siteUrl + `/join/success-second-claim`;
    }

    return this.state.siteUrl + `/join/success-unaffiliated`;
  }

  updateValidationIssues = ({id, message}) => {
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

  componentDidMount() {
    document
      .querySelector('form#join')
      .querySelector('fieldset:not(.hidden)')
      .querySelector('input:not([type="hidden"]), textarea, select')
      .focus({
        preventScroll: true,
      })
  }

  render() {
    return (
      <StaticQuery
        query={graphql`
          query JoinForm {
            page: site {
              siteMetadata {
                siteUrl
                apiKey {
                  getAddress
                  stripe
                }
              }
            }
            firstClaim: stripeSku(
              product: { name: { eq: "Membership" } }
              attributes: { claim: { eq: "First" } }
              active: { eq: true }
            ) {
              id
              price
              attributes {
                name
                valid_to
              }
            }
            secondClaim: stripeSku(
              product: { name: { eq: "Membership" } }
              attributes: { claim: { eq: "Second" } }
              active: { eq: true }
            ) {
              id
              price
              attributes {
                name
                valid_to
              }
            }
            unaffiliated: stripeSku(
              product: { name: { eq: "Membership" } }
              attributes: { claim: { eq: "Unaffiliated" } }
              active: { eq: true }
            ) {
              id
              price
              attributes {
                name
                valid_to
              }
            }
          }
        `}
        render={({page, firstClaim, secondClaim, unaffiliated}) => {
          const {siteUrl} = page.siteMetadata
          const getAddressApiKey = page.siteMetadata.apiKey.getAddress
          const stripePublishableKey = page.siteMetadata.apiKey.stripe
          const firstClaimSku = firstClaim.id
          const firstClaimPrice = Currency(firstClaim.price)
          const firstClaimValidTo = firstClaim.attributes.valid_to
          const secondClaimSku = secondClaim.id
          const secondClaimPrice = Currency(secondClaim.price)
          const secondClaimValidTo = secondClaim.attributes.valid_to
          const unaffiliatedSku = unaffiliated.id
          const unaffiliatedPrice = Currency(unaffiliated.price)
          const unaffiliatedValidTo = unaffiliated.attributes.valid_to

          if (!this.state.stripeSkus.firstClaim) {
            this.setState(
              {
                siteUrl: siteUrl,
                getAddressApiKey: getAddressApiKey,
                stripePublishableKey: stripePublishableKey,
                stripeSkus: {
                  firstClaim: firstClaimSku,
                  secondClaim: secondClaimSku,
                  unaffiliated: unaffiliatedSku,
                },
              },
              () => {
                this.stripe = window.Stripe(this.state.stripePublishableKey)
              }
            )
          }

          return (
            <Layout title={'Membership form'}
                    description={'Complete this form to become a member of the Manchester YMCA Harriers'} path={"/join"}
                    location={this.props.location}>
              <StandardContentContainer>
                <H1 title={'Join us / Renew your membership'}/>
                <Panels>
                  <PanelFullWidth>
                    <div className="panel red-bottom">
                      <HTMLForm
                        netlify={true}
                        formId={'join'}
                        method={'POST'}
                        backHandler={this.backHandler}
                        backValue={'Back'}
                        externalError={this.state.externalError}
                        showBack={
                          this.state.stage > 1 &&
                          this.state.stage <= this.state.stages
                        }
                        showSubmit={true}
                        submitHandler={this.submitHandler}
                        submitValue={this.state.submitValue}
                      >
                        {/* First and last name */}
                        <FieldsetMulti
                          legend={'What is your name?'}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 1}
                        >
                          <InputText
                            label={'First name'}
                            inputId={'firstName'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            inputAttributes={{
                              required: true,
                              autoComplete: 'given-name',
                            }}
                            validationMessages={{
                              valueMissing: 'Enter your first name',
                            }}
                            setFormValidationState={this.updateValidationIssues}
                          />
                          <InputText
                            label={'Last name'}
                            inputId={'lastName'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            inputAttributes={{
                              required: true,
                              autoComplete: 'family-name',
                            }}
                            validationMessages={{
                              valueMissing: 'Enter your last name',
                            }}
                            setFormValidationState={this.updateValidationIssues}
                          />
                        </FieldsetMulti>

                        {/* Date of birth */}
                        <FieldsetMulti
                          legend={'What is your date of birth?'}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 2}
                        >
                          <InputDate
                            hint={'For example, 28 11 1990'}
                            inputAttributes={{
                              required: true,
                            }}
                            inputId={'dateOfBirth'}
                            setFormValidationState={this.updateValidationIssues}
                            validationMessages={{
                              valueMissing: 'Enter your date of birth',
                              dayValueMissing:
                                'Enter your date of birth and include a day, a month and a year',
                              monthValueMissing:
                                'Enter your date of birth and include a day, a month and a year',
                              yearValueMissing:
                                'Enter your date of birth and include a day, a month and a year',
                              invalidDate: 'Enter a real date of birth',
                              beforeEarliestDate:
                                "Come on... you can't be that old!",
                              afterLatestDate:
                                'You must be 18 years old or over to join us',
                            }}
                            latestDate={Moment.utc().subtract(18, 'years')}
                            earliestDate={Moment.utc().subtract(120, 'years')}
                            autoCompleteDay={'bday-day'}
                            autoCompleteMonth={'bday-month'}
                            autoCompleteYear={'bday-year'}
                          />
                        </FieldsetMulti>

                        {/* Gender */}
                        <FieldsetRadios
                          inputAttributes={{
                            required: true,
                          }}
                          legend={'What is your gender?'}
                          name={'gender'}
                          options={[
                            {
                              id: 'genderFemale',
                              label: 'Female',
                              value: 'Female',
                            },
                            {
                              id: 'genderMale',
                              label: 'Male',
                              value: 'Male',
                            },
                          ]}
                          setFormValidationState={this.updateValidationIssues}
                          validationMessages={{
                            valueMissing: 'Select your gender',
                          }}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 3}
                        />

                        {/* Membership type */}
                        <FieldsetRadios
                          inputAttributes={{
                            required: true,
                          }}
                          hint={
                            'Choose "England Athletics first claim membership" if you want to represent the Club in competitions and wish to enjoy the benefits of England Athletics affiliation, such as discounts on race entry fees. Select "England Athletics second claim membership" if you\'re a member of another running club and you are already affiliated with England Athletics. Or, if you just want to be a part of the Club but don\'t want to run competitively, choose "Unaffiliated membership".'
                          }
                          legend={'What type of membership do you need?'}
                          name={'membership'}
                          options={[
                            {
                              id: 'membershipFirstClaim',
                              label:
                                'England Athletics first claim membership @ ' +
                                firstClaimPrice +
                                ', valid until ' +
                                firstClaimValidTo,
                              value: firstClaimSku,
                            },
                            {
                              id: 'membershipSecondClaim',
                              label:
                                'England Athletics second claim membership @ ' +
                                secondClaimPrice +
                                ', valid until ' +
                                secondClaimValidTo,
                              value: secondClaimSku,
                            },
                            {
                              id: 'membershipUnaffiliated',
                              label:
                                'Unaffiliated membership @ ' +
                                unaffiliatedPrice +
                                ', valid until ' +
                                unaffiliatedValidTo,
                              value: unaffiliatedSku,
                            },
                          ]}
                          setFormValidationState={this.updateValidationIssues}
                          validationMessages={{
                            valueMissing: 'Select a membership option',
                          }}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 4}
                        />

                        {/* First claim club - conditional */}
                        <FieldsetText
                          inputId={'firstClaimClub'}
                          inputType={'text'}
                          inputAttributes={{
                            required:
                              this.state.data.membership === secondClaimSku,
                          }}
                          label={'What is the name of your first claim club?'}
                          setFormValidationState={this.updateValidationIssues}
                          validationIssues={this.state.validationIssues}
                          validationMessages={{
                            valueMissing:
                              'Enter the name of your first claim club',
                          }}
                          visible={this.state.stage === 5}
                        />

                        {/* Y Club membership type */}
                        <FieldsetRadios
                          inputAttributes={{
                            required: true,
                          }}
                          legend={'Do you have a Y Club membership?'}
                          hint={
                            'The Y Club facilities, including the changing rooms, lockers, showers and toilets, are only available to those with a Y Club gym membership or a Y Club social membership. If you are not a Y Club member, you will need to turn up to group runs "ready to run".'
                          }
                          name={'yClubMembership'}
                          options={[
                            {
                              id: 'yClubMember',
                              label: 'I am a member of the Y Club gym',
                              value: 'Member',
                            },
                            {
                              id: 'yClubMemberNonMember',
                              label: 'I am not a member of the Y Club gym',
                              value: 'Non-member',
                            },
                          ]}
                          setFormValidationState={this.updateValidationIssues}
                          validationMessages={{
                            valueMissing: 'Select an option',
                          }}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 6}
                        />

                        {/* Postcode */}
                        <FieldsetPostcode
                          label={'What is your postcode?'}
                          inputId={'postcode'}
                          inputAttributes={{
                            required: true,
                          }}
                          setFormValidationState={this.updateValidationIssues}
                          visible={this.state.stage === 7}
                          validationIssues={this.state.validationIssues}
                          validationMessages={{
                            valueMissing: 'Enter your postcode',
                            customError: 'Enter a valid UK postcode',
                          }}
                        />

                        {/* Address lookup */}
                        <FieldsetSelect
                          defaultValue={''}
                          legend={'Select your address'}
                          inputId={'selectedAddress'}
                          inputAttributes={{
                            required: true,
                          }}
                          setFormValidationState={this.updateValidationIssues}
                          visible={this.state.stage === 8}
                          validationIssues={this.state.validationIssues}
                          validationMessages={{
                            valueMissing: 'Select an option',
                          }}
                        >
                          <option key={'address-option-default'} value="">
                            (Select your address)
                          </option>
                          {this.state.addressSelectorDisplayOptions.map(
                            (addressOption, i) => (
                              <option key={'address-option-' + i} value={i}>
                                {addressOption}
                              </option>
                            )
                          )}
                          <option key={'address-option-none'} value="none">
                            My address is not listed
                          </option>
                        </FieldsetSelect>

                        {/* Manual address entry */}
                        <FieldsetMulti
                          legend={'What is your address?'}
                          hint={
                            this.state.getAddressApiError
                              ? "Sorry! There's been a problem with our address lookup, so we need you to enter your address manually"
                              : ''
                          }
                          setFormValidationState={this.updateValidationIssues}
                          visible={this.state.stage === 9}
                          validationIssues={this.state.validationIssues}
                        >
                          <InputText
                            label={'Line 1'}
                            inputId={'addressLine1'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            setFormValidationState={this.updateValidationIssues}
                            inputAttributes={{
                              required: true,
                            }}
                            validationMessages={{
                              valueMissing:
                                'Enter the first line of your address',
                            }}
                            defaultValue={this.state.data.addressLine1}
                          />
                          <InputText
                            label={'Line 2'}
                            inputId={'addressLine2'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            setFormValidationState={this.updateValidationIssues}
                            defaultValue={this.state.data.addressLine2}
                          />
                          <InputText
                            label={'Line 3'}
                            inputId={'addressLine3'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            setFormValidationState={this.updateValidationIssues}
                            defaultValue={this.state.data.addressLine3}
                          />
                          <InputText
                            label={'Line 4'}
                            inputId={'addressLine4'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            setFormValidationState={this.updateValidationIssues}
                            defaultValue={this.state.data.addressLine4}
                          />
                          <InputText
                            label={'Locality'}
                            inputId={'addressLocality'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            setFormValidationState={this.updateValidationIssues}
                            defaultValue={this.state.data.addressLocality}
                          />
                          <InputText
                            label={'Town'}
                            inputId={'addressTown'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            setFormValidationState={this.updateValidationIssues}
                            defaultValue={this.state.data.addressTown}
                          />
                          <InputText
                            label={'County'}
                            inputId={'addressCounty'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            setFormValidationState={this.updateValidationIssues}
                            defaultValue={this.state.data.addressCounty}
                          />
                        </FieldsetMulti>

                        {/* Email address */}
                        <FieldsetText
                          inputId={'email'}
                          inputType={'email'}
                          label={'What is your email address?'}
                          hint={
                            'We will contact you via email with important club information'
                          }
                          setFormValidationState={this.updateValidationIssues}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 10}
                          inputAttributes={{
                            autoComplete: 'email',
                            required: true,
                          }}
                          validationMessages={{
                            typeMismatch: 'Enter a valid email address',
                            valueMissing: 'Enter your email address',
                          }}
                        />

                        {/* Newsletter subscription */}
                        <FieldsetRadios
                          inputAttributes={{
                            required: true,
                          }}
                          hint={
                            'Our newsletter email is sent periodically to keep you up to date with what is going on at the club.'
                          }
                          legend={'Do you want to subscribe to our newsletter?'}
                          name={'newsletter'}
                          options={[
                            {
                              id: 'newsletterYes',
                              label: 'Yes, sign me up for the newsletter',
                              value: 'Yes',
                            },
                            {
                              id: 'newsletterNo',
                              label:
                                "No, I don't want to receive the newsletter",
                              value: 'No',
                            },
                          ]}
                          setFormValidationState={this.updateValidationIssues}
                          validationMessages={{
                            valueMissing: 'Select an option',
                          }}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 11}
                        />

                        {/* Telephone number */}
                        <FieldsetText
                          inputId={'telephone'}
                          inputType={'tel'}
                          hint={
                            "You do not have to tell us your telephone number if you don't want to"
                          }
                          label={'What is your telephone number?'}
                          setFormValidationState={this.updateValidationIssues}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 12}
                          inputAttributes={{
                            autoComplete: 'tel',
                          }}
                        />

                        {/* WhatsApp */}
                        <FieldsetRadios
                          inputAttributes={{
                            required: true,
                          }}
                          hint={
                            'Our WhatsApp group is a place for announcements and informal chat between members.'
                          }
                          legend={'Do you want to join our WhatsApp group?'}
                          name={'whatsApp'}
                          options={[
                            {
                              id: 'whatsAppYes',
                              label: 'Yes, add me to the WhatsApp group',
                              value: 'Yes',
                            },
                            {
                              id: 'whatsAppNo',
                              label:
                                "No, I don't want to join the WhatsApp group",
                              value: 'No',
                            },
                          ]}
                          setFormValidationState={this.updateValidationIssues}
                          validationMessages={{
                            valueMissing: 'Select an option',
                          }}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 13}
                        />

                        {/* Emergency contact */}
                        <FieldsetMulti
                          legend={
                            'Do you have someone we should contact in the case of an emergency?'
                          }
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 14}
                          hint={
                            "You do not need to tell us an emergency contact if you don't want to."
                          }
                        >
                          <InputText
                            inputId={'emergencyContactName'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'text'}
                            setFormValidationState={this.updateValidationIssues}
                            label={
                              'What is the name of your emergency contact?'
                            }
                          />
                          <InputText
                            inputId={'emergencyContactNumber'}
                            inputSizes={'w-full md:w-1/2'}
                            inputType={'tel'}
                            setFormValidationState={this.updateValidationIssues}
                            label={
                              "What is your emergency contact's telephone number?"
                            }
                          />
                        </FieldsetMulti>

                        {/* Final declarations */}
                        <FieldsetCheckbox
                          inputAttributes={{
                            required: true,
                          }}
                          inputId={'declarations'}
                          legend={'Do you agree to the following statements?'}
                          validationIssues={this.state.validationIssues}
                          validationMessages={{
                            valueMissing:
                              'You must agree to these statements in order to continue',
                          }}
                          visible={this.state.stage === 15}
                          setFormValidationState={this.updateValidationIssues}
                          label={'Yes, I agree to the statements above'}
                          value={'Accepted'}
                          statements={
                            <dl>
                              <dt>Fitness to run</dt>
                              <dd>
                                I declare that I will only take part in Manchester
                                YMCA Harriers running activities when I am fit
                                and well enough to do so.
                              </dd>
                              <dd>
                                I understand that my health is my own responsibility.
                              </dd>
                              <dt>Club Rules</dt>
                              <dd>
                                I hereby apply for membership of the Manchester
                                YMCA Harriers Club and I agree to abide by the{' '}
                                <a href="/about/rules/" target="_blank">
                                  rules of the Club
                                </a>
                                .
                              </dd>
                              <dt>Welfare and Safeguarding Policy</dt>
                              <dd>
                                I have read and understood the Club's{' '}
                                <a href="/about/welfare-and-safeguarding-policy/" target="_blank">
                                  Welfare and Safeguarding Policy
                                </a>
                                .
                              </dd>
                              <dt>Y Club membership and facilities use</dt>
                              <dd>
                                I understand that the Manchester YMCA Harriers
                                Club and the Y Club are separate entities.
                              </dd>
                              <dd>
                                I understand that Y Club facilities, including
                                the changing rooms, lockers, showers and toilets
                                are only available to Y Club members.
                              </dd>
                              <dd>
                                I understand that the reception staff at the Y
                                Club are not permitted to accept items for
                                safe-keeping, regardless of whether I am a
                                member of the Y Club or not.
                              </dd>
                              {this.state.data.yClubMembership ===
                              'Non-member' && (
                                <dd>
                                  I am aware that as I am not a member of the Y
                                  Club, I should arrive at sessions starting
                                  from the Y Club "ready to run".
                                </dd>
                              )}
                              {this.state.data.yClubMembership ===
                              'Non-member' && (
                                <dd>
                                  I am aware that if I wish to use the Y Club's
                                  facilities, I need to become a member of the Y
                                  Club and I should arrange this with the Y Club
                                  reception.
                                </dd>
                              )}
                              <dt>Club membership</dt>
                              {this.state.data.membership === firstClaimSku && (
                                <dd>
                                  I understand that I will be registered as a
                                  first claim member of the Manchester YMCA
                                  Harriers Club with England Athletics.
                                </dd>
                              )}
                              {this.state.data.membership ===
                              secondClaimSku && (
                                <dd>
                                  I understand that I am becoming a second claim
                                  member of the Manchester YMCA Harriers Club.
                                </dd>
                              )}
                              {this.state.data.membership ===
                              unaffiliatedSku && (
                                <dd>
                                  I understand that I am joining as an unaffiliated member. This means I will not be
                                  registered with England Athletics.
                                </dd>
                              )}
                              {this.state.data.membership !== unaffiliatedSku && (
                                <dd>
                                  I am aware that the Manchester YMCA Harriers
                                  Club is a registered club in the disciplines of
                                  road running, fell running, cross country
                                  running and trail running.
                                </dd>
                              )}
                              {this.state.data.membership === firstClaimSku && (
                                <dd>
                                  I am aware that if I participate in any
                                  competitions in these disciplines, I am
                                  expected to represent the Manchester YMCA
                                  Harriers Club in that competition.
                                </dd>
                              )}
                              {this.state.data.membership ===
                              secondClaimSku && (
                                <dd>
                                  I am aware that if I participate in any
                                  competitions, I will only be able to represent
                                  the Manchester YMCA Harriers Club if my first
                                  claim club ({this.state.data.firstClaimClub})
                                  is not registered for that discipline.
                                </dd>
                              )}
                              {this.state.data.membership ===
                              unaffiliatedSku && (
                                <dd>
                                  I am aware that as an unaffiliated member, I will not be able to represent the
                                  Manchester YMCA Harriers club in certain England Athletics affiliated competitions
                                  (such as cross country).
                                </dd>
                              )}
                              <dt>Data protection</dt>
                              <dd>
                                I understand that my personal data will be
                                controlled by the Manchester YMCA Harriers Club
                                and that my personal data can be processed by
                                any member of the Club's Committee for official
                                Club business.
                              </dd>
                              {this.state.data.membership === firstClaimSku && (
                                <dd>
                                  I understand that on becoming a member of the
                                  Manchester YMCA Harriers Club I will
                                  be registered as a member of
                                  England Athletics. The Club will provide
                                  England Athletics with your personal data
                                  which they will use to enable access to an
                                  online portal for you (called{' '}
                                  <em>myAthletics</em>). England Athletics will
                                  contact you to invite you to sign into the{' '}
                                  <em>myAthletics</em> portal, where you can,
                                  amongst other things, set and amend your
                                  privacy settings. If you have any questions
                                  about the continuing privacy of your personal
                                  data when it is shared with England Athletics,
                                  please contact{' '}
                                  <a href="mailto:dataprotection@englandathletics.org">
                                    dataprotetion@englandathletics.org
                                  </a>
                                  .
                                </dd>
                              )}
                            </dl>
                          }
                        />

                        {/* Review */}
                        <FieldsetMulti
                          legend={'Is all of your information correct?'}
                          hint={
                            'If not, please use the back button to go back and correct it.'
                          }
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 16}
                        >
                          <dl>
                            <dt>Name</dt>
                            <dd>
                              {this.state.data.firstName}{' '}
                              {this.state.data.lastName}
                            </dd>
                            <dt>Date of birth</dt>
                            <dd>{this.state.data['dateOfBirth']}</dd>
                            <dt>Gender</dt>
                            <dd>{this.state.data.gender}</dd>
                            <dt>
                              Manchester YMCA Harriers Club membership type
                            </dt>
                            <dd>
                              {this.state.data.membership === firstClaimSku && (`First claim membership @ ${firstClaimPrice}, valid until ${firstClaimValidTo}`)}
                              {this.state.data.membership === secondClaimSku && (`Second claim membership @ ${secondClaimPrice}, valid until ${secondClaimValidTo}`)}
                              {this.state.data.membership === unaffiliatedSku && (`Unaffiliated membership @ ${unaffiliatedPrice}, valid until ${unaffiliatedValidTo}`)}
                            </dd>
                            {this.state.data.membership === secondClaimSku && (
                              <dt>First claim club</dt>
                            )}
                            {this.state.data.membership === secondClaimSku && (
                              <dd>{this.state.data.firstClaimClub}</dd>
                            )}
                            <dt>Y Club membership type</dt>
                            <dd>{this.state.data.yClubMembership}</dd>
                            <dt>Address</dt>
                            <dd>
                              <div>{this.state.data.addressLine1}</div>
                              {this.state.data.addressLine2 && (
                                <div>{this.state.data.addressLine2}</div>
                              )}
                              {this.state.data.addressLine3 && (
                                <div>{this.state.data.addressLine3}</div>
                              )}
                              {this.state.data.addressLine4 && (
                                <div>{this.state.data.addressLine4}</div>
                              )}
                              {this.state.data.addressLocality && (
                                <div>{this.state.data.addressLocality}</div>
                              )}
                              {this.state.data.addressTown && (
                                <div>{this.state.data.addressTown}</div>
                              )}
                              {this.state.data.addressCounty && (
                                <div>{this.state.data.addressCounty}</div>
                              )}
                              <div>{this.state.data.postcode}</div>
                            </dd>
                            <dt>Email address</dt>
                            <dd>{this.state.data.email}</dd>
                            <dt>Newsletter subscription</dt>
                            <dd>
                              You have opted
                              {this.state.data.newsletter === 'No' && ' not'} to
                              receive our email newsletter
                            </dd>
                            <dt>Telephone number</dt>
                            {this.state.data.telephone ? (
                              <dd>{this.state.data.telephone}</dd>
                            ) : (
                              <dd>No telephone number provided</dd>
                            )}
                            {this.state.data.telephone && (
                              <dt>WhatsApp group</dt>
                            )}
                            {this.state.data.telephone && (
                              <dd>
                                You have opted
                                {this.state.data.whatsApp === 'No' && ' not'} to
                                join our WhatsApp group
                              </dd>
                            )}
                            <dt>Emergency contact</dt>
                            <dd>
                              {this.state.data.emergencyContactName
                                ? this.state.data.emergencyContactName +
                                ' - ' +
                                this.state.data.emergencyContactNumber
                                : 'No emergency contact details provided'}
                            </dd>
                            <dt>
                              Acceptance of rules and Data Protection statements
                            </dt>
                            <dd>
                              You have accepted the rules and Data Protection
                              statements
                            </dd>
                            <dt>Payment method</dt>
                            <dd>
                              Please pay by
                              {this.state.data.paymentMethod === 'BACS' &&
                              ' bank transfer'}
                              {this.state.data.paymentMethod === 'Stripe' &&
                              ' credit card, debit card or Apple Pay'}
                            </dd>
                          </dl>
                          {this.state.data.paymentMethod === 'Stripe' && (
                            <p>
                              When you click the "Make payment" button, you will
                              be transferred to our Stripe checkout page.
                            </p>
                          )}
                        </FieldsetMulti>

                        {/* Bank payment details */}
                        <FieldsetMulti
                          legend={'Thanks for joining the club!'}
                          name={'paymentMethod'}
                          setFormValidationState={this.updateValidationIssues}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 17}
                        >
                          <p>
                            You have opted to pay for your membership by{' '}
                            <strong>bank transfer</strong>.
                          </p>
                          <p>
                            Now, please send payment your membership fee of{' '}
                            <strong>
                              {this.state.data.membership === firstClaimSku && (firstClaimPrice)}
                              {this.state.data.membership === secondClaimSku && (secondClaimPrice)}
                              {this.state.data.membership === unaffiliatedSku && (unaffiliatedPrice)}
                            </strong>{' '}
                            from your bank account to our account.
                          </p>
                          <p>Our account details are:</p>
                          <dl>
                            <dt>Sort code</dt>
                            <dd>30-90-89</dd>
                            <dt>Account number</dt>
                            <dd>39972068</dd>
                          </dl>
                          <p>
                            Use{' '}
                            <strong>
                              {this.state.data.firstName &&
                              this.state.data.firstName.charAt(0)}{' '}
                              {this.state.data.lastName}
                            </strong>{' '}
                            as your payment reference.
                          </p>
                        </FieldsetMulti>
                      </HTMLForm>
                    </div>
                  </PanelFullWidth>
                </Panels>
              </StandardContentContainer>
            </Layout>
          )
        }}
      />
    )
  }
}
