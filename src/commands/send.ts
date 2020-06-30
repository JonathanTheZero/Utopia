import { Message } from "discord.js";
import { user } from "../utils/interfaces";
import { getUser, updateValueForUser, updateValueForAlliance } from "../utils/databasehandler";
import "../utils/utils";

export async function send(message: Message, args: string[]) {
    let author: user = await getUser(message.author.id);
    let user: user = await getUser(message.mentions.members?.first()?.id || args[0]);

    let a = (args[1].toLowerCase() == "a") ? author.money : parseInt(args[1].replace(/[,]/g, ''));
    if (typeof args[1] === "undefined" || isNaN(a)) return message.reply("please supply valid parameters following the syntax `.send <mention/ID> <amount>`.");
    if (!author) return message.reply("you haven't created an account yet, please use `.create` to create one.");
    if (!user) return message.reply("this user hasn't created an account yet.");
    if (user._id === author._id) return message.reply("you can't send money to yourself!");
    if (!a || a < 1) return message.reply("this isn't a valid amount.");
    if (author.money < a) return message.reply("you can't send more money than you own!");

    updateValueForUser(author._id, "money", -1 * a, "$inc");
    updateValueForUser(user._id, "money", a, "$inc");
    message.reply("Succesfully sent " + a.commafy() + " " + `money to ${user.tag}.`);
}

export async function deposit(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);
    let a = (args[0] == "a") ? user.money : parseInt(args[0].replace(/[,]/g, ''));
    if (typeof args[0] === "undefined" || isNaN(a)) return message.reply("please supply valid parameters following the syntax `.deposit <amount>`.");
    if (!user || JSON.stringify(user) === "{}") return message.reply("you haven't created an account yet, please use `.create` to create one.");
    if (!user.alliance) return message.reply("you haven't joined an alliance yet!");
    if (!a || a < 1) return message.reply("this isn't a valid amount.");
    if (user.money < a) return message.reply("you can't send more money than you own!");

    if (args[1] == "a") {
        updateValueForAlliance(user.alliance, "money", user.money, "$inc");
        updateValueForUser(user._id, "money", 0, "$set");
    } else {
        updateValueForAlliance(user.alliance, "money", a, "$inc");
        updateValueForUser(user._id, "money", -1*a, "$inc");
    }
    return message.reply("Succesfully sent " + a.commafy() + " " + `money to your alliance.`);
}