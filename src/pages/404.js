import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'
import StandardContentContainer from '../components/StandardContentContainer'
import { PanelFullWidth, Panels } from '../components/Panels'
import { CallToActionBackLink } from '../components/CallToAction'

const NotFoundPage = () => (
  <Layout>
    <StandardContentContainer>
      <Panels>
        <PanelFullWidth>
          <div className="panel red-bottom">
            <p>
              We've given our site a makeover, which means some old links may no
              longer work. Sorry about that!
            </p>
            <p className="mt-4 content">
              Head <Link to={'/'}>to our home page</Link> or{' '}
              <Link to={'/contact'}>get in touch</Link> if there's information
              you need that's missing.
            </p>
            <div className="mt-12">
              <CallToActionBackLink
                title={'Manchester YMCA Harriers Home'}
                to={'/'}
              />
            </div>
          </div>
        </PanelFullWidth>
      </Panels>
    </StandardContentContainer>
  </Layout>
)

export default NotFoundPage
