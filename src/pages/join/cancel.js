import React from 'react'
import Layout from '../../components/Layout'
import PageTitle from "../../components/PageTitle";
import {Link} from "gatsby"

const Cancel = () => (
  <Layout>
    <section className="section">
      <div className="container">
        <div className="content">
          <PageTitle title={"You did not pay for your membership"} />
          <p>If this is a mistake, please <Link to={"/contact"}>get in touch</Link> with us as soon as possible.</p>
        </div>
      </div>
    </section>
  </Layout>
)

export default Cancel
