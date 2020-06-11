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
      path: '/checkout',
      title: 'Checkout',
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
      path: '/kit',
      title: 'Kit',
    },
    {
      path: '/renew',
      title: 'Renew',
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

  if (crumbs.length < 2) {
    return null
  }

  return (
    <div className="bg-black-manyharrier text-white-manyharrier w-full">
      <nav className="max-w-6xl mx-auto px-4 py-2 text-sm">
        {crumbs.map(({ path, title }, i) => (
          <span className="breadcrumb" key={`breadcrumb-${i}`}>
            <Link
              className="pb-1 border-b border-white-manyharrier hover:border-red-manyharrier focus:border-red-manyharrier"
              to={path}
            >
              {title}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  )
}

Breadcrumbs.propTypes = {
  path: PropTypes.string.isRequired,
}

export default Breadcrumbs
