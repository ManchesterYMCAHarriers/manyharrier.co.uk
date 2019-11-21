import React from 'react'
import * as PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import { graphql } from 'gatsby'
import { Panel, PanelFullWidth, Panels } from '../../components/Panels'
import { CardCTA } from '../../components/Card'
import { CallToActionText } from '../../components/CallToAction'
import { kebabCase } from 'lodash'
import Currency from '../../components/Currency'

const KitIndex = ({ data }) => {
  const regularKit = data.regular.edges
    .reduce((acc, { node }) => {
      const productIdx = acc.findIndex(({ title }) => {
        return title === node.product.name
      })
      if (productIdx === -1) {
        acc.push({
          title: node.product.name,
          slug: `/kit/${kebabCase(node.product.name)}`,
          price: node.price,
          variants: 1,
        })
      } else {
        acc[productIdx].variants += 1
      }
      return acc
    }, [])
    .sort((a, b) => {
      if (a.variants === b.variants) {
        return a.title < b.title ? -1 : 1
      }
      return a.variants > b.variants ? -1 : 1
    })

  const clearanceKit = data.clearance.edges
    .reduce((acc, { node }) => {
      const productIdx = acc.findIndex(({ title }) => {
        return title === node.product.name
      })
      if (productIdx === -1) {
        acc.push({
          title: node.product.name,
          slug: `/kit/clearance/${kebabCase(node.product.name)}`,
          price: node.price,
          variants: 1,
        })
      } else {
        acc[productIdx].variants += 1
      }
      return acc
    }, [])
    .sort((a, b) => {
      if (a.variants === b.variants) {
        return a.title < b.title ? -1 : 1
      }
      return a.variants > b.variants ? -1 : 1
    })

  return (
    <Layout path={'/kit'}>
      <StandardContentContainer>
        <h1 className="heading-1">Kit</h1>
        <Panels>
          <PanelFullWidth>
            <div className="content panel black-bottom">
              <h2>Current kit</h2>
              <p>The pinnacle of running fashion!</p>
            </div>
          </PanelFullWidth>
        </Panels>
        <Panels>
          {regularKit.map(({ title, image, price, slug }) => (
            <Panel key={slug}>
              <CardCTA
                to={slug}
                title={title}
                image={image}
                borderColorClassName={`border-gray-400`}
                borderColorHoverClassName={`border-red-manyharrier`}
                callToAction={<CallToActionText title={'Order now'} />}
              >
                {Currency(price)}
              </CardCTA>
            </Panel>
          ))}
        </Panels>
        {clearanceKit.length > 0 && (
          <>
            <Panels>
              <PanelFullWidth>
                <div className="content panel black-bottom">
                  <h2>Retro kit</h2>
                  <p>
                    Kit that has stood the test of time in our store
                    cupboard...!
                  </p>
                  <p>All items are decent quality - grab yourself a bargain!</p>
                </div>
              </PanelFullWidth>
            </Panels>
            <Panels>
              {clearanceKit.map(({ title, image, price, slug }) => (
                <Panel key={slug}>
                  <CardCTA
                    to={slug}
                    title={title}
                    image={image}
                    borderColorClassName={`border-gray-400`}
                    borderColorHoverClassName={`border-red-manyharrier`}
                    callToAction={<CallToActionText title={'Buy now'} />}
                  >
                    Priced to clear -{' '}
                    <span className="font-semibold text-red-manyharrier">
                      {Currency(price)}
                    </span>
                  </CardCTA>
                </Panel>
              ))}
            </Panels>
          </>
        )}
      </StandardContentContainer>
    </Layout>
  )
}

KitIndex.propTypes = {
  data: PropTypes.object,
}

export default KitIndex

export const kitIndexQuery = graphql`
  query KitIndexQuery {
    regular: allStripeSku(
      filter: {
        active: { eq: true }
        attributes: { category: { eq: "Kit" }, clearance: { eq: "false" } }
      }
      sort: { order: ASC, fields: product___name }
    ) {
      edges {
        node {
          attributes {
            name
            gender
            clearance
          }
          price
          product {
            name
          }
        }
      }
    }
    clearance: allStripeSku(
      filter: {
        active: { eq: true }
        attributes: { category: { eq: "Kit" }, clearance: { eq: "true" } }
      }
      sort: { order: ASC, fields: product___name }
    ) {
      edges {
        node {
          attributes {
            name
            gender
            clearance
          }
          price
          product {
            name
          }
        }
      }
    }
  }
`
