const Moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { stat, readdir, readFile } = require('fs')
const { join } = require('path')
const { isEqual, isUndefined } = require('lodash')

async function populate() {
  try {
    // List all products
    const { data: stripeProducts } = await listStripeProducts()
    const productsMaster = await readMaster(join(__dirname, 'products'))

    const productUpdates = []
    const createNewProducts = []

    // Create new products / update existing products
    productsMaster.forEach(product => {
      const stripeIndex = stripeProducts.findIndex(stripeProduct => {
        return stripeProduct.name === product.name
      })

      if (stripeIndex === -1) {
        createNewProducts.push(createStripeProduct(product))
        return
      }

      const stripeProduct = stripeProducts[stripeIndex]

      const productUpdate = {}

      for (let [key, masterValue] in Object.entries(product)) {
        if (!isEqual(stripeProduct[key], masterValue)) {
          productUpdate[key] = masterValue
        }
      }

      if (Object.keys(productUpdate).length > 0) {
        productUpdates.push(updateStripeProduct(product.id, productUpdate))
      }
    })

    const updateProductResults = await Promise.all(productUpdates)
    const createNewProductResults = await Promise.all(createNewProducts)

    // Build product ID to product name relationship
    let stripeProductIDs = stripeProducts.reduce((accumulator, product) => {
      accumulator[product.name] = product.id
      return accumulator
    }, {})

    // Add new products to product ID
    stripeProductIDs = createNewProductResults.reduce(
      (accumulator, product) => {
        accumulator[product.name] = product.id
        return accumulator
      },
      stripeProductIDs
    )

    // List all SKUs
    const { data: stripeSkus } = await listStripeSkus()
    const skusMaster = await readMaster(join(__dirname, 'skus'))

    const updateSkus = []
    const createNewSkus = []

    const now = Moment.utc()

    // Create new SKUs / update existing SKUs
    skusMaster.forEach(skuContainer => {
      let {
        active,
        activeFrom,
        activeUntil,
        name,
        productName,
        sku,
      } = skuContainer

      if (activeFrom) {
        activeFrom = Moment.utc(activeFrom)
      }

      if (activeUntil) {
        activeUntil = Moment.utc(activeUntil)
      }

      if (isUndefined(active)) {
        if (activeFrom && now.isBefore(activeFrom)) {
          active = false
        } else {
          active = !(activeUntil && now.isAfter(activeUntil))
        }
      }

      sku.attributes = sku.attributes || {}
      sku.attributes.name = name
      sku.active = active
      // Don't populate price here... we should always have a price!
      sku.currency = sku.currency || 'gbp'
      sku.inventory = sku.inventory || {
        type: 'infinite',
      }
      sku.product = stripeProductIDs[productName]

      const stripeIndex = stripeSkus.findIndex(stripeSku => {
        return stripeSku.attributes.name === name
      })

      // Create new SKUs
      // Ignore if unavailable

      if (stripeIndex === -1) {
        if (sku.active === true) {
          createNewSkus.push(createStripeSku(sku))
        }
        return
      }

      const stripeSku = stripeSkus[stripeIndex]

      const skuUpdate = {}

      for (let [key, masterValue] in Object.entries(sku)) {
        if (!isEqual(stripeSku[key], masterValue)) {
          skuUpdate[key] = masterValue
        }
      }

      if (Object.keys(skuUpdate).length > 0) {
        updateSkus.push(updateStripeSku(sku.id, skuUpdate))
      }
    })

    const updateSkusResults = await Promise.all(updateSkus)
    const createNewSkusResults = await Promise.all(createNewSkus)

    createNewProductResults.forEach(createdProduct => {
      console.log('created product: ' + createdProduct.name)
    })

    updateProductResults.forEach(updatedProduct => {
      console.log('updated product: ' + updatedProduct.name)
    })

    createNewSkusResults.forEach(createdSku => {
      console.log('created SKU: ' + createdSku.attributes.name)
    })

    updateSkusResults.forEach(updatedSku => {
      console.log('updated SKU: ' + updatedSku.attributes.name)
    })

    console.log('created products: ' + createNewProductResults.length)
    console.log('updated products: ' + updateProductResults.length)
    console.log('created SKUs: ' + createNewSkusResults.length)
    console.log('updated SKUs: ' + updateSkusResults.length)
  } catch (err) {
    console.error('Error populating Stripe data', err)
  }
}

function createStripeProduct(data) {
  return new Promise((resolve, reject) => {
    stripe.products.create(data, (err, product) => {
      if (err) {
        reject(err)
      } else {
        resolve(product)
      }
    })
  })
}

function listStripeProducts() {
  return new Promise((resolve, reject) => {
    stripe.products.list(function(err, products) {
      if (err) {
        reject(err)
        return
      }
      resolve(products)
    })
  })
}

function updateStripeProduct(id, data) {
  return new Promise((resolve, reject) => {
    stripe.products.update(id, data, function(err, product) {
      if (err) {
        reject(err)
      }

      resolve(product)
    })
  })
}

function createStripeSku(data) {
  return new Promise((resolve, reject) => {
    stripe.skus.create(data, (err, sku) => {
      if (err) {
        reject(err)
      } else {
        resolve(sku)
      }
    })
  })
}

function listStripeSkus() {
  return new Promise((resolve, reject) => {
    stripe.skus.list(function(err, skus) {
      if (err) {
        reject(err)
        return
      }
      resolve(skus)
    })
  })
}

function updateStripeSku(id, data) {
  return new Promise((resolve, reject) => {
    stripe.skus.update(id, data, function(err, sku) {
      if (err) {
        reject(err)
      }

      resolve(sku)
    })
  })
}

function readMaster(path) {
  const items = []
  return readDirectory(path)
    .then(files => {
      const promises = []
      files.forEach(file => {
        promises.push(
          isFile(join(path, file))
            .then(file => {
              if (!isFile) {
                return Promise.resolve()
              }

              return file
            })
            .then(file => {
              return readJson(file).then(item => {
                item.name = file.substring(
                  file.lastIndexOf('/') + 1,
                  file.lastIndexOf('.json')
                )
                items.push(item)
              })
            })
        )
      })

      return Promise.all(promises)
    })
    .then(() => {
      return items
    })
}

function readDirectory(dir) {
  return new Promise((resolve, reject) => {
    readdir(dir, (err, files) => {
      if (err) {
        reject(err)
        return
      }

      resolve(files)
    })
  })
}

function isFile(file) {
  return new Promise((resolve, reject) => {
    stat(file, (err, stats) => {
      if (err) {
        reject(err)
        return
      }

      if (stats.isFile()) {
        resolve(file)
        return
      }
      resolve(false)
    })
  })
}

function readJson(file) {
  return new Promise((resolve, reject) => {
    readFile(file, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      resolve(JSON.parse(data.toString()))
    })
  })
}

module.exports = populate
