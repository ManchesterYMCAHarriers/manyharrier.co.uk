import React from 'react'
import * as PropTypes from 'prop-types'
import {graphql, Link} from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import Hero from "../components/Hero";
import {PanelFullWidth, Panels} from "../components/Panels";
import {
  AddToCart, GetCart, RemoveFromCart,
  StorageAvailable,
} from "../components/Cart";
import Currency from "../components/Currency";
import InputText from "../components/InputText";
import {
  CallToActionBackButton, CallToActionLink
} from "../components/CallToAction";

export class KitPageTemplate extends React.Component {
  constructor(props) {
    super(props)

    const storageAvailable = StorageAvailable('sessionStorage')

    let items
    let itemsInCart

    if (storageAvailable) {
      const stripeSkus = this.props.stripeSkus

      items = stripeSkus.reduce((acc, {products}) => {
        products.forEach(product => {
          acc[product.id] = product
        })
        return acc
      }, {})

      const cart = GetCart()

      itemsInCart = cart.items.reduce((acc, {id, quantity}) => {
        acc[id] = quantity
        return acc
      }, {})
    } else {
      items = {}
      itemsInCart = {}
    }

    this.state = {
      items: items,
      itemsInCart: itemsInCart,
      storageAvailable: storageAvailable,
      validationIssues: [],
    }
  }

  decrementItem = ev => {
    ev.preventDefault()
    const itemId = ev.currentTarget.id.replace('-decrement', '')
    const quantityInput = document.getElementById(itemId + '-quantity')
    if (quantityInput.value.search(/^[\d]+$/) > -1) {
      const quantity = parseInt(quantityInput.value, 10)
      if (quantity > 1) {
        quantityInput.value = quantity - 1
        quantityInput.dispatchEvent(new Event('change'))
      }
    }
  }

  incrementItem = ev => {
    ev.preventDefault()
    const itemId = ev.currentTarget.id.replace('-increment', '')
    const quantityInput = document.getElementById(itemId + '-quantity')
    if (quantityInput.value.search(/^[\d]+$/) > -1) {
      const quantity = parseInt(quantityInput.value, 10)
      quantityInput.value = quantity + 1
      quantityInput.dispatchEvent(new Event('change'))
    }
  }

  addToCart = ev => {
    ev.preventDefault()
    const itemId = ev.currentTarget.id.replace('-addToCart', '')
    const quantityInput = document.getElementById(itemId + '-quantity')
    if (quantityInput.value.search(/^[\d]+$/) > -1) {
      const quantity = parseInt(quantityInput.value, 10)
      if (quantity > 0) {
        AddToCart({
          id: itemId,
          sku: this.state.items[itemId].sku,
          quantity: quantity,
          price: this.state.items[itemId].price,
          description: this.state.items[itemId].name,
        })

        const itemsInCart = this.state.itemsInCart
        itemsInCart[itemId] = itemsInCart[itemId] ? itemsInCart[itemId] += quantity : itemsInCart[itemId] = quantity

        this.setState({
          itemsInCart
        })
      }
    }
  }

  removeFromCart = ev => {
    ev.preventDefault()
    const itemId = ev.currentTarget.id.replace('-remove', '')

    const itemsInCart = this.state.itemsInCart

    RemoveFromCart({
      id: itemId,
      quantity: itemsInCart[itemId],
    })

    delete itemsInCart[itemId]

    this.setState({
      itemsInCart
    })
  }

  updateValidationIssues = ({id, message}) => {
    const validationIssues = this.state.validationIssues
    // Update/remove existing validation issues
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

    // Add new validation issue
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
      productName,
      heroImage,
      stripeSkus,
    } = this.props

    if (!this.state.storageAvailable) {
      return (
        <StandardContentContainer>
          {heroImage ? <Hero fluidImage={heroImage} title={productName} /> :
            <h1 className="heading-1">{productName}</h1>}
          <Panels>
            <PanelFullWidth>
              <div className="content panel black-bottom">
                <p>Sorry - our shopping cart is not supported on your device.</p>
              </div>
            </PanelFullWidth>
          </Panels>
        </StandardContentContainer>
      )
    }

