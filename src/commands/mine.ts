import { Message } from "discord.js";
import { user } from "../utils/interfaces";
import { getUser, updateValueForUser, getConfig, addToUSB } from "../utils/databasehandler";
import { getRandomInt, getRandomRange, reminder, secondsToDhms } from "../utils/utils";
import "../utils/utils";
import * as config from "../static/config.json";

export async function digmine(message: Message) {
    let user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create` command");

    if (Math.floor(Date.now() / 1000) - user.lastDig < 14400)
        return message.reply(`You can dig a new mine in ${new Date((14400 - (Math.floor(Date.now() / 1000) - user.lastDig)) * 1000).toISOString().substr(11, 8)}`);

    if (user.money < 10000 * (user.resources.totaldigs + 1))
        return message.reply(`you don't have ${(10000 * (user.resources.totaldigs + 1)).commafy()} money`);

    let minetype = (getRandomInt(3));
    updateValueForUser(user._id, "money", -(10000 * (user.resources.totaldigs + 1)), "$inc");
    addToUSB(10000 * (user.resources.totaldigs + 1));
    updateValueForUser(user._id, "lastDig", Math.floor(Date.now() / 1000), "$set");

    if (minetype == 0) message.reply("Your digging has returned no new mines");

    if (minetype == 1) {
        updateValueForUser(user._id, "steelmine", 1, "$inc");
        updateValueForUser(user._id, "steel", 100, "$inc");
        updateValueForUser(user._id, "totaldigs", 1, "$inc");
        message.reply("Your digging is successful. You got a new steel mine, and has given a initial return of 100 steel")
    }

    if (minetype == 2) {
        updateValueForUser(user._id, "oilrig", 1, "$inc");
        updateValueForUser(user._id, "oil", 100, "$inc");
        updateValueForUser(user._id, "totaldigs", 1, "$inc");
        message.reply("Your digging is successful. You got a new oil rig, and has given a initial return of 100 barrels of oil");
    }

    if (user.autoping) reminder(
        message,
        14400000,
        "I'll remind you in 4h to dig a mine again.\nIf you wish to disable reminders, use `.autoping`. (Note: this won't cancel all currently pending reminders)",
        "Reminder: Dig a mine."
    );
}

export async function mine(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);

    if (!user) return message.reply("you haven't created an account yet, please use `.create` command");

    if (user.resources.oilrig == 0 && user.resources.steelmine == 0)
        return message.reply("you don't have any mines to mine");

    if (args[0][0] !== "s" && args[0][0] !== "o")
        return message.reply("Wrong mine type, please do `.mine steel` or `.mine oil`");

    if (user.resources.minereturn == 0)
        return message.reply("Your mines can't make new resources");

    if (Math.floor(Date.now() / 1000) - user.lastMine < 3600)
        return message.reply("You can mine again in " + new Date((3600 - (Math.floor(Date.now() / 1000) - user.lastMine)) * 1000).toISOString().substr(11, 8));

    if (args[0][0] == "s") {
        if (!user.resources.steelmine) return message.reply("you don't have any steel mines.");
        let x = Math.floor(user.resources.steelmine * getRandomRange(400, 10000) * user.resources.minereturn);
        updateValueForUser(user._id, "steel", x, "$inc");
        message.reply(`Your steel mines produced ${x.commafy()} steel, you now have ${(x + user.resources.steel).commafy()} steel.`);
    }
    if (args[0][0] == "o") {
        if (!user.resources.oilrig) return message.reply("you don't have any oil rigs.");
        let x = Math.floor(user.resources.oilrig * getRandomRange(400, 10000) * user.resources.minereturn);
        updateValueForUser(user._id, "oil", x, "$inc");
        message.reply(`Your oil rigs produced ${x.commafy()} barrels, you now have ${(x + user.resources.oil).commafy()} barrels`);
    }
    const x = user.resources.minereturn + (user.resources.minereturn - (user.resources.minereturn * getRandomRange(10, user.resources.minereturn / 2))) / 100;
    updateValueForUser(user._id, "minereturn", x <= 0 ? 0 : x, "$set");

    if (user.minereset == 0)
        updateValueForUser(user._id, "minereset", Math.floor(Date.now() / 1000), "$set");

    updateValueForUser(user._id, "lastMine", Math.floor(Date.now() / 1000), "$set");
    if (user.autoping) reminder(
        message,
        1800000 * 2,
        "I'll remind you in 1 hour that you can mine again.\nIf you wish to disable reminders, use `.autoping`. (Note: this won't cancel all currently pending reminders)",
        "Reminder: Mine again"
    );
}

export async function mineStats(message: Message, args: string[]) {
    let user: user = await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id);
    if (!user) return message.reply(args[0] ? "This user hasn't created an account yet." : "You haven't created an account yet, please use `.create`.");
    const c = await getConfig();

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
                    inline: false
                },
                {
                    name: "Next reset:",
                    value: "The next mine reset will be in " + secondsToDhms(604800 + Math.floor((c.lastMineReset - Date.now()) / 1000))
                }
            ],
            color: parseInt(config.properties.embedColor),
            footer: config.properties.footer,
            timestamp: new Date()
        }
    });
}