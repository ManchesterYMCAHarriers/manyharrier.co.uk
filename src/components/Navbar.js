import React from 'react'
import * as PropTypes from 'prop-types'
import {Link} from 'gatsby'
import logo from '../img/logo-inverse.svg'
import * as Moment from 'moment'
import {CheckoutAvailable} from './Cart'

const NavbarBrand = () => (
  <Link
    to="/"
    className="flex-shrink-0 flex-grow-0 bg-transparent hover:bg-gray-800 focus:bg-gray-800 border-2 rounded-full border-transparent hover:border-white focus:border-white focus:outline-none"
    title={'Go to home page'}
  >
    <img className="h-20 w-20" src={logo} alt={''} />
  </Link>
)

const NavbarCheckout = () => (
  <Link
    className="flex-shrink-0 flex-grow-0 mr-6 border-2 p-2 border-gray-800 text-gray-200 hover:text-white hover:bg-gray-800 hover:border-white focus:bg-gray-800 focus:border-white focus:outline-none"
    to={'/checkout'}
  >
    Checkout
  </Link>
)

const NavbarLink = ({title, to}) => (
  <Link
    className="w-full md:w-auto md:text-sm lg:text-base text-center p-2 md:mr-4 flex-shrink-0 flex-grow-0 border-b-2 border-gray-700 hover:border-white focus:border-white bg-transparent hover:bg-gray-800 focus:bg-gray-800 focus:outline-none"
    to={to}
  >
    {title}
  </Link>
)

NavbarLink.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

const NavbarSpacer = () => <div className="flex-shrink flex-grow" />

const NavbarToggle = ({callback}) => (
  <button
    className="flex-shrink-0 flex-grow-0 mr-6 border-2 p-2 border-gray-800 text-gray-200 hover:text-white hover:bg-gray-800 hover:border-white focus:bg-gray-800 focus:border-white focus:outline-none md:hidden"
    onClick={callback}
  >
    Menu
  </button>
)

NavbarToggle.propTypes = {
  callback: PropTypes.func.isRequired,
}

export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checkoutAvailable: false,
      menuOpen: false,
      menuOpenClassName: 'hidden md:flex',
    }
  }

  componentDidMount() {
    this.setState({
      checkoutAvailable:
        window.location.pathname.search(/^\/checkout/) === -1
          ? CheckoutAvailable()
          : false,
    })
  }

  toggle = () => {
    this.setState(
      {
        menuOpen: !this.state.menuOpen,
      },
      () => {
        this.setState({
          menuOpenClassName: this.state.menuOpen ? 'flex' : 'hidden md:flex',
        })
      }
    )
  }

  render() {
    const eventsCalendarSlug =
      '/events/' +
      Moment.utc()
        .format('MMMM-YYYY')
        .toLowerCase()

    return (
      <div className="bg-black-manyharrier border-b-2 border-red-manyharrier w-full">
        <nav
          className="text-white-manyharrier max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4"
          role="navigation"
          aria-label="main-navigation"
        >
          <NavbarBrand />
          <div className="flex md:order-last">
            {this.state.checkoutAvailable && <NavbarCheckout />}
            <NavbarToggle open={this.state.menuOpen} callback={this.toggle} />
          </div>
          <div
            className={
              'flex-shrink-0 flex-grow w-full -ml-4 -mr-4 -mb-4 md:mb-0 md:w-auto flex-wrap items-center justify-between md:mx-4 ' +
              this.state.menuOpenClassName
            }
          >
            <NavbarLink to={'/join'} title={'Join us!'} />
            <NavbarSpacer />
            <NavbarLink to={eventsCalendarSlug} title={'Events calendar'} />
            <NavbarLink to={'/championships'} title={'Championships'} />
            <NavbarLink to={'/blog'} title={'Blog'} />
            <NavbarLink to={'/kit'} title={'Kit'} />
            <NavbarLink to={'/contact'} title={'Contact'} />
            <NavbarLink to={'/about'} title={'About'} />
          </div>
        </nav>
      </div>
    )
  }
}
