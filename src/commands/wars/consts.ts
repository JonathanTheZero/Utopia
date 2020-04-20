import * as config from "../../static/config.json";
import "../../utils/utils";

export const battleStats = {
    if: {
        attack: {
            if: 20,
            art: 10,
            tanks: 5,
            jets: 5
        },
        defense: 20,
        hp: 100
    },
    art: {
        attack: {
            if: 50,
            art: 20,
            tanks: 150,
            jets: 25
        },
        defense: 50,
        hp: 200
    },
    tanks: {
        attack: {
            if: 100,
            art: 100,
            tanks: 100,
            jets: 35
        },
        defense: 100,
        hp: 250
    },
    jets: {
        attack: {
            if: 150,
            art: 100,
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

export const warGuide = {
    title: "A guide to wars",
    description: "With v2, a complete battle overhaul was introduced, together with two new resources: Oil and Steel! You can find more about those in the help menu.\n" +
        "This guide will show you the new war mechanics.",
    fields: [
        {
            name: "`.startwar <mention>`",
            value: "Use this command to start a war against another player, you'll see your battle field which has three obvious markings: the grey line in the middle which divides the map, the blue base and the red base." + 
                "Your main goal is to conquer the enemies base. The loser will lose 5% of his resources, the winner will receive those multiplied with a random bonus."
        }, 
        {
            name: "`.mobilize <infantry> <artillery> <tanks> <jets>`",
            value: "You have to mobilize your armies, each army can have troops of 4 different kinds, each one have their individual strengths and flaws and perform different against other types. You can have up to three armies." + 
                "As in old versions, the numbers are in regiments, which means the number is multiplied with 1,000 for the actual numbers.\n" +
                "Example: `.mobilize 1 1 1 1` will create an army consisting of 1,000 Infantry, 1,000 Artillery, 1,000 Tanks and 1,000 Jets.\n" +
                "If you wish to cancel, you can use `.cancelwar` - but only as long as nobody deployed his troops on the field."
        },
        {
            name: "`.ready`",
            value: "When a user uses ready, his moves/attacks for this round is finished, after both users uses `.ready`, the next round starts."
        },
        {
            name: "`.troopstats`",
            value: "View the stats of all different troop types and how they perform against certain other types in battle."
        },
        {
            name: "`.setposition <army> <x> <y>`",
            value: "This deploys the given army at a specific position on the field. Note: You can only deploy armies on your half of the field!\n" + 
                "Example: `.setposition 1 6 5` deploys Army 1 on the field 6-5 on the battleground"
        },
        {
            name: "`.move <army> <x> <y>`",
            value: "The paramaters work like for `setposition`, each round each army can be either moved up to two fields or attack an neighbouring army."
        },
        {
            name: "`.attack <army> <enemyarmy>`",
            value: "This command can be used to attack armies on neighbouring fields, for example `.attack 1 2` makes that your army 1 attacks the opposing army 2."
        },
        {
            name: "`.field`",
            value: "This commands allows you to view the battlemap any time."
        },
        {
            name: "`.armies`",
            value: "This commands allows you to view the current state of your armies."
        }
    ],
    footer: config.properties.footer,
    timestamp: new Date(),
    color: parseInt(config.properties.embedColor)
}

export const troopStats = {
    title: "Different troop stats:",
    fields: [
        {
            name: "Infantry:",
            value: `Creating one regiment of Infantry costs ${prices.infantry.creation.steel.commafy()} steel, ${prices.infantry.creation.money.commafy()} money and ${prices.infantry.creation.population.commafy()} population.\n` +
                `They will cost and consume ${prices.infantry.perRound.money.commafy()} money, ${prices.infantry.perRound.food.commafy()} food and per round.\n` +
                `Infantry has the following Stats:\n` +
                `HP: ${battleStats.if.hp}\n` +
                `Defense: ${battleStats.if.defense}\n` +
                `Attack: ${battleStats.if.attack.if} against Infantry, ${battleStats.if.attack.art} against Artillery, ${battleStats.if.attack.tanks} against Tanks and ${battleStats.if.attack.jets} against Jets.`
        },
        {
            name: "Artillery:",
            value: `Creating one regiment of Artillery costs ${prices.artillery.creation.steel.commafy()} steel, ${prices.artillery.creation.money.commafy()} money and ${prices.artillery.creation.population.commafy()} population.\n` +
                `They will cost and consume ${prices.artillery.perRound.money.commafy()} money, ${prices.artillery.perRound.food.commafy()} food and per round.\n` +
                `Infantry has the following Stats:\n` +
                `HP: ${battleStats.art.hp}\n` +
                `Defense: ${battleStats.art.defense}\n` +
                `Attack: ${battleStats.art.attack.if} against Infantry, ${battleStats.art.attack.art} against Artillery, ${battleStats.art.attack.tanks} against Tanks and ${battleStats.art.attack.jets} against Jets.`
        },
        {
            name: "Tanks:",
            value: `Creating one regiment of Tanks costs ${prices.tanks.creation.steel.commafy()} steel, ${prices.tanks.creation.money.commafy()} money and ${prices.tanks.creation.population.commafy()} population.\n` +
                `They will cost and consume ${prices.tanks.perRound.money.commafy()} money, ${prices.tanks.perRound.oil.commafy()} oil and per round.\n` +
                `Infantry has the following Stats:\n` +
                `HP: ${battleStats.tanks.hp}\n` +
                `Defense: ${battleStats.tanks.defense}\n` +
                `Attack: ${battleStats.tanks.attack.if} against Infantry, ${battleStats.tanks.attack.art} against Artillery, ${battleStats.tanks.attack.tanks} against Tanks and ${battleStats.tanks.attack.jets} against Jets.`
        },
        {
            name: "Jets:",
            value: `Creating one regiment of Jets costs ${prices.jets.creation.steel.commafy()} steel, ${prices.jets.creation.money.commafy()} money and ${prices.jets.creation.population.commafy()} population.\n` +
                `They will cost and consume ${prices.jets.perRound.money.commafy()} money, ${prices.jets.perRound.oil.commafy()} oil and per round.\n` +
                `Infantry has the following Stats:\n` +
                `HP: ${battleStats.jets.hp}\n` +
                `Defense: ${battleStats.jets.defense}\n` +
                `Attack: ${battleStats.jets.attack.if} against Infantry, ${battleStats.jets.attack.art} against Artillery, ${battleStats.jets.attack.tanks} against Tanks and ${battleStats.jets.attack.jets} against Jets.`
        },
    ],
    footer: config.properties.footer,
    timestamp: new Date(),
    color: parseInt(config.properties.embedColor)
}