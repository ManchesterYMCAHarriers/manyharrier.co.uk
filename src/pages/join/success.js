import React from 'react'
import Layout from '../../components/Layout'
import PageTitle from "../../components/PageTitle";

const Success = () => (
  <Layout>
    <section className="section">
      <div className="container">
        <div className="content">
          <PageTitle title={"Thanks for joining us!"} />
          <p>Welcome to the club!</p>
        </div>
      </div>
    </section>
  </Layout>
)

export default Success
