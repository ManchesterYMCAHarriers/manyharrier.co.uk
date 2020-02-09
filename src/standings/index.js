"use strict";

let Promise = require('bluebird');
let _ = require('lodash');
let moment = require('moment');

// Sorting functions
function sortByHeadToHead(a, b) {
  let rank = (offset) => {
    let aWins = 0;
    let bWins = 0;
    for (let i = offset; i < a.times.length; i++) {
      let aTime = timeToSeconds(a.times[i].time);
      let bTime = timeToSeconds(b.times[i].time);
      if (aTime === bTime) continue;
      if (aTime === null || aTime === false || bTime === null || bTime === false) continue;
      if (aTime < bTime) {
        aWins++;
        continue;
      }
      bWins++;
    }
    if (aWins === bWins) return 0;
    return (aWins > bWins) ? -1 : 1;
  };

  for (let i = 0; i < a.times.length; i++) {
    let result = rank(i);
    if (result !== 0) return result;
  }

  return 0;
}

function sortByPointsThenHeadToHead(a, b) {
  if (a.totalPoints === b.totalPoints) {
    return sortByHeadToHead(a, b);
  }
  return (a.totalPoints < b.totalPoints) ? -1 : 1;
}

function sortByPointsThenRacesCompleted(a, b) {
  if (a.totalPoints === b.totalPoints) {
    return sortQualifiedByRacesCompleted(a, b);
  }
  return (a.totalPoints < b.totalPoints) ? -1 : 1;
}

function sortQualifiedByRacesCompleted(a, b) {
  if (a.racesCompleted === b.racesCompleted) {
    return sortByHeadToHead(a, b);
  }
  return (a.racesCompleted > b.racesCompleted) ? -1 : 1;
}

function sortUnqualifiedByRacesCompleted(a, b) {
  if (a.racesCompleted === b.racesCompleted) {
    return sortByPointsThenHeadToHead(a, b);
  }
  return (a.racesCompleted > b.racesCompleted) ? -1 : 1;
}

function sortByQualificationStatusThenPointsThenHeadToHead(a, b) {
  if (a.qualified === b.qualified) {
    if (a.qualified === true) {
      return sortByPointsThenHeadToHead(a, b);
    }

    return sortUnqualifiedByRacesCompleted(a, b);
  }
  if (a.qualified === true) return -1;
  if (a.qualified === false) return 1;
  if (b.qualified === true) return 1;
  return -1;
}

function sortByQualificationStatusThenPointsThenRacesCompleted(a, b) {
  if (a.qualified === b.qualified) {
    if (a.qualified === true) {
      return sortByPointsThenRacesCompleted(a, b);
    }

    return sortUnqualifiedByRacesCompleted(a, b);
  }
  if (a.qualified === true) return -1;
  if (a.qualified === false) return 1;
  if (b.qualified === true) return 1;
  return -1;
}

function sortPointKeys(a, b) {
  if (a.points === b.points) return 0;
  if (a.points === false) return 1;
  if (b.points === false) return -1;
  if (a.points === null) return 1;
  if (b.points === null) return -1;
  return (a.points < b.points) ? -1 : 1;
}

function sortQualifiedKeyGroup(a, b) {
  if (a.qualified === b.qualified) return 0;
  if (a.qualified === true) return -1;
  if (b.qualified === true) return 1;
  if (a.qualified === false) return 1;
  return -1;
}

function timeToSeconds(time) {
  if (typeof time !== 'string') {
    return time;
  }
  let parts = time.split(':');
  parts.reverse();
  let seconds = parseFloat(parts[0]);
  // minutes
  if (parts[1]) {
    seconds += parseInt(parts[1], 10) * 60;
  }
  // hours
  if (parts[2]) {
    seconds += parseInt(parts[2], 10) * 60 * 60;
  }
  // days
  if (parts[3]) {
    seconds += parseInt(parts[3], 10) * 60 * 60 * 24;
  }

  return seconds;
}

