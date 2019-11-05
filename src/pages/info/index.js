import React from 'react'

import Layout from '../../components/Layout'
import StandardContentContainer
  from "../../components/StandardContentContainer";
import {H1} from "../../components/Headings";

export default class InfoIndexPage extends React.Component {
  render() {
    return (
      <Layout path={"/info"}>
        <StandardContentContainer>
          <H1 title={"Info"} />
        </StandardContentContainer>
      </Layout>
    )
  }
}
