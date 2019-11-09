import React from 'react'
import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import {H1} from '../../components/Headings'
import {
  CheckoutAvailable,
  EmptyCart,
  GetCart,
  NumberOfItems,
  NumberOfLines,
  RemoveFromCart,
  StorageAvailable,
  UpdateQuantity,
} from '../../components/Cart'
import Currency from '../../components/Currency'
import InputText from '../../components/InputText'
import Form from '../../components/Form'
import FieldsetMulti from '../../components/FieldsetMulti'
import {graphql, StaticQuery} from 'gatsby'
import FieldsetText from '../../components/FieldsetText'
import FieldsetRadios from '../../components/FieldsetRadios'
import Encode from '../../components/Encode'

export default class CheckoutIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checkoutAvailable: false,
      storageAvailable: null,
      checkingStorageAvailable: true,
      data: {},
      cart: {
        items: [],
        total: 0,
        firstName: null,
        lastName: null,
        email: null,
      },
      formAction: '/checkout',
      numberOfItems: 0,
      numberOfLines: 0,
      submitValue: 'Next',
      stage: 1,
      stages: 5,
      validationIssues: [],
    }
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
      items: this.state.cart.items.map(({sku, quantity}) => {
        return {
          sku,
          quantity,
        }
      }),
      successUrl: this.state.baseUrl + `/checkout/success/`,
      cancelUrl: this.state.baseUrl + `/checkout/cancel/`,
      customerEmail: this.state.data.email,
      billingAddressCollection: 'auto',
      submitType: 'pay',
    })
  }

  backHandler = ev => {
    ev.preventDefault()
    this.setState({
      stage: this.state.stage - 1,
      submitValue: 'Next',
    })
  }

  submitHandler = ev => {
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

    this.setState(
      {
        data: data,
      },
      () => {
        if (this.state.stage < this.state.stages) {
          let submitValue = "Next"
          if (this.state.stage === this.state.stages - 1) {
            submitValue = data.paymentMethod === 'Stripe' ? 'Make payment' : 'Place order'
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
        // ...or proceed to checkout
        else {
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
                  return
                }
              } catch (err) {
                console.error('Submit form data network error', err)
                return
              }

              if (this.state.data.paymentMethod === 'BACS') {
                this.setState(
                  {
                    stage: nextStage,
                  },
                  () => {
                    EmptyCart()
                    document.querySelector('h1').scrollIntoView()
                  }
                )
                return
              }

              EmptyCart()

              const {error} = await this.redirectToCheckout()
              if (error) {
                console.error('Redirect to checkout error', error)
              }
            }
          )
        }
      }
    )
  }

  decrementItem = ev => {
    ev.preventDefault()
    const itemId = ev.currentTarget.id.replace('-decrement', '')
    const quantityInput = document.getElementById(itemId + '-quantity')
    if (quantityInput.value.search(/^[\d+]$/) > -1) {
      const quantity = parseInt(quantityInput.value, 10)
      if (quantity > 1) {
        quantityInput.value = quantity - 1
        quantityInput.dispatchEvent(new Event('change'))
      } else {
        RemoveFromCart({
          id: itemId,
          quantity: 1,
        })
      }

      this.setState({
        cart: GetCart(),
        numberOfItems: NumberOfItems(),
        numberOfLines: NumberOfLines(),
      })
    }
  }

  incrementItem = ev => {
    ev.preventDefault()
    const itemId = ev.currentTarget.id.replace('-increment', '')
    const quantityInput = document.getElementById(itemId + '-quantity')
    if (quantityInput.value.search(/^[\d+]$/) > -1) {
      const quantity = parseInt(quantityInput.value, 10)
      quantityInput.value = quantity + 1
      quantityInput.dispatchEvent(new Event('change'))
    }
  }

  showBack = () => {
    return this.state.stage > 1 && this.state.stage <= this.state.stages
  }

  showSubmit = () => {
    return this.state.stage <= this.state.stages
  }

  updateValidationIssues = ({id, message}) => {
    const validationIssues = this.state.validationIssues
    // Update/remove existing validation issues
    for (let i = 0; i < validationIssues.length; i++) {
      if (validationIssues[i].id === id) {
        if (!message) {
          validationIssues.splice(i, 1)
          this.setState(
            {
              validationIssues: validationIssues,
            },
            () => {
              // No validation issues; update cart
              this.updateQuantities()
            }
          )
          return
        }

        validationIssues[i].message = message
        this.setState({
          validationIssues: validationIssues,
        })
        return
      }
    }

    // Add new validation issue
    if (message) {
      validationIssues.push({
        id: id,
        message: message,
      })
    } else {
      // No validation issues - update quantities from form
      this.updateQuantities()
    }

    this.setState({
      validationIssues: validationIssues,
    })
  }

  updateQuantities = () => {
    let actionTaken = false
    document
      .querySelector('#checkout')
      .querySelector('fieldset:not(.hidden)')
      .querySelectorAll('input[type="number"]')
      .forEach(el => {
        const itemId = el.id.replace('-quantity', '')
        if (el.value.search(/^[\d]+$/) > -1) {
          UpdateQuantity({
            id: itemId,
            quantity: parseInt(el.value, 10),
          })

          actionTaken = true
        }
      })

    if (actionTaken) {
      this.setState({
        cart: GetCart(),
        numberOfItems: NumberOfItems(),
        numberOfLines: NumberOfLines(),
      })
    }
  }

  componentDidMount() {
    if (StorageAvailable('sessionStorage')) {
      this.setState({
        cart: GetCart(),
        numberOfItems: NumberOfItems(),
        numberOfLines: NumberOfLines(),
        storageAvailable: true,
      })
    }

    this.setState({
      checkingStorageAvailable: false,
    })
  }

  render() {
    if (!this.state.storageAvailable) {
      return (
        <Layout path={'/checkout'}>
          <StandardContentContainer>
            <H1 title={'Checkout'} />
            {this.state.checkingStorageAvailable && (
              <p>Loading checkout; please wait...</p>
            )}
            {this.state.storageAvailable === false && (
              <>
                <p>Sorry - checkout is not available on your device.</p>
                {/* Hidden form inputs needed for Netlify forms */}
                <form id={'checkout'}
                      name={'checkout'}
                      data-netlify={true}
                      action={'/checkout'}
                      method={'POST'}>
                  <input type="hidden" name="form-name" value="checkout" />
                  <input type="hidden" name="items" value="" />
                  <input type="hidden" name="firstName" value="" />
                  <input type="hidden" name="lastName" value="" />
                  <input type="hidden" name="email" value="" />
                  <input type="hidden" name="paymentMethod" value="" />
                </form>
              </>
            )}
          </StandardContentContainer>
        </Layout>
      )
    }

    return (
      <StaticQuery
        query={graphql`
          query Checkout {
            site {
              siteMetadata {
                baseUrl
                apiKey {
                  stripe
                }
              }
            }
          }
        `}
        render={({site: data}) => {
          const {baseUrl} = data.siteMetadata
          const stripePublishableKey = data.siteMetadata.apiKey.stripe

          if (!this.state.stripePublishableKey) {
            this.setState(
              {
                baseUrl: baseUrl,
                stripePublishableKey: stripePublishableKey,
              },
              () => {
                this.stripe = window.Stripe(this.state.stripePublishableKey)
              }
            )
          }

          return (
            <Layout path={'/checkout'}>
              <StandardContentContainer>
                <H1 title={'Checkout'} />
                {this.state.numberOfLines === 0 && (
                  <p>You have no items in your basket.</p>
                )}
                {this.state.numberOfLines > 0 && (
                  <Form
                    backHandler={this.backHandler}
                    backValue={'Back'}
                    formId={'checkout'}
                    method={'POST'}
                    netlify={true}
                    showBack={this.showBack()}
                    showSubmit={this.showSubmit()}
                    submitHandler={this.submitHandler}
                    submitValue={this.state.submitValue}
                  >
                    {/* Cart display */}
                    <FieldsetMulti
                      legend={'Your cart'}
                      validationIssues={this.state.validationIssues}
                      visible={this.state.stage === 1}
                      hint={`Total (${this.state.numberOfItems} item${
                        this.state.numberOfItems !== 1 ? 's' : ''
                      }): ${Currency(this.state.cart.total)}`}
                    >
                      <input
                        type="hidden"
                        name="items"
                        value={JSON.stringify(this.state.cart.items)}
                      />
                      {this.state.cart.items.map(item => (
                        <div
                          key={'checkout-item-' + item.id}
                          className="w-full flex flex-wrap sm:flex-no-wrap pb-4 border-b border-gray-500 items-center"
                        >
                          <div
                            className="flex-shrink md:flex-shrink flex-grow sm:pr-2 font-semibold">
                            {item.description} @{' '}
                            <span className="text-red-600">
                              {Currency(item.price)}
                            </span>
                          </div>
                          <div
                            className="w-auto flex-shrink-0 flex-grow-0 flex justify-end items-center mt-4 sm:px-2">
                            <button
                              type="button"
                              id={item.id + '-decrement'}
                              className="rounded-full font-bold mr-2 w-8 h-8 flex items-center justify-center border border-red-400 bg-red-100 hover:bg-red-300 focus:bg-red-300"
                              onClick={this.decrementItem}
                            >
                              {item.quantity > 1 ? '-' : '×'}
                            </button>
                            <div className="mx-2 -mt-4">
                              <InputText
                                defaultValue={item.quantity}
                                hideValidationMessage={true}
                                inputId={item.id + '-quantity'}
                                inputSizes={'w-16'}
                                inputType={'number'}
                                setFormValidationState={
                                  this.updateValidationIssues
                                }
                                inputAttributes={{
                                  required: true,
                                  min: 0,
                                  max: item.maxQuantity,
                                  step: 1,
                                }}
                                validationMessages={{
                                  rangeOverflow:
                                    'Enter ' + item.maxQuantity + ' or less',
                                  rangeUnderflow: 'Enter 0 or more',
                                  stepMismatch: 'Enter a round number',
                                  typeMismatch: 'Enter a number',
                                  valueMissing: 'Enter a quantity',
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              className={`rounded-full font-bold ml-2 w-8 h-8 flex items-center justify-center border ${
                                item.quantity < item.maxQuantity
                                  ? `border-green-400 bg-green-100 hover:bg-green-200 focus:bg-green-200`
                                  : `border-gray-600 bg-gray-100 cursor-not-allowed text-gray-500`
                              }`}
                              id={item.id + '-increment'}
                              onClick={this.incrementItem}
                              disabled={item.quantity === item.maxQuantity}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </FieldsetMulti>

                    {/* First and last name */}
                    <FieldsetMulti
                      legend={'What is your name?'}
                      validationIssues={this.state.validationIssues}
                      visible={this.state.stage === 2}
                    >
                      <InputText
                        defaultValue={this.state.cart.firstName}
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
                        defaultValue={this.state.cart.lastName}
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

                    {/* Email address */}
                    <FieldsetText
                      defaultValue={this.state.cart.email}
                      inputId={'email'}
                      inputType={'email'}
                      label={'What is your email address?'}
                      setFormValidationState={this.updateValidationIssues}
                      validationIssues={this.state.validationIssues}
                      visible={this.state.stage === 3}
                      inputAttributes={{
                        autoComplete: 'email',
                        required: true,
                      }}
                      validationMessages={{
                        typeMismatch: 'Enter a valid email address',
                        valueMissing: 'Enter your email address',
                      }}
                    />

                    {/* Payment */}
                    <FieldsetRadios
                      inputAttributes={{
                        required: true,
                      }}
                      legend={'How would you like to pay for your membership?'}
                      hint={
                        'It saves the club some money if you pay by bank transfer'
                      }
                      name={'paymentMethod'}
                      options={[
                        {
                          id: 'paymentMethodBankTransfer',
                          label: 'Bank transfer',
                          value: 'BACS',
                        },
                        {
                          id: 'paymentMethodStripe',
                          label: 'Debit card, credit card or Apple Pay',
                          value: 'Stripe',
                        },
                      ]}
                      setFormValidationState={this.updateValidationIssues}
                      validationMessages={{
                        valueMissing: 'Select a payment method',
                      }}
                      validationIssues={this.state.validationIssues}
                      visible={this.state.stage === 4}
                    />

                    {/* Review */}
                    <FieldsetMulti
                      legend={'Is everything correct?'}
                      hint={
                        'If not, please use the back button to go back and change it.'
                      }
                      validationIssues={this.state.validationIssues}
                      visible={this.state.stage === 5}
                    >
                      <p className="font-semibold">Order</p>
                      {this.state.cart.items.map(item => (
                        <div
                          key={'item-confirm-' + item.id}
                          className="flex items-baseline justify-between py-2 my-2 border-b border-gray-500"
                        >
                          <div
                            className="w-1/12 flex-shrink-0 flex-grow-0 pr-2">
                            {item.quantity}
                          </div>
                          <div
                            className="w-1/12 flex-shrink-0 flex-grow-0 px-2">
                            ×
                          </div>
                          <div className="w-auto flex-shrink flex-grow px-2">
                            {item.description} @{' '}
                            <span className="text-red-600 font-bold">
                              {Currency(item.price)}
                            </span>
                          </div>
                          <div
                            className="w-1/5 text-right font-bold flex-shrink-0 flex-grow-0 pl-2">
                            {Currency(item.quantity * item.price)}
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end items-center py-2">
                        <div className="text-right pr-2">Total</div>
                        <div
                          className="w-1/5 flex-shrink-0 flex-grow-0 text-right font-bold pl-2">
                          {Currency(this.state.cart.total)}
                        </div>
                      </div>
                      <dl>
                        <dt>Name</dt>
                        <dd>
                          {this.state.data.firstName} {this.state.data.lastName}
                        </dd>
                        <dt>Email address</dt>
                        <dd>{this.state.data.email}</dd>
                        <dt>Payment method</dt>
                        <dd>
                          You have opted to pay by
                          {this.state.data.paymentMethod === 'BACS' &&
                          ' bank transfer'}
                          {this.state.data.paymentMethod === 'Stripe' &&
                          ' credit card, debit card or Apple Pay'}
                        </dd>
                      </dl>
                      {this.state.data.paymentMethod === 'Stripe' && (
                        <p>
                          When you click the "Make payment" button, you will be
                          transferred to our Stripe checkout page.
                        </p>
                      )}
                    </FieldsetMulti>

                    {/* Bank payment details */}
                    <FieldsetMulti
                      legend={'Thanks for your order!'}
                      name={'paymentMethod'}
                      setFormValidationState={this.updateValidationIssues}
                      validationIssues={this.state.validationIssues}
                      visible={this.state.stage === 6}
                    >
                      <p>
                        You have opted to pay for your order by{' '}
                        <strong>bank transfer</strong>.
                      </p>
                      <p>
                        Now, please send payment of{' '}
                        <strong>{Currency(this.state.cart.total)}</strong> from
                        your bank account to our account.
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
                  </Form>
                )}
              </StandardContentContainer>
            </Layout>
          )
        }}
      />
    )
  }
}
