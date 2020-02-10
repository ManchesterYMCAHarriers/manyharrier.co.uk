import { graphql, useStaticQuery } from 'gatsby'

const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query SITE_METADATA_QUERY {
        site {
          siteMetadata {
            title
            description
            siteUrl
            locale
            openGraphImage {
              path
              type
              width
              height
            }
            twitter {
              site
            }
          }
        }
      }
    `
  )
  return site.siteMetadata
}

export default useSiteMetadata
