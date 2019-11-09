import * as PropTypes from 'prop-types'

const Currency = val => '£' + (val / 100).toFixed(2)

Currency.propTypes = {
  val: PropTypes.number.isRequired,
}

export default Currency
