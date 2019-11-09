import React from 'react'

import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import { H1 } from '../../components/Headings'

export default class RoutesIndexPage extends React.Component {
  render() {
    return (
      <Layout path={'/routes'}>
        <StandardContentContainer>
          <H1 title={'Routes'} />
        </StandardContentContainer>
      </Layout>
    )
  }
}
