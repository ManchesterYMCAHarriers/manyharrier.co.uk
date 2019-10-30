import React from 'react'
import Layout from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import SecondaryTitle from "../../components/SecondaryTitle";

const Success = () => (
  <Layout>
    <section className="section">
      <div className="container">
        <div className="content">
          <PageTitle title={'Welcome to the Manchester YMCA Harriers!'}
                     subtitle={"Thanks for joining us!"} />
          <p>We'll start processing your membership right away!</p>
          <SecondaryTitle title={"What happens now?"} />
          <p>Our Club Secretary will register you as an athlete with England
            Athletics and in the next few weeks they will send you a welcome
            pack which contains - amongst other things - your England Athletics
            membership card. Your membership card will have your England
            Athletics registration number on it, which you may need to provide
            when entering races to receive a discount.</p>
          <p>If you are looking to represent the Club in any races, please
            pick up a club vest or T-shirt at any Thursday evening group run.
            Remember - your first vest or T-shirt is free of charge!</p>
        </div>
      </div>
    </section>
  </Layout>
)

export default Success
