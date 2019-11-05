import React from 'react'

import Layout from '../../components/Layout'
import StandardContentContainer
  from "../../components/StandardContentContainer";
import {H1} from "../../components/Headings";

export default class ChampionshipsIndexPage extends React.Component {
  render() {
    return (
      <Layout path={"/championships"}>
        <StandardContentContainer>
          <H1 title={"Championships"} />
        </StandardContentContainer>
      </Layout>
    )
  }
}
