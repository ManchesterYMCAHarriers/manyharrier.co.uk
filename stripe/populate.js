const Moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { stat, readdir, readFile } = require('fs')
const { join } = require('path')
const { isEqual, isUndefined } = require('lodash')
const Bottleneck = require('bottleneck')

async function populate() {
  const limiter = new Bottleneck({
    minTime: 50,
  })

  try {
    // List all products
    const { data: stripeProducts } = await limiter.schedule(() =>
      listStripeProducts()
    )
    const productsMaster = await readMaster(join(__dirname, 'products'))

    const createdProducts = []
    let updatedProducts = 0

    // Create new products / update existing products
    for (let product of productsMaster) {
      const stripeIndex = stripeProducts.findIndex(stripeProduct => {
        return stripeProduct.name === product.name
      })

      if (stripeIndex === -1) {
        console.log(`Creating product ${product.name}...`)
        try {
          const createdProduct = await limiter.schedule(() =>
            createStripeProduct(product)
          )
          createdProducts.push(createdProduct)
          console.log(`Created product ${product.name}`)
        } catch (err) {
          console.error(`Failed to create product ${product.name}`, err)
        }
        continue
      }

      const stripeProduct = stripeProducts[stripeIndex]

      const productUpdate = {}

      for (let [key, masterValue] in Object.entries(product)) {
        if (!isEqual(stripeProduct[key], masterValue)) {
          productUpdate[key] = masterValue
        }
      }

      if (Object.keys(productUpdate).length > 0) {
        console.log(`Updating product ${product.name}...`)
        try {
          await limiter.schedule(() =>
            updateStripeProduct(product.id, productUpdate)
          )
          updatedProducts++
          console.log(`Updated product ${product.name}`)
        } catch (err) {
          console.error(`Failed to update product ${product.name}`, err)
        }
        continue
      }

      console.log(`No changes for product ${product.name}`)
    }

    // Build product ID to product name relationship
    let stripeProductIDs = stripeProducts.reduce((accumulator, product) => {
      accumulator[product.name] = product.id
      return accumulator
    }, {})

    // Add new products to product ID
    stripeProductIDs = createdProducts.reduce((accumulator, product) => {
      accumulator[product.name] = product.id
      return accumulator
    }, stripeProductIDs)

    // List all SKUs
    const { data: stripeSkus } = await limiter.schedule(() => listStripeSkus())
    const skusMaster = await readMaster(join(__dirname, 'skus'))

    let updatedSkus = 0
    let createdSkus = 0

    const now = Moment.utc()

    // Create new SKUs / update existing SKUs
    for (let {
      active,
      activeFrom,
      activeUntil,
      productName,
      sku,
    } of skusMaster) {
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

      // Don't populate price or name here... we should always have a price and a name!
      sku.active = active
      sku.currency = sku.currency || 'gbp'
      sku.inventory = sku.inventory || {
        type: 'infinite',
      }
      sku.product = stripeProductIDs[productName]

      const stripeIndex = stripeSkus.findIndex(stripeSku => {
        return stripeSku.attributes.name === sku.attributes.name
      })

      // Create new SKUs
      // Ignore if unavailable

      if (stripeIndex === -1) {
        if (sku.active === true) {
          console.log(`Creating SKU ${sku.attributes.name}...`)
          try {
            await limiter.schedule(() => createStripeSku(sku))
            createdSkus++
            console.log(`Created SKU ${sku.attributes.name}`)
          } catch (err) {
            console.error(`Failed to create SKU ${sku.attributes.name}`, err)
          }
        } else {
          console.log(`Skipping inactive SKU ${sku.attributes.name}`)
        }
        continue
      }

      const stripeSku = stripeSkus[stripeIndex]

      const skuUpdate = {}

      for (let [key, masterValue] in Object.entries(sku)) {
        if (!isEqual(stripeSku[key], masterValue)) {
          if (key === 'inventory') {
            // Don't update stock from raw load
            if (stripeSku[key].type === masterValue.type) {
              continue
            }
          }
          skuUpdate[key] = masterValue
        }
      }

      if (Object.keys(skuUpdate).length > 0) {
        try {
          console.log(`Updating SKU ${sku.attributes.name}`)
          await limiter.schedule(() => updateStripeSku(sku.id, skuUpdate))
          updatedSkus++
          console.log(`Updated SKU ${sku.attributes.name}`)
        } catch (err) {
          console.error(`Failed to update SKU ${sku.attributes.name}`, err)
        }
        continue
      }

      console.log(`No changes for SKU ${sku.attributes.name}`)
    }

    console.log('created products: ' + createdProducts.length)
    console.log('updated products: ' + updatedProducts)
    console.log('created SKUs: ' + createdSkus)
    console.log('updated SKUs: ' + updatedSkus)
  } catch (err) {
    console.error('Error populating Stripe data', err)
  }
}

async function deleteAll() {
  const limiter = new Bottleneck({
    minTime: 50,
  })

  let deletedSkus = 0
  let deletedProducts = 0

  try {
    const { data: stripeSkus } = await limiter.schedule(() => listStripeSkus())
    for (let { id } of stripeSkus) {
      try {
        console.log(`Deleting SKU ${id}`)
        await limiter.schedule(() => deleteStripeSku(id))
        deletedSkus++
        console.log(`Deleted SKU ${id}`)
      } catch (err) {
        console.error(`Failed to delete SKU ${id}`, err)
      }
    }

    const { data: stripeProducts } = await limiter.schedule(() =>
      listStripeProducts()
    )
    for (let { id } of stripeProducts) {
      try {
        console.log(`Deleting product ${id}`)
        await limiter.schedule(() => deleteStripeProduct(id))
        deletedProducts++
        console.log(`Deleted product ${id}`)
      } catch (err) {
        console.error(`Failed to delete product ${id}`)
      }
    }

    console.log(`Deleted ${deletedSkus} SKUs`)
    console.log(`Deleted ${deletedProducts} products`)
  } catch (err) {
    console.error(err)
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

function deleteStripeProduct(id) {
  return new Promise((resolve, reject) => {
    stripe.products.del(id, (err, confirmation) => {
      if (err) {
        reject(err)
      } else {
        resolve(confirmation.id)
      }
    })
  })
}

function listStripeProducts() {
  return new Promise((resolve, reject) => {
    stripe.products.list({ limit: 100 }, function(err, products) {
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

function deleteStripeSku(id) {
  return new Promise((resolve, reject) => {
    stripe.skus.del(id, (err, confirmation) => {
      if (err) {
        reject(err)
      } else {
        resolve(confirmation.id)
      }
    })
  })
}

function listStripeSkus() {
  return new Promise((resolve, reject) => {
    stripe.skus.list({ limit: 100 }, function(err, skus) {
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

module.exports = { populate, deleteAll }