    return (
      <StandardContentContainer>
        {heroImage ? <Hero fluidImage={heroImage} title={productName} /> :
          <h1 className="heading-1">{productName}</h1>}
        <Panels>
          {stripeSkus.map(({gender, products}, i) => (
            <PanelFullWidth key={gender}>
              <div className={`panel ${i % 2 === 0 ? `red` : `black`}-bottom`}>
              <h2 className="heading-2 mb-4">{gender}</h2>
              {products.map(({id, price, name}) => (
                <div
                  key={id}
                  className="w-full flex flex-wrap sm:flex-no-wrap pb-4 border-b border-gray-500 items-center mt-4"
                >
                  <div
                    className="w-full sm:w-auto flex-shrink flex-grow sm:pr-2">
                    <div className="font-semibold">{name} @{' '}
                    <span className="text-red-600">
                      {Currency(price)}
                    </span>
                    </div>
                    {this.state.itemsInCart[id] > 0 && (
                      <div className="flex items-baseline mt-2 mb-2 sm:mb-0">
                        <div className="font-light ml-2 mr-8"><span className="font-semibold">{this.state.itemsInCart[id]}</span> in cart</div>
                        <CallToActionBackButton id={id + "-remove"} className={"mr-8"} onClick={this.removeFromCart} title={"Remove"} highlighted={"-"}/>
                        <CallToActionLink to="/checkout" title={"Checkout"} />
                      </div>
                    )}
                  </div>
                  <div
                    className="w-auto flex-shrink-0 flex-grow sm:flex-grow-0 justify-between items-center mt-4 sm:mt-0 sm:px-2 flex">
                    <div className="flex flex-shrink-0 flex-grow-0 items-center">
                      <button
                        type="button"
                        id={id + '-decrement'}
                        className="rounded-full font-bold mr-2 w-8 h-8 flex items-center justify-center border border-red-400 bg-red-100 hover:bg-red-300 focus:bg-red-300"
                        onClick={this.decrementItem}
                      >-
                      </button>
                      <div className="mx-2 -mt-4">
                        <InputText
                          defaultValue="0"
                          hideValidationMessage={true}
                          inputId={id + '-quantity'}
                          inputSizes={'w-16'}
                          inputType={'number'}
                          setFormValidationState={
                            this.updateValidationIssues
                          }
                          inputAttributes={{
                            required: true,
                            min: 0,
                            step: 1,
                          }}
                          validationMessages={{
                            rangeUnderflow: 'Enter 0 or more',
                            stepMismatch: 'Enter a round number',
                            typeMismatch: 'Enter a number',
                            valueMissing: 'Enter a quantity',
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className={`rounded-full font-bold ml-2 w-8 h-8 flex items-center justify-center border border-green-400 bg-green-100 hover:bg-green-200 focus:bg-green-200`}
                        id={id + '-increment'}
                        onClick={this.incrementItem}
                      >+
                      </button>
                    </div>
                    <div className="flex-shrink-0 flex-grow-0">
                      <CallToActionBackButton type={"button"}
                                              title={"Add to cart"}
                                              id={id + '-addToCart'}
                                              onClick={this.addToCart}
                                              highlighted={"+"}
                                              className="ml-8" />
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </PanelFullWidth>
          ))}
        </Panels>
      </StandardContentContainer>
    )
  }
}

KitPageTemplate.propTypes = {
  productName: PropTypes.string.isRequired,
  heroImage: PropTypes.object,
  stripeSkus: PropTypes.arrayOf(PropTypes.shape({
    gender: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      clearance: PropTypes.bool.isRequired,
    })),
  }))
}

const Kit = ({data, pageContext}) => {
  const {siteMetadata: title, allStripeSku: skus} = data
  const {slug} = pageContext

  const productName = skus.edges[0].node.product.name

  const stripeSkus = skus.edges.reduce((acc, {node}) => {
    const genderItemsIndex = acc.findIndex(vals => {
      return vals.gender === node.attributes.gender
    })

    if (genderItemsIndex === -1) {
      acc.push({
        gender: node.attributes.gender,
        products: [
          {
            id: node.id,
            price: node.price,
            name: node.attributes.name,
            size: node.attributes.size,
            gender: node.attributes.gender,
            clearance: node.attributes.clearance === "true",
          }
        ]
      })
    } else {
      acc[genderItemsIndex].products.push({
        id: node.id,
        price: node.price,
        name: node.attributes.name,
        size: node.attributes.size,
        gender: node.attributes.gender,
        clearance: node.attributes.clearance === "true",
      })
    }

    return acc
  }, [])

  const heroImage = null

  return (
    <Layout path={slug}>
      <KitPageTemplate
        siteTitle={title}
        productName={productName}
        heroImage={heroImage}
        stripeSkus={stripeSkus}
      />
    </Layout>
  )
}

Kit.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Kit

export const kitQuery = graphql`
  query KitPage($productName: String!, $clearance: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allStripeSku(filter: {active: {eq: true}, product: {name: {eq: $productName}} attributes: {clearance: {eq: $clearance}}}, sort: {order: ASC, fields: attributes___name}) {
      edges {
        node {
          attributes {
            name
            gender
            size
            clearance
          }
          id
          price
          product {
            name
          }
        }
      }
    }
  }
`
