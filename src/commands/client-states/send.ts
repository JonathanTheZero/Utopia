import { Message } from "discord.js";
import { user, resources } from "../../utils/interfaces";
import { getUser, updateCLS, updateValueForUser } from "../../utils/databasehandler";
import "../../utils/utils";

export async function sendToCls(message: Message, args: string[]) {
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create` before");
    if (!args[2]) return message.reply("please follow the syntax of `.send-to-cls <name> <amount> <currency>`");
    let res: resources, a = parseInt(args[1]), index = user.clientStates.findIndex(el => el.name === args[0]);
    switch (args[2][0]) {
        case "f": res = "food"; break;
        case "o": res = "oil"; break;
        case "p": res = "population"; break;
        case "m": res = "money"; break;
        case "s": res = "steel"; break;
        default: return message.reply("this isn't a valid currency");
    }
    if (!a || a < 0) return message.reply("that isn't a valid amount");
    if (index === -1) return message.reply(`you have no Client State that is named ${args[0]}`);
    if ((res === "money" && parseInt(args[0]) > user.money) || res !== "money" && parseInt(args[0]) > user.resources[res])
        return message.reply("you can't offer more than you own!");
    Promise.all([
        updateCLS(user._id, res!, index, a, "$inc"),
        updateValueForUser(user._id, res, -a, "$inc")
    ]).then(() => message.reply(`succesfully sent ${a.commafy()} ${res} to ${args[0]}`));
}