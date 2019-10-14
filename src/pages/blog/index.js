import React from 'react'

import Layout from '../../components/Layout'
import PageTitle from "../../components/PageTitle";

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <PageTitle title={"The Blog"} />
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}
