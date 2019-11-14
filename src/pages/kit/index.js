import React from 'react'
import * as PropTypes from "prop-types";
import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import {graphql} from "gatsby";
import {Panel, Panels} from "../../components/Panels";
import {CardCTA} from "../../components/Card";
import {CallToActionText} from "../../components/CallToAction";

const KitIndex = ({data}) => {
  const kitTypes = data.allStripeSku.edges.reduce((acc, {node}) => {
    if (node.inventory.type === "finite" && node.inventory.quantity === 0) {
      return acc
    }
    let key = ""
    if (node.attributes.gender !== "Unisex") {
      key += node.attributes.gender
    }
    key += node.attributes.name
    if (node.attributes.clearance === "true") {
      key += " (Clearance)"
    }
    if (!acc[key]) {
      acc[key] = 1
    } else {
      acc[key]++
    }
    return acc
  }, {})

  return (
    <Layout path={'/kit'}>
      <StandardContentContainer>
        <h1 className="heading-1">Kit</h1>
        <Panels>
          {kitTypes.map(({title, image, slug}) => (
            <Panel key={slug}>
              <CardCTA to={slug} title={title} image={image}
                       borderColorClassName={`border-gray-400`}
                       borderColorHoverClassName={`border-red-manyharrier`}
                       callToAction={<CallToActionText
                         title={"More details"} />} />
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
    allStripeSku(filter: {product: {name: {eq: "Kit"}}}) {
      edges {
        node {
          attributes {
            name
            gender
            clearance
          }
          inventory {
            quantity
          }
          price
        }
      }
    }
  }
`
