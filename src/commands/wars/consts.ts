export const battleStats = {
    infantry: {
        attack: {
            infantry: 20,
            artillery: 10,
            tanks: 5,
            jets: 5
        },
        defense: 20,
        hp: 100
    },
    artillery: {
        attack: {
            infantry: 50,
            artillery: 20,
            tanks: 150,
            jets: 25
        },
        defense: 50,
        hp: 200
    },
    tanks: {
        attack: {
            infantry: 100,
            artillery: 100,
            tanks: 100,
            jets: 35
        },
        defense: 100,
        hp: 250
    },
    jets: {
        attack: {
            infantry: 150,
            artillery: 100,
            tanks: 100,
            jets: 50
        },
        defense: 50,
        hp: 200
    }
}

export const prices = {
    infantry: {
        creation: {
            population: 1000,
            money: 5000,
            steel: 50
        },
        perRound: {
            food: 2000,
            money: 500
        }
    },
    artillery: {
        creation: {
            population: 1000,
            steel: 500,
            money: 20000
        },
        perRound: {
            money: 5000,
            food: 200
        }
    },
    tanks: {
        creation: {
            population: 500,
            steel: 5000,
            money: 40000
        },
        perRound: {
            oil: 200,
            money: 1500
        }
    },
    jets: {
        creation: {
            population: 500,
            steel: 7500,
            money: 50000
        },
        perRound: {
            oil: 1000,
            money: 5000
        }
    }
}