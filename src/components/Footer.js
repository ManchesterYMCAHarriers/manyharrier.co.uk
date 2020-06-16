import React from 'react'
import * as PropTypes from 'prop-types'
import { graphql, Link, StaticQuery } from 'gatsby'

import logo from '../img/logo-inverse.svg'
import { FaFacebookF, FaInstagram, FaTwitter, FaStrava } from 'react-icons/fa'

const FooterLogo = () => (
  <Link
    to="/"
    className="w-auto flex-shrink-0 flex-grow-0 bg-transparent hover:bg-gray-800 focus:bg-gray-800 border-2 rounded-full border-transparent hover:border-white focus:border-white focus:outline-none"
  >
    <img className="h-40 w-40" src={logo} alt="" />
  </Link>
)

const FooterMenuLink = ({ title, to }) => (
  <Link
    className="text-center md:text-left w-full block flex-shrink-0 flex-grow-0 p-2 border-b-2 border-gray-800 hover:border-white focus:border-white bg-transparent hover:bg-gray-800 focus:bg-gray-800 focus:outline-none"
    to={to}
  >
    {title}
  </Link>
)

const FooterSocialLink = ({ title, to, children }) => (
  <a
    title={title}
    href={to}
    className="flex-shrink-0 flex-grow-0 p-2 border-2 rounded-full border-transparent hover:border-white focus:border-white bg-transparent hover:bg-gray-800 focus:bg-gray-800 focus:outline-none"
  >
    {children}
  </a>
)

FooterMenuLink.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

const Footer = class extends React.Component {
  render() {
    return (
      <StaticQuery
        query={graphql`
          query Footer {
            site {
              siteMetadata {
                title
                social {
                  facebook
                  instagram
                  strava
                  twitter
                }
              }
            }
          }
        `}
        render={({
          site: {
            siteMetadata: {
              title,
              social: { facebook, instagram, strava, twitter },
            },
          },
        }) => (
          <footer className="bg-black-manyharrier text-white">
            <div className="max-w-6xl mx-auto flex flex-wrap">
              <div className="w-full md:w-auto mt-8 md:ml-4 flex-shrink-0 flex-grow flex flex-wrap md:flex-no-wrap md:flex-col items-center md:items-start justify-center md:justify-between">
                <FooterLogo />
                <div className="w-full max-w-2xl mt-8 flex-shrink-0 flex-grow-0 flex items-center md:items-end justify-around md:justify-start">
                  <FooterSocialLink title={'Strava'} to={strava}>
                    <FaStrava className="text-3xl" />
                  </FooterSocialLink>
                  <FooterSocialLink title={'Instagram'} to={instagram}>
                    <FaInstagram className="text-3xl" />
                  </FooterSocialLink>
                  <FooterSocialLink title={'Facebook'} to={facebook}>
                    <FaFacebookF className="text-3xl" />
                  </FooterSocialLink>
                  <FooterSocialLink title={'Twitter'} to={twitter}>
                    <FaTwitter className="text-3xl" />
                  </FooterSocialLink>
                </div>
              </div>
              <div className="w-full md:w-1/4 mt-8 flex-shrink-0 flex-grow-0 flex flex-wrap md:flex-col items-center md:items-start md:mr-4 justify-center md:justify-start">
                <FooterMenuLink title={'Events calendar'} to={'/events'} />
                <FooterMenuLink title={'Championships'} to={'/championships'} />
                <FooterMenuLink title={'Blog'} to={'/blog'} />
                <FooterMenuLink title={'Kit'} to={'/kit'} />
                <FooterMenuLink title={'Contact'} to={'/contact'} />
                <FooterMenuLink title={'About'} to={'/about'} />
                <FooterMenuLink title={'Join'} to={'/join'} />
                <FooterMenuLink title={'Renew'} to={'/renew'} />
              </div>
              <div className="w-full my-8 px-2flex-shrink-0 flex-grow-0 text-center">
                <span className="whitespace-no-wrap">
                  Copyright &copy; {new Date().getUTCFullYear()}
                </span>{' '}
                <span className="whitespace-no-wrap">{title}.</span>{' '}
                <span className="whitespace-no-wrap">All rights reserved.</span>
              </div>
            </div>
          </footer>
        )}
      />
    )
  }
}

export default Footer
