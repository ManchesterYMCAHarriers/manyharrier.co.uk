import * as Moment from "moment";
import Overall from "../overall"

describe("Overall standings", () => {
  const eventsInChampionship = 4

  const members = [
    {
      urn: 1,
      firstName: "Alan",
      lastName: "Arnold",
      dateOfBirth: "1979-10-14",
      gender: "M"
    },
    {
      urn: 2,
      firstName: "Alexa",
      lastName: "Arnold",
      dateOfBirth: "1979-10-15",
      gender: "F"
    },
    {
      urn: 3,
      firstName: "Bob",
      lastName: "Braithwaite",
      dateOfBirth: "1974-10-14",
      gender: "M"
    },
    {
      urn: 4,
      firstName: "Babs",
      lastName: "Braithwaite",
      dateOfBirth: "1974-10-15",
      gender: "F"
    },
  ]

  const qualificationCriteria = [
    {
      numberOfRaces: 3
    }
  ]

  const categoryKeyDate = Moment.utc("2019-10-14")
  const veteranStartAge = 40
  const veteranCategoryDuration = 5

  it("returns an empty array if there are no results", () => {
    const results = []

    const res = Overall(
      {
        eventsInChampionship,
        results,
        members,
        qualificationCriteria
      }
    )

    expect(res).toEqual([])
  })

  it("handles the award of equal points", () => {
    const results = [
      [
        {
          urn: 1,
          time: 1800
        },
        {
          urn: 2,
          time: 1800
        },
        {
          urn: 3,
          time: 1800
        },
        {
          urn: 4,
          time: 1801
        }
      ]
    ]

    const res = Overall({
      eventsInChampionship,
      results,
      members,
      qualificationCriteria,
      categoryKeyDate,
      veteranCategoryDuration,
      veteranStartAge
    })

    expect(res).toEqual([
      {
        urn: 1,
        name: "Alan Arnold",
        category: "V40",
        points: 1,
        qualified: null,
        races: 1,
        rank: "=1"
      },
      {
        urn: 2,
        name: "Alexa Arnold",
        category: null,
        points: 1,
        qualified: null,
        races: 1,
        rank: "=1"
      },
      {
        urn: 3,
        name: "Bob Braithwaite",
        category: "V45",
        points: 1,
        qualified: null,
        races: 1,
        rank: "=1"
      },
      {
        urn: 4,
        name: "Babs Braithwaite",
        category: "V40",
        points: 4,
        qualified: null,
        races: 1,
        rank: "4"
      }
    ])
  })

  it("returns standings ordered by qualification status then points", () => {
    const results = [
      [
        {
          urn: 1,
          time: 1802
        },
        {
          urn: 2,
          time: 1801
        },
      ],
      [
        {
          urn: 1,
          time: 1802
        },
        {
          urn: 2,
          time: 1801
        },
        {
          urn: 3,
          time: 1799
        }
      ],
      [
        {
          urn: 1,
          time: 1800
        }
      ]
    ]

    const res = Overall({
      eventsInChampionship,
      results,
      members,
      qualificationCriteria,
      categoryKeyDate,
      veteranCategoryDuration,
      veteranStartAge
    })

    expect(res).toEqual([
      {
        urn: 1,
        name: "Alan Arnold",
        category: "V40",
        points: 5,
        qualified: true,
        races: 3,
        rank: "1"
      },
      {
        urn: 2,
        name: "Alexa Arnold",
        category: null,
        points: 2,
        qualified: null,
        races: 2,
        rank: "2"
      },
      {
        urn: 3,
        name: "Bob Braithwaite",
        category: "V45",
        points: null,
        qualified: false,
        races: 1,
        rank: null
      }
    ])
  })

  it("returns standings with equal qualification status in ascending points order", () => {
    const results = [
      [
        {
          urn: 1,
          time: 1802
        },
        {
          urn: 2,
          time: 1801
        },
        {
          urn: 3,
          time: 1800
        }
      ]
    ]

    const res = Overall({
      eventsInChampionship,
      results,
      members,
      qualificationCriteria,
      categoryKeyDate,
      veteranCategoryDuration,
      veteranStartAge
    })

    expect(res).toEqual([
      {
        urn: 3,
        name: "Bob Braithwaite",
        category: "V45",
        points: 1,
        qualified: null,
        races: 1,
        rank: "1"
      },
      {
        urn: 2,
        name: "Alexa Arnold",
        category: null,
        points: 2,
        qualified: null,
        races: 1,
        rank: "2"
      },
      {
        urn: 1,
        name: "Alan Arnold",
        category: "V40",
        points: 3,
        qualified: null,
        races: 1,
        rank: "3"
      }
    ])
  })

  it("uses the best possible points total for scoring", () => {
    const results = [
      [
        {
          urn: 1,
          time: 1802
        },
        {
          urn: 2,
          time: 1801
        },
        {
          urn: 3,
          time: 1800
        }
      ],
      [
        {
          urn: 1,
          time: 1800
        },
        {
          urn: 2,
          time: 1801
        },
        {
          urn: 3,
          time: 1799
        }
      ],
      [
        {
          urn: 1,
          time: 1800
        },
        {
          urn: 2,
          time: 1803
        },
        {
          urn: 3,
          time: 1804
        }
      ],
      [
        {
          urn: 1,
          time: 1800
        },
        {
          urn: 2,
          time: 1803
        },
        {
          urn: 3,
          time: 1799
        }
      ]
    ]

    const res = Overall({
      eventsInChampionship,
      results,
      members,
      qualificationCriteria,
      categoryKeyDate,
      veteranCategoryDuration,
      veteranStartAge
    })

    expect(res).toEqual([
      {
        urn: 3,
        name: "Bob Braithwaite",
        category: "V45",
        points: 3,
        qualified: true,
        races: 4,
        rank: "1"
      },
      {
        urn: 1,
        name: "Alan Arnold",
        category: "V40",
        points: 5,
        qualified: true,
        races: 4,
        rank: "2"
      },
      {
        urn: 2,
        name: "Alexa Arnold",
        category: null,
        points: 7,
        qualified: true,
        races: 4,
        rank: "3"
      },
    ])
  })
})
