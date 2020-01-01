import React from 'react'
import PropTypes from 'prop-types'
import Result from "./Result";

class Results extends React.Component {
  render() {
    const {title, results} = this.props

    return (
      <div className="mb-8 w-full md:mb-0 md:w-1/2 md:ml-4">
        <h3 className="heading-3 mb-4">{title}</h3>
        {results.length === 0 ? (
          <p>No results.</p>
        ) : (
          <div>
            {results.map(({name, time}) => (
              <Result name={name} time={time} />
            ))}
          </div>
        )}
      </div>
    )
  }
}

Results.propTypes = {
  title: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
  }))
}

export default Results
