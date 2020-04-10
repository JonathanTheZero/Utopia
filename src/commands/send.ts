import { Message } from "discord.js";
import { user, alliance } from "../utils/interfaces";
import { getUser, updateValueForUser, getAlliance, updateValueForAlliance } from "../utils/databasehandler";
import "../utils/utils";

export async function send(message: Message, args: string[]) {
    let author: user = await getUser(message.author.id);
    let user: user;
    try {
        user = await getUser(message.mentions.users.first().id);
    }
    catch {
        user = await getUser(args[0]);
    }

    var a = (args[1].toLowerCase() == "a") ? author.money : parseInt(args[1]);
    if (typeof args[1] === "undefined" || isNaN(a)) return message.reply("please supply valid parameters following the syntax `.send <mention/ID> <amount>`.");
    if (!author) return message.reply("you haven't created an account yet, please use `.create` to create one.");
    if (!user) return message.reply("this user hasn't created an account yet.");
    if (JSON.stringify(author) === JSON.stringify(user)) return message.reply("you can't send money to yourself!");
    if (!a || a < 1) return message.reply("this isn't a valid amount.");
    if (author.money < a) return message.reply("you can't send more money than you own!");

    updateValueForUser(author._id, "money", -1 * a, "$inc");
    updateValueForUser(user._id, "money", a, "$inc");
    message.reply("Succesfully sent " + a.commafy() + " " + `money to ${user.tag}.`);
}

export async function deposit(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);
    let alliance: alliance = await getAlliance(user.alliance as string) as alliance;
    var a = (args[0] == "a") ? user.money : parseInt(args[0]);
    if (typeof args[0] === "undefined" || isNaN(a)) return message.reply("please supply valid parameters following the syntax `.deposit <amount>`.");
    if (!user || JSON.stringify(user) === "{}") return message.reply("you haven't created an account yet, please use `.create` to create one.");
    if (!user.alliance) return message.reply("you haven't joined an alliance yet!");
    if (!a || a < 1) return message.reply("this isn't a valid amount.");
    if (user.money < a) return message.reply("you can't send more money than you own!");

    if (args[1] == "a") {
        updateValueForAlliance(user.alliance, "money", user.money, "$inc");
        updateValueForUser(user._id, "money", 0, "$set");
    }
    else {
        updateValueForAlliance(user.alliance, "money", a, "$inc");
        updateValueForUser(user._id, "money", -1*a, "$inc");
    }
    message.reply("Succesfully sent " + a.commafy() + " " + `money to your alliance.`);
}