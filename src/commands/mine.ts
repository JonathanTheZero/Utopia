import { Message, Client, User } from "discord.js";
import { user, alliance } from "../utils/interfaces";
import { getUser, updateValueForUser } from "../utils/databasehandler";
import { getRandomInt, getRandomRange } from "../utils/utils";
import "../utils/utils";
import * as config from "../static/config.json";

export async function digmine(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);

    if (!user)
        return message.reply("you haven't created an account yet, please use `.create` command");

    if (user.money < 10000 * (user.resources.totaldigs + 1))
        return message.reply(`you don't have ${(10000 * (user.resources.totaldigs + 1)).commafy()} money`)

    if (Math.floor(Date.now() / 1000) - user.lastDig < 14400)
        return message.reply(`You can dig a new mine in ${new Date((14400 - (Math.floor(Date.now() / 1000) - user.lastDig)) * 1000).toISOString().substr(11, 8)}`);

    let minetype = (getRandomInt(3));
    updateValueForUser(user._id, "money", -(10000 * (user.resources.totaldigs + 1)), "$inc");
    updateValueForUser(user._id, "lastDig", Math.floor(Date.now() / 1000), "$set");

    if (minetype == 0) return message.reply("Your digging has returned no new mines");

    if (minetype == 1) {
        updateValueForUser(user._id, "steelmine", 1, "$inc");
        updateValueForUser(user._id, "steel", 100, "$inc");
        updateValueForUser(user._id, "totaldigs", 1, "$inc");
        return message.reply("Your digging is successful. You got a new steel mine, and has given a initial return of 100 steel")
    }

    if (minetype == 2) {
        updateValueForUser(user._id, "oilrig", 1, "$inc");
        updateValueForUser(user._id, "oil", 100, "$inc");
        updateValueForUser(user._id, "totaldigs", 1, "$inc");
        return message.reply("Your digging is successful. You got a new oil rig, and has given a initial return of 100 barrels of oil");
    }
}

export async function mine(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);

    if (!user) return message.reply("you haven't created an account yet, please use `.create` command");

    if (user.resources.oilrig == 0 && user.resources.steelmine == 0)
        return message.reply("you don't have any mines to mine");

    if (args[0] !== "steel" && args[0] !== "oil")
        return message.reply("Wrong mine type, please do `.mine steel` or `.mine oil`");

    if (user.resources.minereturn == 0)
        return message.reply("Your mines can't make new resources");

    if (Math.floor(Date.now() / 1000) - user.lastMine < 3600)
        return message.reply("You can mine again in " + new Date((3600 - (Math.floor(Date.now() / 1000) - user.lastMine)) * 1000).toISOString().substr(11, 8));

    if (args[0] == "steel") {
        if (!user.resources.steelmine) return message.reply("you don't have any steel mines.");
        let payout = getRandomRange(400, 10000);
        let x = Math.floor(user.resources.steelmine * payout * user.resources.minereturn);
        updateValueForUser(user._id, "steel", x, "$inc");
        message.reply(`Your steel mines produced ${x.commafy()} steel, you now have ${(x + user.resources.steel).commafy()} steel.`);
    }
    if (args[0] == "oil") {
        if (!user.resources.oilrig) return message.reply("you don't have any oil rigs.");
        let payout = getRandomRange(400, 10000);
        let x = Math.floor(user.resources.oilrig * payout * user.resources.minereturn);
        updateValueForUser(user._id, "oil", x, "$inc");
        message.reply(`Your oil rigs produced ${x.commafy()} barrels, you now have ${(x + user.resources.oil).commafy()} barrels`);
    }
    const x = user.resources.minereturn + (user.resources.minereturn - (user.resources.minereturn * getRandomRange(10, user.resources.minereturn / 2))) / 100;
    console.log(x);
    updateValueForUser(user._id, "minereturn", x <= 0 ? 0 : x, "$set");

    if (user.minereset == 0)
        updateValueForUser(user._id, "minereset", Math.floor(Date.now() / 1000), "$set");

    updateValueForUser(user._id, "lastMine", Math.floor(Date.now() / 1000), "$set");
}

export async function mineStats(message: Message, args: string[]) {
    let user: user = await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id);
    if (!user) return message.reply(args[0] ? "This user hasn't created an account yet." : "You haven't created an account yet, please use `.create`.");

    return message.channel.send({
        embed: {
            title: "Mine stats for " + user.tag,
            fields: [
                {
                    name: "Digging:",
                    value: "Your next digging for a mine will cost " + ((user.resources.totaldigs + 1) * 10000).commafy() + " money",
                    inline: true
                },
                {
                    name: "Steelmines:",
                    value: `You currently have ${user.resources.steelmine.commafy()} steelmines`,
                    inline: true
                },
                {
                    name: "Oil rigs:",
                    value: `You currently have ${user.resources.oilrig.commafy()} oil rigs`,
                    inline: true
                },
                {
                    name: "Production efficency:",
                    value: `You already mined so much, your mines efficency sank to ${user.resources.minereturn.toLocaleString("en", { style: "percent" })}. ` +
                        "(Don't worry, this is reset once a week.)",
                    inline: true
                },
            ],
            color: parseInt(config.properties.embedColor),
            footer: config.properties.footer,
            timestamp: new Date()
        }
    });
}