import { useEffect } from 'react'
import { navigate } from 'gatsby'
import Moment from 'moment'

// Redirect to current month
export default () => {
  const slug =
    '/events/' +
    Moment.utc()
      .format('MMMM-YYYY')
      .toLowerCase()

  useEffect(() => {
    navigate(slug)
  }, [slug])
  return null
}
