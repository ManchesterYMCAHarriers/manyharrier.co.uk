import React from 'react'
import {Helmet} from 'react-helmet'
import * as PropTypes from 'prop-types'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import useSiteMetadata from './SiteMetadata'
import Breadcrumbs from './Breadcrumbs'

const TemplateWrapper = ({children, path, title, description, location}) => {
  const {title: siteTitle, description: genericDescription, siteUrl, locale, openGraphImage: defaultOpenGraphImage, twitter} = useSiteMetadata()

  let pageTitle = siteTitle
  if (title) {
    pageTitle += ` | ${title}`
  }
  const url = new URL(location ? location.pathname : '', siteUrl)
  let ogImage
  if (defaultOpenGraphImage) {
    ogImage = defaultOpenGraphImage
    ogImage.path = new URL(defaultOpenGraphImage.path, siteUrl)
  }

  return (
    <div>
      <Helmet>
        <html lang="en" />
        <title>{pageTitle}</title>
        <meta name="description" content={description || genericDescription} />
        <meta name="theme-color" content="#fff" />
        <meta property={"og:title"} content={pageTitle} />
        <meta property={"og:type"} content={"website"} />
        <meta property={"og:url"} content={url} />
        <meta property={"og:description"}
              content={description || genericDescription} />
        <meta property={"og:locale"} content={locale} />
        <meta property={"og:site_name"} content={siteTitle} />
        {ogImage.path && (
          <meta property={"og:image"} content={ogImage.path} />
        )}
        {ogImage.type && (
          <meta property={"og:image:type"} content={ogImage.type} />
        )}
        {ogImage.width && (
          <meta property={"og:image:width"} content={ogImage.width} />
        )}
        {ogImage.height && (
          <meta property={"og:image:height"} content={ogImage.height} />
        )}
        {twitter.site && (
            <meta name={"twitter:card"} content={"summary"} />
        )}
        {twitter.site && (
            <meta name={"twitter:site"} content={twitter.site} />
        )}
      </Helmet>
      <Navbar />
      {path && <Breadcrumbs path={path} />}
      {children}
      <Footer />
    </div>
  )
}

TemplateWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default TemplateWrapper