function validateResults(results) {
  let racesPerRecord = [];
  _.forEach(results, (resultsForCategory, category) => {
    _.forEach(resultsForCategory, (resultsForIndividual, name) => {
      racesPerRecord.push(resultsForIndividual.length);
      if (_.uniq(racesPerRecord).length > 1) {
        throw new Error('Invalid number of races for "' + name + '" in "' + category + '" category');
      }

      _.forEach(resultsForIndividual, (result, position) => {
        if (result === null || result === false) {
          return;
        }
        if (result.search(/^(?:(?:(?:(\d+):)?([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)(\.\d+)?$/) === -1) {
          throw new Error('Invalid race entry for runner "' + name + '" in "' + category + '" category at position "' + position + '"');
        }
      });
    });
  });
}

function validateRaces(races) {
  if (!races || races.length === 0) {
    throw new Error('No races specified for championship');
  }

  _.forEach(races, (race, index) => {
    if (!race.name) {
      throw new Error('Race ' + index + ' does not have a name');
    }

    let dates = race.date || [];
    if (dates instanceof Array === false) {
      dates = [dates];
    }
    _.forEach(dates, (date) => {
      if (moment(date).isValid() === false) {
        throw new Error('Race ' + index + ' does not have a valid date');
      }
    });
  });
}

function validateQualificationCriteria(qualificationCriteria, races) {
  if (!qualificationCriteria || !_.isArray(qualificationCriteria) || qualificationCriteria.length === 0) {
    throw new Error('No qualification criteria have been specified');
  }

  if (!races || !_.isArray(races) || races.length === 0) {
    throw new Error('No races have been specified');
  }

  _.forEach(qualificationCriteria, (criteria, index) => {
    if (!_.isUndefined(criteria.availableRaces)) {
      if (!_.isArray(criteria.availableRaces)) {
        throw new Error('Available races have been incorrectly specified for qualification criteria ' + index);
      }
      if (races.length < criteria.availableRaces.length) {
        throw new Error('There is an insufficient number of races for qualification criteria ' + index);
      }

      if (!_.isUndefined(criteria.racesToQualify)) {
        if (criteria.racesToQualify > criteria.availableRaces.length) {
          throw new Error('There are not enough availableRaces to meet the racesToQualify criteria for qualification criteria ' + index);
        }
      }
    }

    if (typeof criteria.racesToQualify !== 'undefined') {
      if (criteria.racesToQualify > races.length) {
        throw new Error('There are not enough races to meet the racesToQualify criteria for qualification criteria ' + index);
      }
    }

    if (typeof criteria.raceTypes !== 'undefined') {
      if (!_.isPlainObject(criteria.raceTypes)) {
        throw new Error('raceTypes criteria must be a plain object in qualification criteria ' + index);
      }

      _.forEach(criteria.raceTypes, (raceTypeCriteria, raceType) => {
        if (!_.isFinite(raceTypeCriteria.required)) {
          throw new Error('Required value is not a number for raceType "' + raceType + '" in qualification criteria ' + index);
        }

        if (!_.isUndefined(criteria.availableRaces)) {
          if (raceTypeCriteria.required > criteria.availableRaces.length) {
            throw new Error('There are not enough availableRaces to meet the racesToQualify criteria in qualification criteria ' + index);
          }
        }

        if (raceTypeCriteria.required > races.length) {
          throw new Error('There are not enough races to meet the racesToQualify criteria in qualification criteria ' + index);
        }
      });
    }
  });
}

function validateData(data) {
  validateRaces(data.races);
  validateQualificationCriteria(data.qualificationCriteria, data.races);
  validateResults(data.results);
}

function sortQualification(a, b) {
  if (a === b) return 0;
  if (a === true) return -1;
  if (a === false) return 1;
  return (b === true) ? 1 : -1;
}

function sortResultsByRace(a, b) {
  if (a.time === b.time) return 0;
  if (a.time === null || a.time === false) return 1;
  if (b.time === null || b.time === false) return -1;
  return (a.time < b.time) ? -1 : 1;
}

function sortSummedPointKeyGroups(a, b) {
  if (a.racesUsed.length === b.racesUsed.length) {
    if (a.points === b.points) return 0;
    if (a.points === 0) return 1;
    if (b.points === 0) return -1;
    return (a.points < b.points) ? -1 : 1;
  }
  return (a.racesUsed.length > b.racesUsed.length) ? -1 : 1;
}

function individualHasMetQualificationCriteria(qualification) {
  qualification.sort(sortQualification);
  return _.last(qualification);
}

function individualHasQualified(qualification) {
  let qualificationValues = _.cloneDeep(qualification);
  qualificationValues.sort(sortQualification);
  return _.first(qualificationValues);
}

function reformatResultsByRace(resultsForCategory) {
  let resultsByRace = [];
  _.forEach(resultsForCategory, (individualResults, name) => {
    _.forEach(individualResults, (result, index) => {
      if (_.isUndefined(resultsByRace[index])) {
        resultsByRace.push([]);
      }
      resultsByRace[index].push({
        name: name,
        time: timeToSeconds(result)
      });
    });
  });

  return resultsByRace;
}

function racesCompletedByIndividuals(resultsForCategory) {
  let racesCompleted = {};
  _.forEach(resultsForCategory, (results, name) => {
    racesCompleted[name] = _.filter(results, (result) => {
      return !(result === null || result === false);
    }).length;
  });

  return racesCompleted;
}

function mapQualificationCriteriaRaceTypeRaces(qualificationCriteria, races) {
  return _.map(qualificationCriteria, (criteria) => {
    if (criteria.raceTypes) {
      criteria.raceTypes = _.mapValues(criteria.raceTypes, (raceType, type) => {
        let racesForType = {races: []};
        races.forEach((race, index) => {
          if (race.type === type) {
            racesForType.races.push(index);
          }
        });
        return _.assign(raceType, racesForType);
      });
    }

    return criteria;
  });
}

function individualMeetsRacesToQualifyCriteria(individualResults, criteria, availableRaces) {
  if (criteria.racesToQualify) {
    let remainingRaces = _.filter(availableRaces, (key) => {
      return _.isUndefined(individualResults[key]) ||
        _.isNull(individualResults[key]);
    }).length;

    let completedRaces = _.filter(availableRaces, (key) => {
      return _.isString(individualResults[key]);
    }).length;

    if ((completedRaces + remainingRaces) < criteria.racesToQualify) {
      return false;
    }

    if (_(individualResults).filter((results, key) => {
      return availableRaces.indexOf(key) > -1;
    }).filter((value) => {
      return _.isString(value);
    }).value().length < criteria.racesToQualify) {
      return null;
    }
  }

  return true;
}

function individualMeetsRaceTypeQualificationCriteria(individualResults, criteria, availableRaces) {
  let status = true;
  if (criteria.raceTypes) {
    _.some(criteria.raceTypes, (raceTypeCriteria, type) => {
      let required = raceTypeCriteria.required;
      let racesRunOfType = [];
      let racesForType = raceTypeCriteria.races;
      _.forEach(racesForType, (key) => {
        // Runner may still run this race
        if (_.isUndefined(individualResults[key]) ||
          _.isNull(individualResults[key])) {
          return;
        }

        // Runner has run (=true) or has not run (=false) this race
        racesRunOfType.push(_.isString(individualResults[key]));
      });

      // Has the runner missed too many races to qualify at this distance?
      if (required > (racesForType.length - _.filter(racesRunOfType, (value) => {
        return !value;
      }).length)) {
        status = false;
        return true;
      }

      // Has the runner qualified at this distance?
      if (required > _.filter(racesRunOfType, (value) => {
        return value;
      }).length) {
        status = null;
        return true;
      }
    });
  }

  return status;
}

function getAvailableRaces(criteria, races) {
  if (criteria.hasOwnProperty('availableRaces')) {
    return criteria.availableRaces;
  }

  return _.map(races, (value, index) => {
    return index;
  });
}

function qualificationForRunners(races, qualificationCriteria, resultsForCategory) {
  let qualification = {};

  _.forEach(qualificationCriteria, (criteria) => {
    let availableRaces = getAvailableRaces(criteria, races);

    _.forEach(resultsForCategory, (individualResults, name) => {
      let criteriaStatuses = [];

      criteriaStatuses.push(individualMeetsRacesToQualifyCriteria(individualResults, criteria, availableRaces));
      criteriaStatuses.push(individualMeetsRaceTypeQualificationCriteria(individualResults, criteria, availableRaces));

      if (!qualification.hasOwnProperty(name)) {
        qualification[name] = []
      }

      qualification[name].push(individualHasMetQualificationCriteria(criteriaStatuses));
    });
  });

  return qualification;
}

function pointsForRunners(resultsForCategory, qualification) {
  let points = {};
  let resultsByRace = reformatResultsByRace(resultsForCategory);

  _.forEach(resultsByRace, (race) => {
    race.sort(sortResultsByRace);

    let racePoints = 1;
    let offset = 0;
    for (let i = 0; i < race.length; i++) {
      let name = race[i].name;
      if (_.isUndefined(points[name])) {
        points[name] = [];
      }

      // Runner has not run in this race
      // or runner cannot qualify
      if (race[i].time === null ||
        race[i].time === false ||
        individualHasQualified(qualification[name]) === false) {
        points[name].push(null);
        continue;
      }

      points[name].push(racePoints);

      if (race[i + 1] &&
        race[i].time === race[i + 1].time &&
        individualHasQualified(qualification[race[i].name]) !== false &&
        individualHasQualified(qualification[race[i + 1].name]) !== false) {
        offset += 1;
        continue;
      }

      racePoints += 1 + offset;
      offset = 0;
    }
  });

  return points;
}

function racesUsedForRaceTypes(criteria, pointsForRunner) {
  let racesUsed = [];
  if (criteria.raceTypes) {
    _.forEach(criteria.raceTypes, (type) => {
      let pointsForType = _.map(type.races, (key) => {
        return {key: key, points: pointsForRunner[key] || null};
      });

      pointsForType.sort(sortPointKeys);

      // Push best scores at this distance to the selected scores
      for (let i = 0; i < type.required; i++) {
        racesUsed.push(pointsForType[i].key);
      }
    });
  }

  return racesUsed;
}

function racesUsedToQualify(criteria, races, pointsForRunner, racesAlreadyUsed) {
  let racesUsedToQualify = [];
  if (criteria.racesToQualify) {
    let availableRaces = getAvailableRaces(criteria, races);
    // Exclude races that have already been used
    let racesRemaining = _(availableRaces).map((key) => {
      return {key: key, points: pointsForRunner[key] || null};
    }).remove((race) => {
      return racesAlreadyUsed.indexOf(race.key) === -1;
    }).value();

    racesRemaining.sort(sortPointKeys);

    let racesRequired = criteria.racesToQualify - racesAlreadyUsed.length;
    for (let i = 0; i < racesRequired; i++) {
      racesUsedToQualify.push(racesRemaining[i].key);
    }
  }

  return racesUsedToQualify;
}

function buildPointKeyGroups(races, qualificationCriteria, individualQualification, pointsForRunner) {
  let pointKeyGroups = [];
  _.forEach(individualQualification, (status, index) => {
    // Runner cannot qualify using this criteria
    if (status === false) {
      return;
    }

    let criteria = qualificationCriteria[index];
    let racesUsed = [];
    racesUsed = _.concat(racesUsed, racesUsedForRaceTypes(races, criteria, pointsForRunner));
    racesUsed = _.concat(racesUsed, racesUsedToQualify(criteria, races, pointsForRunner, racesUsed));

    pointKeyGroups.push(racesUsed.sort());
  });

  return pointKeyGroups;
}

function filterPointKeyGroups(pointKeyGroups, individualQualification) {
  if (_(individualQualification).filter((value) => {
    return value !== false;
  }).uniq().value().length > 1) {
    let qualifiedKeyGroupOrder = [];
    _.forEach(individualQualification, (status, index) => {
      qualifiedKeyGroupOrder.push({key: index, qualified: status});
    });
    qualifiedKeyGroupOrder.sort(sortQualifiedKeyGroup);
    let bestQualificationStatus = _.head(qualifiedKeyGroupOrder).qualified;
    let filteredPointKeyGroups = [];
    _.forEach(qualifiedKeyGroupOrder, (qualifiedKeyGroup) => {
      if (qualifiedKeyGroup.qualified !== bestQualificationStatus) {
        return;
      }

      let key = qualifiedKeyGroup.key;
      filteredPointKeyGroups.push(pointKeyGroups[key]);
    });
    return filteredPointKeyGroups;
  }

  return pointKeyGroups;
}

function bestScoringPointKeyGroup(pointKeyGroups, pointsForRunner) {
  let summedPointKeyGroups = [];
  _.forEach(pointKeyGroups, (group) => {
    // Push sum of points values for races used onto bestPoints
    let score = 0;
    let racesUsed = [];
    _.forEach(group, (key) => {
      if (pointsForRunner[key] > 0) {
        score += pointsForRunner[key];
        racesUsed.push(key);
      }
    });
    summedPointKeyGroups.push({points: score, racesUsed: racesUsed});
  });

  summedPointKeyGroups.sort(sortSummedPointKeyGroups);

  return _.first(summedPointKeyGroups);
}

function scoringForIndividual(races, qualificationCriteria, individualPoints, individualQualification) {
  let pointKeyGroups = buildPointKeyGroups(races, qualificationCriteria, individualQualification, individualPoints);

  // Runner cannot qualify
  if (pointKeyGroups.length === 0) {
    return {points: null, racesUsed: []};
  }

  pointKeyGroups = filterPointKeyGroups(pointKeyGroups, individualQualification);

  return bestScoringPointKeyGroup(pointKeyGroups, individualPoints);
}

function timesForIndividual(scoringForRunner, individualResults, pointsForRunner) {
  let times = [];
  _.forEach(pointsForRunner, (score, index) => {
    let used = scoringForRunner.racesUsed.indexOf(index) > -1;
    times.push({time: individualResults[index], points: pointsForRunner[index], used: used});
  });

  return times;
}

function calculateForCategory(races, qualificationCriteria, resultsForCategory) {
  let racesCompletedForRunners = racesCompletedByIndividuals(resultsForCategory);
  let qualification = qualificationForRunners(races, qualificationCriteria, resultsForCategory);
  let points = pointsForRunners(resultsForCategory, qualification);
  let resultsOutput = [];

  _.forEach(resultsForCategory, (individualResults, name) => {
    let individualRacesCompleted = racesCompletedForRunners[name];
    let individualQualification = qualification[name];
    let individualPoints = points[name];

    // Determine points through races that count
    // Best position(s) in each race distance category
    // Best position(s) to make up to total race threshold
    let individualScore = scoringForIndividual(races, qualificationCriteria, individualPoints, individualQualification);
    let times = timesForIndividual(individualScore, individualResults, individualPoints);

    let record = {
      name: name,
      qualified: individualHasQualified(individualQualification),
      racesCompleted: individualRacesCompleted,
      totalPoints: individualScore.points,
      times: times
    };
    resultsOutput.push(record);
  });

  return resultsOutput;
}

function assignPositions(categoryResults) {
  let position = 1;
  let offset = 0;

  for (let i = 0; i < categoryResults.length; i++) {
    if (categoryResults[i].qualified === false) {
      categoryResults[i].position = '-';
      continue;
    }

    if (categoryResults[i + 1] &&
      categoryResults[i].qualified === categoryResults[i + 1].qualified &&
      categoryResults[i].racesCompleted === categoryResults[i + 1].racesCompleted &&
      categoryResults[i].totalPoints === categoryResults[i + 1].totalPoints) {
      offset += 1;
      categoryResults[i].position = '=' + position;
      continue;
    }

    if (offset > 0) {
      categoryResults[i].position = '=' + position;
    } else {
      categoryResults[i].position = position.toString();
    }

    position += 1 + offset;
    offset = 0;
  }

  return categoryResults;
}

function determineTieBreakMethod(races) {
  let dates = _.map(races, (race) => {
    if (_.isArray(race.date)) {
      return _.last(race.date.sort());
    }

    return race.date;
  });

  let foo = _.last(dates.sort());
  let lastRaceDate = new moment(foo);
  let watershed = new moment("2018-01-01T00:00:00+0000");

  return lastRaceDate.isBefore(watershed) ? "races-completed" : "head-to-head";
}

function calculate(data) {
  return new Promise((resolve, reject) => {
    // Check data is potentially valid
    try {
      validateData(data);
    } catch (err) {
      reject(err);
    }

    let title = data.title;
    let races = data.races;
    let qualificationCriteria = mapQualificationCriteriaRaceTypeRaces(data.qualificationCriteria, races);
    let results = data.results;
    let tieBreakMethod = determineTieBreakMethod(races);

    // Initialize output
    let output = {
      title: title,
      races: races,
      qualificationCriteria: qualificationCriteria
    };

    if (!_.isEmpty(results)) {
      output.results = {};

      _.forEach(results, (categoryResults, category) => {
        let calculatedResults = calculateForCategory(races, qualificationCriteria, categoryResults);
        if (tieBreakMethod === "races-completed") {
          calculatedResults.sort(sortByQualificationStatusThenPointsThenRacesCompleted);
        } else {
          calculatedResults.sort(sortByQualificationStatusThenPointsThenHeadToHead);
        }
        output.results[category] = assignPositions(calculatedResults);
      });
    }

    // Resolve (phew!)
    resolve(output);
  });
}

module.exports = {
  calculate: calculate
};
