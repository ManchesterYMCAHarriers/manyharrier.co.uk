import React from 'react'
import { Helmet } from 'react-helmet'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import useSiteMetadata from './SiteMetadata'
import Breadcrumbs from './Breadcrumbs'

const TemplateWrapper = ({ children, path }) => {
  const { title, description } = useSiteMetadata()

  return (
    <div>
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#fff" />
      </Helmet>
      <Navbar />
      {path && <Breadcrumbs path={path} />}
      {children}
      <Footer />
    </div>
  )
}

export default TemplateWrapper
