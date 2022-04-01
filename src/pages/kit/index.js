import React from 'react'
import * as PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import {graphql} from 'gatsby'
import {Panel, PanelFullWidth, Panels} from '../../components/Panels'
import {CardCTA} from '../../components/Card'
import {CallToActionText} from '../../components/CallToAction'
import {kebabCase} from 'lodash'
import Currency from '../../components/Currency'

const KitIndex = ({data, location}) => {
  const regularKit = data.regular.edges
    .reduce((acc, {node}) => {
      const productIdx = acc.findIndex(({title}) => {
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

  return (
    <Layout title={'Kit'}
            description={'Order your Manchester YMCA Harriers club kit here. We have vests, T-shirts, hoodies and bobble hats in stock.'}
            path={'/kit'} location={location}>
      <StandardContentContainer>
        <h1 className="heading-1">Kit</h1>
        <Panels>
          <PanelFullWidth>
            <div className="content panel black-bottom">
              <h2>Current kit</h2>
              <p>The pinnacle of running fashion!</p>
              <p>If you are a new first-claim member, you get a £5 discount off your first vest! Please speak to a member
                of the Committee about getting your first vest.</p>
            </div>
          </PanelFullWidth>
        </Panels>
        <Panels>
          {regularKit.map(({title, image, price, slug}) => (
            <Panel key={slug}>
              <CardCTA
                to={slug}
                title={title}
                image={image}
                borderColorClassName={`border-gray-400`}
                borderColorHoverClassName={`border-red-manyharrier`}
                callToAction={<CallToActionText title={'Order now'}/>}
              >
                {Currency(price)}
              </CardCTA>
            </Panel>
          ))}
        </Panels>
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
  }
`
