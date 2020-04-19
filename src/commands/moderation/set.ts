import { Message } from "discord.js";
import * as config from "../../static/config.json";
import { user } from "../../utils/interfaces";
import { getUser, updateValueForUser } from "../../utils/databasehandler";
import "../../utils/utils";

export async function set(message: Message, args: string[]) {
    if (!config.botAdmins.includes(message.author.id)) return message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
    if (!args[2]) return message.reply("please supply valid parameters following the syntax `.set <type> <mention/ID> <amount>`.");
    let user: user = await getUser(message.mentions.users.first().id || args[1]);

    if (!user) return message.reply("this user hasn't created an account yet.");
    const a = parseInt(args[2])
    if (a == null) return message.reply("this isn't a valid amount.");
    if (["money", "m"].includes(args[0])) {
        updateValueForUser(user._id, "money", a, "$set");
        return message.reply(`Succesfully set the money of ${message.mentions.users.first()} to ${a.commafy()}`);
    }
    else if (["food", "f"].includes(args[0])) {
        updateValueForUser(user._id, "food", Math.floor(a), "$set");
        return message.reply(`Succesfully set food population of ${message.mentions.users.first()} to ${a.commafy()}`);
    }
    else if (["population", "p"].includes(args[0])) {
        updateValueForUser(user._id, "population", a, "$set");
        return message.reply(`Succesfully set the population of ${message.mentions.users.first()} to ${a.commafy()}`);
    }
    else if (["steel", "p"].includes(args[0])) {
        updateValueForUser(user._id, "steel", a, "$set");
        return message.reply(`Succesfully set the steel of ${message.mentions.users.first()} to ${a.commafy()}`);
    }
    else if (["oil", "o"].includes(args[0])) {
        updateValueForUser(user._id, "oil", a, "$set");
        return message.reply(`Succesfully set the oil of ${message.mentions.users.first()} to ${a.commafy()}`);
    }
    return message.reply("the only types allowed are 'food', 'money', 'steel', 'oil' and 'population'");
}