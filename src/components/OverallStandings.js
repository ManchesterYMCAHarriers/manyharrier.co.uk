import React from 'react'
import PropTypes from 'prop-types'
import OverallStanding from "./OverallStanding";

class OverallStandings extends React.Component {
  render() {
    const {title, standings} = this.props

    return (
      <div className="mb-8 w-full md:mb-0 md:w-1/2 md:ml-4">
        <h3 className="heading-3 mb-4">{title}</h3>
        {standings.length === 0 ? (
          <p>No standings.</p>
        ) : (
          <div>
            <div key={`standing-title-${title}`} className="flex justify-between py-1 mb-1 border-b-2 border-gray-600">
              <div className={"w-12 flex-shrink-0 flex-grow-0 font-bold"}>Rank</div>
              <div className={"flex-shrink flex-grow font-bold"}>Name</div>
              <div className={"w-12 flex-shrink-0 flex-grow-0 text-right font-bold"}>Races</div>
              <div className={"w-12 flex-shrink-0 flex-grow-0 text-right font-bold"}>Qual.</div>
              <div className={"w-12 flex-shrink-0 flex-grow-0 text-right font-bold"}>Pts.</div>
            </div>
            {standings.map(({name, category, points, qualified, races, rank, urn}) => (
              <OverallStanding key={`standing-${urn}`} name={name} category={category} points={points} qualified={qualified} races={races} rank={rank} />
            ))}
          </div>
        )}
      </div>
    )
  }
}

OverallStandings.propTypes = {
  title: PropTypes.string.isRequired,
  standings: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    points: PropTypes.number,
    qualified: PropTypes.bool,
    races: PropTypes.number,
    rank: PropTypes.string,
    urn: PropTypes.number.isRequired,
  }))
}

export default OverallStandings
