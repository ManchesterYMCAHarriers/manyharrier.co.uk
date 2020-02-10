import * as Moment from "moment";

const Overall = ({eventsInChampionship, results, members, qualificationCriteria, categoryKeyDate, veteranStartAge, veteranCategoryDuration}) => {
  // Sort results in ascending order
  const sortedResults = results.map(resultsForRace => {
    resultsForRace.sort((a, b) => {
      return a.time < b.time ? -1 : 1
    })

    return resultsForRace
  })

  // Group results by runner
  const resultsByRunner = members.reduce((acc, {urn}) => {
    acc[urn] = results.map(resultsForRace => {
      return resultsForRace.find(({urn: resultUrn}) => resultUrn === urn) || null
    })

    // Remove runner from results if they haven't completed any races
    if (acc[urn].findIndex(result => result !== null) === -1) {
      delete acc[urn]
    }

    return acc
  }, {})

  // Work out number of races completed by each runner
  const racesCompletedByRunner = {}

  for (const urn in resultsByRunner) {
    racesCompletedByRunner[urn] = resultsByRunner[urn].reduce((acc, result) => {
      if (result !== null) {
        acc++
      }

      return acc
    }, 0)
  }

  // Determine if runner can still qualify through any given route
  const qualificationRoutesByRunner = {}

  for (const urn in resultsByRunner) {
    qualificationRoutesByRunner[urn] = []
    for (let i = 0; i < qualificationCriteria.length; i++) {
      const criteria = qualificationCriteria[i]

      let qualifiedThroughRoute = true

      if (typeof criteria.numberOfRaces !== "undefined") {
        const racesWithResults = resultsByRunner[urn].length

        // Not qualified - check if can still qualify or not
        if (racesCompletedByRunner[urn] < criteria.numberOfRaces) {
          qualifiedThroughRoute = criteria.numberOfRaces > eventsInChampionship - racesWithResults + racesCompletedByRunner[urn] ? false : null
        }
      }

      qualificationRoutesByRunner[urn].push(qualifiedThroughRoute)
    }
  }

  // Update results with points
  const resultsWithPoints = sortedResults.map(resultsForRace => {
    let previousTime = null
    let previousPoints = null
    let points = 1

    if (resultsForRace) {
      return resultsForRace.map((result) => {
        const {urn, time} = result

        let runnerCanQualify = false
        for (let i = 0; i < qualificationRoutesByRunner[urn].length; i++) {
          if (qualificationRoutesByRunner[urn][i] !== false) {
            runnerCanQualify = true
            break
          }
        }

        if (!runnerCanQualify) {
          result.points = null
          return result
        }

        if (previousTime !== null && previousTime === time) {
          result.points = previousPoints
          points++
          return result
        }

        previousTime = time
        result.points = points
        previousPoints = points
        points++
        return result
      })
    }

    return null
  })

  const resultsByRunnerWithPoints = members.reduce((acc, {urn}) => {
    acc[urn] = resultsWithPoints.map(resultsForRace => {
      return resultsForRace.find(({urn: resultUrn}) => resultUrn === urn) || null
    })

    // Remove runner from results if they haven't completed any races
    if (acc[urn].findIndex(result => result !== null) === -1) {
      delete acc[urn]
    }

    return acc
  }, {})

  const standings = []

  for (const urn in qualificationRoutesByRunner) {
    const member = members.find(({urn: memberUrn}) => {
      return memberUrn === parseInt(urn, 10)
    })

    const name = [member.firstName, member.lastName].join(' ')
    let category = null
    if (categoryKeyDate && veteranStartAge && veteranCategoryDuration) {

      const ageOnKeyDate = categoryKeyDate.diff(Moment.utc(member.dateOfBirth), 'years')
      if (ageOnKeyDate >= veteranStartAge) {
        category = `V${ageOnKeyDate - (ageOnKeyDate % veteranCategoryDuration)}`
      }
    }
    const qualified = qualificationRoutesByRunner[urn].reduce((acc, val) => {
      if (acc === true) {
        return acc
      }

      if (val === true) {
        return true
      }

      if (acc === false && val !== false) {
        return val
      }

      return acc
    }, false)
    const races = racesCompletedByRunner[urn]

    let points = null

    for (let i = 0; i < qualificationRoutesByRunner[urn].length; i++) {
      if (qualificationRoutesByRunner[urn][i] === false) {
        continue
      }

      const resultsForRunnerInPointOrder = resultsByRunnerWithPoints[urn]
      resultsForRunnerInPointOrder.sort((a, b) => {
        if (a === null) {
          return 1
        }
        if (b === null) {
          return -1
        }
        if (a.points === null) {
          return 1
        }
        if (b.points === null) {
          return -1
        }
        return a.points < b.points ? -1 : 1
      })

      const criteria = qualificationCriteria[i]

      let pointsForCriteria = 0

      if (typeof criteria.numberOfRaces !== "undefined") {
        for (let j = 0; j < Math.min(races, criteria.numberOfRaces); j++) {
          if (resultsForRunnerInPointOrder[j].points === null) {
            break
          }

          pointsForCriteria += resultsForRunnerInPointOrder[j].points
        }
      }

      if (points === null || pointsForCriteria < points) {
        points = pointsForCriteria
      }
    }

    standings.push({
      urn: parseInt(urn, 10),
      name,
      category,
      points,
      qualified,
      races
    })
  }

  const headToHead = (resultsForRunnerA, resultsForRunnerB) => {
    let aWins = 0
    let bWins = 0
    for (let i = 0; i < resultsForRunnerA.length; i++) {
      const aResult = resultsForRunnerA[i]
      const bResult = resultsForRunnerB[i]

      if (aResult === null || bResult === null) {
        continue
      }

      if (aResult.time === bResult.time) {
        continue
      }
      if (aResult.time < bResult.time) {
        aWins++
        continue
      }
      bWins++
    }
    if (aWins === bWins) {
      return 0
    }
    return aWins > bWins ? -1 : 1
  }

  standings.sort((a, b) => {
    if (a.qualified === b.qualified) {
      if (a.qualified === true) {
        if (a.points === b.points) {
          const h2h = headToHead(resultsByRunnerWithPoints[a.urn], resultsByRunnerWithPoints[b.urn])
          if (h2h === 0) {
            return a.name < b.name
          }
          return h2h
        }
        return a.points < b.points ? -1 : 1
      }
      if (a.qualified === null) {
        if (a.races === b.races) {
          if (a.points === b.points) {
            const h2h = headToHead(resultsByRunnerWithPoints[a.urn], resultsByRunnerWithPoints[b.urn])
            if (h2h === 0) {
              return a.name < b.name
            }
            return h2h
          }
        }
        return a.races > b.races ? -1 : 1
      }
      // a.qualified === false
      if (a.races === b.races) {
        const h2h = headToHead(resultsByRunnerWithPoints[a.urn], resultsByRunnerWithPoints[b.urn])
        if (h2h === 0) {
          return a.name < b.name
        }
        return h2h
      }
      return a.races > b.races ? -1 : 1
    }
    if (a.qualified === true) {
      return -1
    }
    if (b.qualified === true) {
      return 1
    }
    if (a.qualified === null) {
      return -1
    }
    if (b.qualified === null) {
      return 1
    }
    // a.qualified === false
    return 1
  })

  // Add ranks
  for (let i = 0; i < standings.length; i++) {
    if (standings[i].qualified === false) {
      standings[i].rank = null
      continue
    }

    let tied = 0
    for (let j = i + 1; j < standings.length; j++) {
      if (standings[i].qualified === true && standings[i].qualified === standings[j].qualified && standings[i].points === standings[j].points && headToHead(resultsByRunnerWithPoints[standings[i].urn], resultsByRunnerWithPoints[standings[j].urn]) === 0) {
        tied++
        standings[j].rank = `=${i + 1}`
        continue
      }

      if (standings[i].qualified === null && standings[i].qualified === standings[j].qualified && standings[i].races === standings[j].races && standings[i].points === standings[j].points && headToHead(resultsByRunnerWithPoints[standings[i].urn], resultsByRunnerWithPoints[standings[j].urn]) === 0) {
        tied++
        standings[j].rank = `=${i + 1}`
        continue
      }

      break
    }

    if (tied > 0) {
      standings[i].rank = `=${i + 1}`
      i += tied
      continue
    }

    standings[i].rank = `${i + 1}`
  }

  return standings
}

export default Overall
