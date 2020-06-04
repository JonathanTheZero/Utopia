import { Message } from "discord.js";
import { user, resources } from "../../utils/interfaces";
import { getUser, editCLSVal, updateValueForUser } from "../../utils/databasehandler";

export async function withdraw(message: Message, args: string[]) {
    if (!args[2]) return message.reply("please follow the syntax of `.withdraw <state> <amount> <currency>`")
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create`.");
    let res: resources, a = parseInt(args[1]), index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
    const cls = user.clientStates[index];
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
    if (parseInt(args[1]) > cls.resources[res]) return message.reply("you can't withdraw more than the state owns!");
    const l = generateloyaltyLoss(a);
    Promise.all([
        editCLSVal(user._id, index, res!, -a, "$inc"),
        updateValueForUser(user._id, res, a, "$inc"),
        editCLSVal(user._id, index, "loyalty", -l, "$inc")
    ]).then(() => message.reply(
        `succesfully took ${a.commafy()} ${res} from ${cls.name}.\n` +
        `This lowered their loyalty by ${l.toLocaleString("en", { style: "percent" })}`
    ));
}

function generateloyaltyLoss(amount: number): number {
    if (amount < 1000000) return Math.random() * .1;
    if (amount < 5000000) return Math.random() * .15;
    if (amount < 10000000) return Math.random() * .2;
    if (amount < 50000000) return Math.random() * .25;
    return Math.random() * .3;
}