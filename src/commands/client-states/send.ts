import { Message } from "discord.js";
import { user, resources } from "../../utils/interfaces";
import { getUser, updateValueForUser, editCLSVal } from "../../utils/databasehandler";
import "../../utils/utils";

export async function sendToCls(message: Message, args: string[]) {
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create` before");
    if (!args[2]) return message.reply("please follow the syntax of `.send-to-cls <name> <amount> <currency>`");
    let res: resources, a = parseInt(args[1]), index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
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
    if ((res === "money" && parseInt(args[1]) > user.money) || res !== "money" && parseInt(args[1]) > user.resources[res])
        return message.reply("you can't send more than you own!");

    const l = generateLoyalityIncrease(a);
    await Promise.all([
        editCLSVal(user._id, index, res!, a,"$inc"),
        updateValueForUser(user._id, res, -a, "$inc"),
        editCLSVal(user._id, index, "loyalty", l, "$inc")
    ]);
    message.reply(`succesfully sent ${a.commafy()} ${res} to ${user.clientStates[index].name}.\nThis increased their loyality by ${l.toLocaleString("en", { style: "percent" })}`);
}

function generateLoyalityIncrease(amount: number): number {
    if (amount < 1000000) return Math.random() * .1;
    if (amount < 5000000) return Math.random() * .15;
    if (amount < 10000000) return Math.random() * .2;
    if (amount < 50000000) return Math.random() * .25;
    return Math.random() * .3;
}