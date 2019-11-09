import React from 'react'
import * as PropTypes from 'prop-types'

const emptyCart = {
  items: [],
  total: 0,
  firstName: null,
  lastName: null,
  email: null,
}

const cartKey = 'cart'

export const CheckoutAvailable = () => {
  if (!StorageAvailable('sessionStorage')) {
    return false
  }

  return NumberOfItems() > 0
}

export const AddToCart = ({
  id,
  sku,
  quantity,
  maxQuantity,
  price,
  description,
  firstName,
  lastName,
  email,
}) => {
  const cart = GetCart()

  const sameItemInCart = cart.items.filter(item => item.id === id)
  if (sameItemInCart.length === maxQuantity) {
    return
  }

  if (sameItemInCart.id === id) {
    cart.items = cart.items.map(item => {
      if (item.id !== id) {
        return item
      }

      item.quantity += quantity
      return item
    })
  } else {
    cart.items.push({
      id,
      sku,
      quantity,
      maxQuantity,
      price,
      description,
    })
  }

  if (firstName && !cart.firstName) {
    cart.firstName = firstName
  }

  if (lastName && !cart.lastName) {
    cart.lastName = lastName
  }

  if (email && !cart.email) {
    cart.email = email
  }

  cart.total = cart.total + quantity * price

  window.sessionStorage.setItem(cartKey, JSON.stringify(cart))
}

export const RemoveFromCart = ({ id, quantity }) => {
  const cart = GetCart()

  let price = 0

  cart.items = cart.items
    .map(item => {
      if (item.id !== id) {
        return item
      }

      price = item.price
      quantity = Math.max(Math.min(item.quantity, quantity), 0)
      item.quantity = item.quantity - quantity
      return item
    })
    .filter(item => item.quantity > 0)

  cart.total = cart.total - quantity * price

  if (cart.items.length === 0) {
    cart.firstName = null
    cart.lastName = null
    cart.email = null
  }

  window.sessionStorage.setItem(cartKey, JSON.stringify(cart))
}

export const UpdateQuantity = ({ id, quantity }) => {
  const cart = GetCart()

  let total = 0

  cart.items = cart.items.map(item => {
    if (item.id !== id) {
      return item
    }

    item.quantity = Math.max(quantity, 0)
    total += item.quantity * item.price
    return item
  })

  cart.total = total

  window.sessionStorage.setItem(cartKey, JSON.stringify(cart))
}

export const EmptyCart = () => {
  window.sessionStorage.setItem(cartKey, JSON.stringify(emptyCart))
}

export const GetCart = () => {
  return JSON.parse(
    window.sessionStorage.getItem(cartKey) || JSON.stringify(emptyCart)
  )
}

export const GetSkuItems = sku => {
  const cart = GetCart()

  return cart.items.filter(item => item.sku === sku)
}

export const StorageAvailable = type => {
  let storage
  try {
    storage = window[type]
    var x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0)
    )
  }
}

export const NumberOfItems = () => {
  const cart = GetCart()

  return cart.items.reduce((acc, item) => {
    acc += item.quantity
    return acc
  }, 0)
}

export const NumberOfLines = () => {
  const cart = GetCart()

  return cart.items.length
}

StorageAvailable.propTypes = {
  type: PropTypes.oneOf(['localStorage', 'sessionStorage']),
}
