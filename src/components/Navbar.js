import React from 'react'
import * as PropTypes from 'prop-types'
import {Link} from 'gatsby'
import logo from '../img/logo-inverse.svg'
import * as Moment from 'moment'

const NavbarBrand = () => (
  <Link to="/"
        className="flex-shrink-0 flex-grow-0 ml-4 mt-4 mb-2 bg-transparent hover:bg-gray-800 focus:bg-gray-800 border-2 rounded-full border-transparent hover:border-white focus:border-white focus:outline-none"
        title={"Go to home page"}>
    <img className="h-20 w-20" src={logo} alt={""} />
  </Link>
)

const NavbarLink = ({title, to}) => (
  <Link
    className="w-full md:w-auto text-center p-2 flex-shrink-0 flex-grow-0 border-b-2 border-gray-700 hover:border-white focus:border-white bg-transparent hover:bg-gray-800 focus:bg-gray-800 focus:outline-none"
    to={to}>{title}</Link>
)

NavbarLink.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

const NavbarSpacer = () => (
  <div className="flex-shrink flex-grow" />
)

const NavbarToggle = ({callback}) => (
  <button
    className="flex-shrink-0 flex-grow-0 mr-6 border-2 p-2 border-gray-800 text-gray-200 hover:text-white hover:bg-gray-800 hover:border-white focus:bg-gray-800 focus:border-white focus:outline-none md:hidden"
    onClick={callback}>Menu</button>
)

NavbarToggle.propTypes = {
  callback: PropTypes.func.isRequired,
}

const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      openClassName: 'hidden md:flex'
    }
  }

  toggle = () => {
    this.setState({
      open: !this.state.open,
    }, () => {
      this.setState({
        openClassName: this.state.open ? 'flex' : 'hidden md:flex'
      })
    })
  }

  render() {
    const eventsCalendarSlug =
      '/events/' +
      Moment.utc()
        .format('MMMM-YYYY')
        .toLowerCase()

    return (
      <div
        className="bg-black text-white"
      >
        <nav
          className="max-w-6xl mx-auto flex flex-wrap items-center justify-between border-b-2 border-gray-700"
          role="navigation"
          aria-label="main-navigation">
          <NavbarBrand />
          <NavbarToggle open={this.state.open} callback={this.toggle} />
          <div className={"flex-shrink-0 flex-grow w-full md:w-auto flex-wrap items-center justify-between md:mx-4 " + this.state.openClassName}>
            <NavbarLink title={"Join us!"} to={"/join"} />
            <NavbarSpacer />
            <NavbarLink title={"Events calendar"} to={eventsCalendarSlug} />
          </div>
        </nav>
      </div>
    )
  }
}

export default Navbar
