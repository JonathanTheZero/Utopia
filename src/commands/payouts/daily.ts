import { Client, TextChannel } from "discord.js";
import { user } from "../../utils/interfaces";
import { getAllUsers, updateValueForUser, editConfig, editCLSVal, getUsersWithQuery, deleteClientState, addToUSB } from "../../utils/databasehandler";
import { rangeInt, absBaseLog } from "../../utils/utils";
import * as config from "../../static/config.json";
import { contractPayout } from "../trade/contracts";
import { f, governments, rates } from "../client-states";

export async function dailyPayout(client: Client) {
    const users: user[] = await getAllUsers();
    const payoutChannel = <TextChannel>client.channels.cache.get(config.payoutChannel)!;
    for (const u of users) {
        updateValueForUser(u._id, "population", Math.floor(Math.random() * u.resources.population * .05), "$inc");
        if (!u.clientStates.length) continue;
        for (let i = 0; i < u.clientStates.length; i++) {
            const c = u.clientStates[i], loyaltyLoss = Math.random() * .07 * governments[u.clientStates[i].government].loyaltyLoss;
            if (!c.government) {
                await deleteClientState(u._id, c.name);
                continue;
            }
            if (c.loyalty <= 0) {
                if (Math.random() > 0.5) {
                    client.users.cache.get(u._id)?.send({
                        embed: {
                            title: "**Alert**",
                            description: `Your left your client state ${c.name} without attention for too long, it declared independence.`,
                            color: 0xFF0000
                        }
                    }).catch(console.log);
                    await deleteClientState(u._id, c.name);
                    continue;
                } else {
                    client.users.cache.get(u._id)?.send({
                        embed: {
                            title: "**Alert**",
                            description: `Your client state ${c.name}'s loyalty sank to 0% they could declare independence!`,
                            color: 0xFF0000
                        }
                    }).catch(console.log);
                }
            } else {
                if (c.loyalty - loyaltyLoss <= 0) {
                    editCLSVal(u._id, i, "loyalty", 0, "$set");
                    client.users.cache.get(u._id)?.send({
                        embed: {
                            title: "**Alert**",
                            description: `Your client state ${c.name}'s loyalty sank to 0% they could declare independence!`,
                            color: 0xFF0000
                        }
                    }).catch(console.log);
                } else editCLSVal(u._id, i, "loyalty", -loyaltyLoss, "$inc");
            }

            const consumption = Math.floor(c.resources.population * (2 + absBaseLog(10, absBaseLog(10, absBaseLog(3, c.resources.population + 1))))) || 0;
            let pop = c.resources.population;
            if (consumption > c.resources.food) {
                editCLSVal(u._id, i, "food", 0, "$set");
                const loss = -(Math.random() * .8);
                if (u.clientStates[i].loyalty + loss <= 0) editCLSVal(u._id, i, "loyalty", 0, "$set");
                else editCLSVal(u._id, i, "loyalty", loss, "$inc");
                editCLSVal(u._id, i, "food", 0, "$set");
                const diff = consumption - c.resources.food;
                if (diff > c.resources.population) {
                    editCLSVal(u._id, i, "population", 0, "$set");
                    pop = 0;
                } else {
                    editCLSVal(u._id, i, "population", -diff, "$inc");
                    pop -= diff;
                }
                client.users.cache.get(u._id)?.send({
                    embed: {
                        title: "**Alert**",
                        description: `Your client state ${c.name} ran out of food, it's population starved to death. This lowered their loyalty to you.`,
                        color: 0xFF0000
                    }
                }).catch(console.log);
            } else {
                editCLSVal(u._id, i, "food", -consumption, "$inc");
                const factor = Math.floor(Math.random() * .1 * c.resources.population);
                editCLSVal(u._id, i, "population", factor, "$inc");
                pop += factor;
            }

            const p = governments[u.clientStates[i].government].productivity,
                money = pop * Math.random() * rates.money;
            if (c.focus) {
                if (c.focus === "money") {
                    editCLSVal(u._id, i, "money", Math.floor(3 * money * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(.5 * (c.upgrades.mines) * Math.random() * rates.mines * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(.5 * (c.upgrades.rigs) * Math.random() * rates.rigs * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(.5 * (c.upgrades.farms) * Math.random() * rates.farms * (c.loyalty + .5) * p), "$inc");
                } else if (c.focus === "steel") {
                    editCLSVal(u._id, i, "money", Math.floor(.5 * money * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(3 * (c.upgrades.mines) * Math.random() * rates.mines * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(.5 * (c.upgrades.rigs) * Math.random() * rates.rigs * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(.5 * (c.upgrades.farms) * Math.random() * rates.farms * (c.loyalty + .5) * p), "$inc");
                } else if (c.focus === "oil") {
                    editCLSVal(u._id, i, "money", Math.floor(.5 * money * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(.5 * (c.upgrades.mines) * Math.random() * rates.mines * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(3 * (c.upgrades.rigs) * Math.random() * rates.rigs * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(.5 * (c.upgrades.farms) * Math.random() * rates.farms * (c.loyalty + .5) * p), "$inc");
                } else if (c.focus === "food") {
                    editCLSVal(u._id, i, "money", Math.floor(.5 * money * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(.5 * (c.upgrades.mines) * Math.random() * rates.mines * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(.5 * (c.upgrades.rigs) * Math.random() * rates.rigs * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(3 * (c.upgrades.farms) * Math.random() * rates.farms * (c.loyalty + .5) * p), "$inc");
                } else if (c.focus === "population") {
                    editCLSVal(u._id, i, "money", Math.floor(.5 * money * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(.5 * (c.upgrades.mines) * Math.random() * rates.mines * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(.5 * (c.upgrades.rigs) * Math.random() * rates.rigs * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(.5 * (c.upgrades.farms) * Math.random() * rates.farms * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "population", 2 * Math.floor(Math.random() * .1 * pop), "$inc");
                } else if (c.focus === "resources") {
                    editCLSVal(u._id, i, "money", Math.floor(.5 * money * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(2 * (c.upgrades.mines) * Math.random() * rates.mines * (1 + f(c.resources.population)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(2 * (c.upgrades.rigs) * Math.random() * rates.rigs * (1 + f(c.resources.population)) * (c.loyalty + .5) * p), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(.5 * (c.upgrades.farms) * Math.random() * rates.farms * (c.loyalty + .5) * p), "$inc");
                }
            } else {
                editCLSVal(u._id, i, "money", Math.floor(money * p), "$inc");
                editCLSVal(u._id, i, "steel", Math.floor(c.upgrades.mines * Math.random() * rates.mines * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                editCLSVal(u._id, i, "oil", Math.floor(c.upgrades.rigs * Math.random() * rates.rigs * (1 + f(pop)) * (c.loyalty + .5) * p), "$inc");
                editCLSVal(u._id, i, "food", Math.floor(c.upgrades.farms * Math.random() * rates.farms * (c.loyalty + .5) * p), "$inc");
            }
            if (u.clientStates[i].loyalty < 0) editCLSVal(u._id, i, "loyalty", 0, "$set");
            addToUSB(-Math.floor(money * (c.loyalty + .5) * p));
        }
    }
    //selecting all users that have a population that is not 0 => only affect people with population
    const qU: user[] = await getUsersWithQuery({ "resources.population": { $ne: 0 } });
    const plagueAffected: user[] = qU.sort(() => 0.5 - Math.random()).slice(0, rangeInt(0, Math.floor(users.length / 100)));
    const names: string = plagueAffected.map<string>(el => el.tag).join(", ");
    for (const p of plagueAffected) {
        const rate = Math.random() * .4 * (1 - p.upgrades.hospitals / 10);
        updateValueForUser(p._id, "population", -Math.floor(p.resources.population * rate), "$inc");
        client.users.cache.get(p._id)?.send(
            `A plague broke out in your Utopia, which killed ${rate.toLocaleString("en", { style: "percent" })} of your population ` +
            `(${Math.floor(p.resources.population * rate).commafy()} people).\n` +
            `You can lower the impact with buying hospitals in the population store.`
        ).catch(console.log);
    }
    contractPayout();
    payoutChannel.send({
        embed: {
            color: names ? 0xFF0000 : 0x00FF00,
            title: "The daily reset has been made.",
            description: ((names ? `The Utopias of ${names} have been struck by plagues.` : "No Utopias have been struck by plagues today.") + "\n" +
                "Your client states gained some more autonomy and produced some goods.\n\n" +
                "Contract payouts happened."),
            timestamp: new Date()
        }
    });
    editConfig("lastDailyReset", Math.floor(Date.now() / 1000));
    setTimeout(() => dailyPayout(client), 86400000);
}