import React from 'react'

import Layout from '../../components/Layout'
import StandardContentContainer
  from "../../components/StandardContentContainer";
import {H1} from "../../components/Headings";

export default class VenuesIndexPage extends React.Component {
  render() {
    return (
      <Layout path={"/venues"}>
        <StandardContentContainer>
          <H1 title={"Venues"} />
        </StandardContentContainer>
      </Layout>
    )
  }
}
