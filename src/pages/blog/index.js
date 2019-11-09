import React from 'react'

import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import { H1 } from '../../components/Headings'

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout path={'/blog'}>
        <StandardContentContainer>
          <H1 title={'Blog'} />
        </StandardContentContainer>
      </Layout>
    )
  }
}
