import React from 'react'
import * as PropTypes from 'prop-types'
import { Link } from 'gatsby'
import * as Moment from 'moment'

const Breadcrumbs = ({ path }) => {
  if (path === '/') {
    return null
  }

  const firstParents = [
    {
      path: '/about',
      title: 'About us',
    },
    {
      path: '/blog',
      title: 'Blog',
    },
    {
      path: '/championships',
      title: 'Championships',
    },
    {
      path: '/events',
      title: 'Events',
    },
    {
      path: '/info',
      title: 'Info',
    },
    {
      path: '/join',
      title: 'Join us',
    },
    {
      path: '/routes',
      title: 'Routes',
    },
    {
      path: '/sessions',
      title: 'Sessions',
    },
    {
      path: '/venues',
      title: 'Venues',
    },
  ]

  const crumbs = [
    {
      path: '/',
      title: 'Home',
    },
  ]

  const firstParentMatches = path.match(/(^\/[A-z0-9-]+)\/.+$/)

  if (firstParentMatches) {
    const eventMatch = path.match(/^\/events(\/[\d]{4}-[\d]{2}-[\d]{2})/)
    if (eventMatch) {
      crumbs.push({
        path:
          '/events/' +
          Moment(eventMatch[1], 'YYYY-MM-DD')
            .utc()
            .format('MMMM-YYYY')
            .toLowerCase(),
        title: 'Events',
      })
    } else {
      crumbs.push(
        firstParents.find(({ path }) => path === firstParentMatches[1])
      )
    }
  }

  return (
    <div className="max-w-6xl px-4 mt-2 -mb-2 mx-auto text-sm">
      {crumbs.map(({ path, title }, i) => (
        <span className="breadcrumb" key={`breadcrumb-${i}`}>
          <Link
            className="pb-1 border-b-2 border-gray-400 hover:border-red-400 focus:border-red-400"
            to={path}
          >
            {title}
          </Link>
        </span>
      ))}
    </div>
  )
}

Breadcrumbs.propTypes = {
  path: PropTypes.string.isRequired,
}

export default Breadcrumbs
