import React from 'react'

import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import { H1 } from '../../components/Headings'

export default class SessionsIndexPage extends React.Component {
  render() {
    return (
      <Layout path={'/sessions'}>
        <StandardContentContainer>
          <H1 title={'Sessions'} />
        </StandardContentContainer>
      </Layout>
    )
  }
}
