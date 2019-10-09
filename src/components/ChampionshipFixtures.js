import React from 'react'
import PropTypes from 'prop-types'
import ChampionshipFixture from "./ChampionshipFixture";

class ChampionshipFixtures extends React.Component {
  render() {
    const {events} = this.props

    return (
      <div>
        {events.map(event => (
          <ChampionshipFixture event={event} />
        ))}
      </div>
    )
  }
}

ChampionshipFixtures.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object)
}

export default ChampionshipFixtures
