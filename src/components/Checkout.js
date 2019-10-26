import React from "react"
import * as PropTypes from "prop-types"

class Checkout extends React.Component {
  componentDidMount() {
    const stripePublishableKey = process.env.GATSBY_STRIPE_PUBLISHABLE_KEY

    if (!stripePublishableKey) {
      throw new Error("Stripe publishable key not set")
    }

    this.stripe = window.stripe(stripePublishableKey)
  }

  async redirectToCheckout(event) {
    event.preventDefault()
    const { error } = await this.stripe.redirectToCheckout({
      items: this.props.items,
      successUrl: this.props.successUrl,
      cancelUrl: this.props.cancelUrl,
    })
    if (error) {
      console.warn("Error:", error)
    }
  }

  render() {
    return (
      <button className="button is-success">Foo</button>
    )
  }
}

Checkout.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    sku: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  successUrl: PropTypes.string.isRequired,
  cancelUrl: PropTypes.string.isRequired,
}

export default Checkout
