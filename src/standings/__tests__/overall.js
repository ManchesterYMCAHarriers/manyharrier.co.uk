const Overall = require("../Overall")

describe("Overall standings", () => {
  const eventsInChampionship = 4

  const members = [
    {
      urn: 1,
      firstName: "Alan",
      lastName: "Arnold",
      dateOfBirth: "1980-01-01",
      gender: "M"
    },
    {
      urn: 2,
      firstName: "Alexa",
      lastName: "Arnold",
      dateOfBirth: "1980-01-01",
      gender: "F"
    },
    {
      urn: 3,
      firstName: "Bob",
      lastName: "Braithwaite",
      dateOfBirth: "1980-01-01",
      gender: "M"
    },
    {
      urn: 4,
      firstName: "Babs",
      lastName: "Braithwaite",
      dateOfBirth: "1980-01-01",
      gender: "F"
    },
    {
      urn: 5,
      firstName: "Charlie",
      lastName: "Chaser",
      dateOfBirth: "1980-01-01",
      gender: "M"
    },
    {
      urn: 6,
      firstName: "Ciara",
      lastName: "Campbell",
      dateOfBirth: "1980-01-01",
      gender: "F"
    },
  ]

  const qualificationCriteria = [
    {
      numberOfRaces: 3
    }
  ]

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
          time: "30:00"
        },
        {
          urn: 2,
          time: "30:00"
        },
        {
          urn: 3,
          time: "30:00"
        },
        {
          urn: 4,
          time: "30:01"
        }
      ],
    ]

    const res = Overall({
      eventsInChampionship,
      results,
      members,
      qualificationCriteria
    })

    expect(res).toEqual([
      {
        urn: 1,
        name: "Alan Arnold",
        points: 1,
        qualified: null,
        races: 1,
        rank: "=1"
      },
      {
        urn: 2,
        name: "Alexa Arnold",
        points: 1,
        qualified: null,
        races: 1,
        rank: "=1"
      },
      {
        urn: 3,
        name: "Bob Braithwaite",
        points: 1,
        qualified: null,
        races: 1,
        rank: "=1"
      },
      {
        urn: 4,
        name: "Babs Braithwaite",
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
          time: "30:00"
        },
        {
          urn: 2,
          time: "30:01"
        },
      ],
      [
        {
          urn: 1,
          time: "30:00"
        },
        {
          urn: 2,
          time: "30:01"
        },
        {
          urn: 3,
          time: "29:59"
        }
      ],
      [
        {
          urn: 1,
          time: "30:00"
        }
      ]
    ]

    const res = Overall({
      eventsInChampionship,
      results,
      members,
      qualificationCriteria
    })

    expect(res).toEqual([
      {
        urn: 1,
        name: "Alan Arnold",
        points: 3,
        qualified: true,
        races: 3,
        rank: "1"
      },
      {
        urn: 2,
        name: "Alexa Arnold",
        points: 4,
        qualified: null,
        races: 2,
        rank: "2"
      },
      {
        urn: 3,
        name: "Bob Braithwaite",
        points: null,
        qualified: false,
        races: 1,
        rank: null
      },
    ])
  })
})
