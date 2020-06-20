import { Message } from "discord.js";
import { user, resources } from "../../utils/interfaces";
import { getUser, updateValueForUser, editCLSVal } from "../../utils/databasehandler";
import "../../utils/utils";
import { loyaltyChange } from ".";
import { governments } from "./consts";

export async function sendToCls(message: Message, args: string[]) {
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create` before");
    if (!args[2]) return message.reply("please follow the syntax of `.send-to-cls <name> <amount> <currency>`");
    let res: resources, a = parseInt(args[1]), index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
    switch (args[2][0].toLowerCase()) {
        case "f": res = "food"; break;
        case "o": res = "oil"; break;
        case "p": res = "population"; break;
        case "m": res = "money"; break;
        case "s": res = "steel"; break;
        default: return message.reply("this isn't a valid currency");
    }
    if (!a || a < 0) return message.reply("that isn't a valid amount");
    if (index === -1) return message.reply(`you have no Client State that is named ${args[0]}`);
    if ((res === "money" && parseInt(args[1]) > user.money) || res !== "money" && parseInt(args[1]) > user.resources[res])
        return message.reply("you can't send more than you own!");

    const l: number = loyaltyChange(a, user.clientStates[index].resources[res]) * governments[user.clientStates[index].government].loyaltyIncrease;
    if (user.clientStates[index].loyalty + l >= 1) editCLSVal(user._id, index, "loyalty", 1, "$set");
    else editCLSVal(user._id, index, "loyalty", l, "$inc");
    await Promise.all([
        editCLSVal(user._id, index, res!, a, "$inc"),
        updateValueForUser(user._id, res, -a, "$inc")
    ]);
    message.reply(`succesfully sent ${a.commafy()} ${res} to ${user.clientStates[index].name}.\nThis increased their loyalty by ${l.toLocaleString("en", { style: "percent" })}`);
}