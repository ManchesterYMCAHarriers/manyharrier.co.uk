import React from 'react'
import PropTypes from 'prop-types'

class OverallStanding extends React.Component {
  render() {
    const { name, category, points, qualified, races, rank } = this.props

    return (
      <div className="flex justify-between items-center py-1 mb-1 border-b border-gray-600">
        <div className={"w-12 px-1 flex-shrink-0 flex-grow-0" + (qualified === false ? " text-gray-700" : "")}>{rank || "-"}</div>
        <div className={"flex-shrink flex-grow" + (qualified === false ? " italic text-gray-700" : "")}>
          {name}
          {category && (
            <span className={"pl-2 text-gray-600 text-xs"}>{category}</span>
          )}
        </div>
        <div className={"w-12 px-1 flex-shrink-0 flex-grow-0 text-right" + (qualified === false ? " italic text-gray-700" : "")}>{races}</div>
        <div className={"w-12 px-1 flex-shrink-0 flex-grow-0 text-right" + (qualified === false ? " italic text-red-manyharrier" : "")}>
          {qualified === true && "Yes"}
          {qualified === false && "No"}
        </div>
        <div className={"w-12 px-1 flex-shrink-0 flex-grow-0 text-right"}>{points}</div>
      </div>
    )
  }
}

OverallStanding.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string,
  points: PropTypes.number,
  qualified: PropTypes.bool,
  races: PropTypes.number,
  rank: PropTypes.string,
}

export default OverallStanding
