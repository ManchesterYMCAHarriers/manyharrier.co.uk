import React from 'react'
import Layout from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import SecondaryTitle from '../../components/SecondaryTitle'

const SuccessSecondClaim = () => (
  <Layout>
    <section className="section">
      <div className="container">
        <div className="content">
          <PageTitle
            title={'Welcome to the Manchester YMCA Harriers!'}
            subtitle={'Thanks for joining us!'}
          />
          <p>We'll start processing your membership right away!</p>
          <SecondaryTitle title={'What happens now?'} />
          <p>
            As you have joined with second claim membership, you will already be
            registered with England Athletics by your first claim club.
          </p>
          <p>
            Remember - you will only be able to represent the Manchester YMCA
            Harriers in disciplines in which your first claim club does not
            compete. If that applies to you, please pick up a club vest or
            T-shirt at any Thursday evening group run. Remember - your first
            vest or T-shirt is free of charge!
          </p>
        </div>
      </div>
    </section>
  </Layout>
)

export default SuccessSecondClaim
