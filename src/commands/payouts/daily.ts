import { Client, TextChannel } from "discord.js";
import { user } from "../../utils/interfaces";
import { getAllUsers, updateValueForUser, editConfig, editCLSVal } from "../../utils/databasehandler";
import { rangeInt, getBaseLog } from "../../utils/utils";
import * as config from "../../static/config.json";

export async function dailyPayout(client: Client) {
    const users: user[] = await getAllUsers();
    const payoutChannel = <TextChannel>client.channels.get(config.payoutChannel)!;
    for (const u of users) {
        if (!u.clientStates.length) continue;
        for (let i = 0; i < u.clientStates.length; i++) {
            const c = u.clientStates[i];
            editCLSVal(u._id, i, "loyality", -(Math.random() * .07), "$inc");
            const consumption = -Math.floor(c.resources.population * (2 + getBaseLog(10, getBaseLog(10, getBaseLog(3, c.resources.population))))) || 0;
            if (consumption > c.resources.food) {
                editCLSVal(u._id, i, "food", 0, "$set");
                editCLSVal(u._id, i, "loyality", -(Math.random() * .15), "$inc")
                try {
                    client.users.get(u._id)?.send(`Your client state ${c.name} ran out of food, it's population starved to death. This lowered their loyality to you.`);
                } catch { }
            } else {
                editCLSVal(u._id, i, "food", -consumption, "$inc");
                editCLSVal(u._id, i, "population", Math.floor(Math.random() * .1 * c.resources.population), "$inc");
            }
            if (c.focus) {
                if (c.focus === "money") {
                    editCLSVal(u._id, i, "money", Math.floor(3 * (c.resources.population * Math.random() * .5)), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(.5 * (c.upgrades.mines) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(.5 * (c.upgrades.rigs) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(.5 * (c.upgrades.farms) * Math.random() * 500000), "$inc");
                } else if (c.focus === "steel") {
                    editCLSVal(u._id, i, "money", Math.floor(.5 * (c.resources.population * Math.random() * .5)), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(3 * (c.upgrades.mines) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(.5 * (c.upgrades.rigs) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(.5 * (c.upgrades.farms) * Math.random() * 500000), "$inc");
                } else if (c.focus === "oil") {
                    editCLSVal(u._id, i, "money", Math.floor(.5 * (c.resources.population * Math.random() * .5)), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(.5 * (c.upgrades.mines) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(3 * (c.upgrades.rigs) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(.5 * (c.upgrades.farms) * Math.random() * 500000), "$inc");
                } else if (c.focus === "food") {
                    editCLSVal(u._id, i, "money", Math.floor(.5 * (c.resources.population * Math.random() * .5)), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(.5 * (c.upgrades.mines) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(.5 * (c.upgrades.rigs) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(3 * (c.upgrades.farms) * Math.random() * 500000), "$inc");
                } else if (c.focus === "population") {
                    editCLSVal(u._id, i, "money", Math.floor(.5 * (c.resources.population * Math.random() * .5)), "$inc");
                    editCLSVal(u._id, i, "steel", Math.floor(.5 * (c.upgrades.mines) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "oil", Math.floor(.5 * (c.upgrades.rigs) * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                    editCLSVal(u._id, i, "food", Math.floor(.5 * (c.upgrades.farms) * Math.random() * 500000), "$inc");
                    editCLSVal(u._id, i, "population", 2 * Math.floor(Math.random() * .1 * c.resources.population), "$inc");
                }
            } else {
                editCLSVal(u._id, i, "money", Math.floor(c.resources.population * Math.random() * .5), "$inc");
                editCLSVal(u._id, i, "steel", Math.floor(c.upgrades.mines * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                editCLSVal(u._id, i, "oil", Math.floor(c.upgrades.rigs * Math.random() * 50000 * (1 + c.resources.population * .005)), "$inc");
                editCLSVal(u._id, i, "food", Math.floor(c.upgrades.farms * Math.random() * 500000), "$inc");
            }
        }
    }

    const plagueAffected: user[] = users.sort(() => 0.5 - Math.random()).slice(0, rangeInt(0, Math.floor(users.length / 100)));
    const names: string = plagueAffected.map<string>(el => el.tag).join(", ");
    for (const p of plagueAffected) {
        const rate = Math.random() * .5 * (1 - p.upgrades.hospitals / 10);
        updateValueForUser(p._id, "population", -Math.floor(p.resources.population * rate), "$inc");
        try {
            client.users.get(p._id)?.send(
                `A plague broke out in your Utopia, which killed ${rate.toLocaleString("en", { style: "percent" })} of your population ` +
                `(${Math.floor(p.resources.population * rate).commafy()} people).\n` +
                `You can lower the impact with buying hospitals in the population store.`
            );
        } catch { }
    }
    payoutChannel.send({
        embed: {
            color: names ? 0xFF0000 : 0x00FF00,
            title: "The daily reset has been made.",
            description: ((names ? `The Utopias of ${names} have been struck by plagues.` : "None Utopias have been struck by plagues today.") + "\n" +
                "Your client states gained some more autnomy."),
            timestamp: new Date()
        }
    });
    editConfig("lastDailyReset", Math.floor(Date.now() / 1000));
    setTimeout(() => dailyPayout(client), 86400000);
}