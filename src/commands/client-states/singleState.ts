import { Message } from "discord.js";
import { user, clientState } from "../../utils/interfaces";
import { getUser } from "../../utils/databasehandler";
import * as config from "../../static/config.json";
import "../../utils/utils";
import { rates, f, governments } from "./consts";

export async function singleStateOverview(message: Message, args: string[]) {
    if (!args[0]) return message.reply("please follow the syntax of `.clientstate <name> [user]`.");
    const user: user = await getUser(message.mentions.users?.first()?.id || args[1] ||message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create`!");
    const index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
    if (index === -1) return message.reply("you have no client state called " + args[0]);
    const cls = user.clientStates[index];
    const prods = generateProductionRates(cls);
    return message.channel.send({
        embed: {
            color: parseInt(config.properties.embedColor),
            title: `${cls.name} - loyalty: ${cls.loyalty.toLocaleString("en", { style: "percent" })} - ${cls.government}`,
            fields: [
                {
                    name: "Money",
                    value: `This state owns ${cls.resources.money.commafy()} money`,
                    inline: true
                },
                {
                    name: "Steel",
                    value: `This state owns ${cls.resources.steel.commafy()} steel`,
                    inline: true
                },
                {
                    name: "Oil",
                    value: `This state owns ${cls.resources.oil.commafy()} oil`,
                    inline: true
                },
                {
                    name: "Food",
                    value: `This state owns ${cls.resources.food.commafy()} food`,
                    inline: true
                },
                {
                    name: "Population",
                    value: `This state has a population of ${cls.resources.population.commafy()} (means: up to ${prods[0].commafy()} money/day)`,
                    inline: true
                },
                {
                    name: "Focus",
                    value: cls.focus ? `This state's focus is set to ${cls.focus}` : `This state isn't focussed on a producing a special resource`,
                    inline: true
                },
                {
                    name: "Steel Mines",
                    value: `This state owns ${cls.upgrades.mines} mines (up to ${prods[1].commafy()}/day)`,
                    inline: true
                },
                {
                    name: "Oil Rigs",
                    value: `This state owns ${cls.upgrades.rigs} rigs (up to ${prods[2].commafy()}/day)`,
                    inline: true
                },
                {
                    name: "Farms",
                    value: `This state owns ${cls.upgrades.farms} farms (up to ${prods[3].commafy()}/day)`,
                    inline: true
                },
            ],
            footer: config.properties.footer,
            timestamp: new Date()
        }
    });
}

/**
 * @param c clientState to calculate rates for
 * @returns a tuple having the scheme [money, steel, oil, farms]
 */
function generateProductionRates(c: clientState): [number, number, number, number] {
    const p = governments[c.government].productivity;
    if (c.focus) {
        if (c.focus === "money") {
            return [
                Math.floor(3 * (c.resources.population * rates.money) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.mines) * rates.mines * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.rigs) * rates.rigs * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.farms) * rates.farms * p * (c.loyalty + .5))
            ];
        } else if (c.focus === "food") {
            return [
                Math.floor(.5 * (c.resources.population * rates.money) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.mines) * rates.mines * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.rigs) * rates.rigs * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(3 * (c.upgrades.farms) * rates.farms * (c.loyalty + .5) * p)
            ];
        } else if (c.focus === "oil") {
            return [
                Math.floor(.5 * (c.resources.population * rates.money) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.mines) * rates.mines * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(3 * (c.upgrades.rigs) * rates.rigs * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.farms) * rates.farms * (c.loyalty + .5) * p)
            ];
        } else if (c.focus === "steel") {
            return [
                Math.floor(.5 * (c.resources.population * rates.money) * (c.loyalty + .5) * p),
                Math.floor(3 * (c.upgrades.mines) * rates.mines * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.rigs) * rates.rigs * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.farms) * rates.farms * p)
            ];
        } else if (c.focus === "population") {
            return [
                Math.floor(.5 * (c.resources.population * rates.money) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.mines) * rates.mines * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.rigs) * rates.rigs * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
                Math.floor(.5 * (c.upgrades.farms) * rates.farms * (c.loyalty + .5) * p)
            ];
        }
    }
    return [
        Math.floor(c.resources.population * rates.money * (c.loyalty + .5) * p),
        Math.floor(c.upgrades.mines * rates.mines * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
        Math.floor(c.upgrades.rigs * rates.rigs * (1 + f(c.resources.population)) * (c.loyalty + .5) * p),
        Math.floor(c.upgrades.farms * rates.farms * (c.loyalty + .5) * p)
    ];
}