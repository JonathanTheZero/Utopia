import { Message } from "discord.js";
import * as config from "../static/config.json";
import "../utils/utils";
import { user, alliance } from "../utils/interfaces";
import { getUser, getAlliance } from "../utils/databasehandler";

export async function storeEmbed(message: Message, type: "p" | "s" | "a" | "c" | "pf"): Promise<Object> {
    if (type === "p") {
        var user: user = await getUser(message.author.id);
        return {
            color: parseInt(config.properties.embedColor),
            title: 'Population store',
            description: 'These items are currently available in the population store!',
            thumbnail: {
                url: `${message.author.displayAvatarURL}`,
            },
            fields: [
                {
                    name: 'Your balance',
                    value: user.money.commafy(),
                },
                {
                    name: '\u200b',
                    value: '\u200b'
                },
                {
                    name: 'Invade the UK',
                    value: '+5k population every 4h\nPrice: 100,000',
                    inline: true,
                },
                {
                    name: 'Advanced Equipment',
                    value: '+10k population every 4h\nPrice: 250,000',
                    inline: true,
                },
                {
                    name: 'Invade Russia',
                    value: '+15k population every 4h\nPrice: 500,000',
                    inline: true,
                },
                {
                    name: 'Expand your City',
                    value: '+25k population every 4h\nPrice: 1,000,000',
                    inline: true,
                },
                {
                    name: 'Globalization',
                    value: '+50k population every 4h\nPrice: 2,500,000',
                    inline: true
                },
                {
                    name: 'Recruit more Soldiers',
                    value: '+200k population every 4h\nPrice: 10,000,000',
                    inline: true,
                },
                {
                    name: 'Invade the US',
                    value: '+750k population every 4h\nPrice: 50,000,000',
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: "Hospital",
                    value: "-10% plague deaths:\n" +
                        `${((user.upgrades.hospitals + 1) * 100000).commafy()} money and ${((user.upgrades.hospitals + 1) * 20000).commafy()} steel`,
                    inline: true
                }
            ],
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    } else if (type === "a") {
        var user: user = await getUser(message.author.id);
        var alliance = user.alliance;

        if (alliance == null) alliance = "You haven't joined an alliance yet.";

        if (user.allianceRank == "M") alliance = "Member of " + alliance;
        else if (user.allianceRank == "C") alliance = "Co-leader of " + alliance;
        else if (user.allianceRank == "L") alliance = "Leader of " + alliance;
        let alMoney: string = (user.alliance == null) ?
            "You haven't joined an alliance yet" :
            (await (getAlliance(user.alliance as string) as Promise<alliance>))?.money.commafy() || "You haven't joined an alliance yet.";
        return {
            color: parseInt(config.properties.embedColor),
            title: 'Alliance store',
            description: 'These items are currently available in the alliance store! \n' +
                "Note: only the leader and the Co-Leaders can buy alliance upgrades and they are used immediately. " +
                "The Leader gets 10% of the alliance income, the Co-Leaders 5% each. The rest is split among the members.",
            thumbnail: {
                url: `${message.author.displayAvatarURL}`,
            },
            fields: [
                {
                    name: 'The balance of your alliance:',
                    value: alMoney,
                    inline: true,
                },
                {
                    name: "Your alliance, your rank:",
                    value: alliance,
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b'
                },
                {
                    name: 'Arable farming',
                    value: '+150k food for the alliance every 4h \nPrice: 100,000',
                    inline: true,
                },
                {
                    name: "Pastoral farming",
                    value: "+1M food for the alliance every 4h \nPrice: 1,750,000",
                    inline: true,
                },
                {
                    name: "Mixed farming",
                    value: "+5M food for the alliance every 4h \nPrice: 7,500,000",
                    inline: true,
                }
            ],
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    } else if (type === "pf") {
        var user: user = await getUser(message.author.id);
        return {
            color: parseInt(config.properties.embedColor),
            title: 'Personal Farm Store',
            description: 'These items are currently available in the Personal Farm Store!\n(You can own each farm three times, except Nomadic Farming, which can be owned four times)',
            thumbnail: {
                url: message.author.displayAvatarURL,
            },
            fields: [
                {
                    name: 'Your balance',
                    value: user.money.commafy(),
                },
                {
                    name: '\u200b',
                    value: '\u200b'
                },
                {
                    name: 'Nomadic Farming',
                    value: '+500k food every 4h\nPrice: 750,000',
                    inline: true,
                },
                {
                    name: 'Subsistence Farming',
                    value: '+1M food every 4h\nPrice: 2,750,000',
                    inline: true,
                },
                {
                    name: 'Sedentary Farming',
                    value: '+5M food every 4h\nPrice: 7,500,000',
                    inline: true,
                },
                {
                    name: 'Intensive Farming',
                    value: '+10M food every 4h\nPrice: 15,000,000',
                    inline: true,
                },
            ],
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    } else if (type === "c") {
        return {
            color: parseInt(config.properties.embedColor),
            title: "Client state store",
            description: "The prices vary in each client state's, due to the different amount of buildings there.\nYou can theoretically buy each upgrade infinite times for your client states." +
                "\nAll production rates are further boosted by loyalty and the focus set (for more see`.help client-states`.)" + 
                "Buy an item with `.buy-cls <state> <upgrade>`. This will boost their loyalty.",
            thumbnail: {
                url: message.author.displayAvatarURL,
            },
            fields: [
                { 
                    name: "Clientstate",
                    value: "Founding your first client-state costs 500,000,000 money, the price increases by 500M every time you buy another one. " +
                        "They are intended as an endgame feature.",
                    inline: false
                },
                {
                    name: "Mines",
                    value: "A mine boosts the steel production of a state by 100,000 a day",
                    inline: true
                },
                {
                    name: "Rigs",
                    value: "A rig boosts the oil production of a state by 100,000 a day",
                    inline: true
                },
                {
                    name: "Farms",
                    value: "A farm boosts the food production of a state by 1,500,000 a day",
                    inline: true
                }
            ],
            timestamp: new Date(),
            footer: config.properties.footer
        };
    }
    return {
        color: parseInt(config.properties.embedColor),
        title: 'Store',
        description: 'Welcome to the store! \n' +
            "Note: All items can only be purchased **once**.",
        thumbnail: {
            url: `${message.author.displayAvatarURL}`,
        },
        fields: [
            {
                name: 'Population store',
                value: "Type `.store population` to view the population store",
            },
            {
                name: 'Alliance store',
                value: "Type `.store alliance` to view the alliance store",
            },
            {
                name: "Personal Farm store",
                value: "Type `.store pf` to view the Personal Farm store",
            },
            {
                name: 'A pack of food',
                value: 'Contains 50k food (added to your account immediately) \nPrice: 20,000',
                inline: true,
            },
        ],
        timestamp: new Date(),
        footer: config.properties.footer,
    };
}