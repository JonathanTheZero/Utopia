import { Message } from "discord.js";
import { user, resources } from "../../utils/interfaces";
import { getUser, editCLSVal, updateValueForUser } from "../../utils/databasehandler";
import { loyaltyChange, governments } from ".";

export async function withdraw(message: Message, args: string[]) {
    if (!args[2]) return message.reply("please follow the syntax of `.withdraw <state> <amount> <currency>`")
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create`.");
    let res: resources, index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
    const cls = user.clientStates[index];
    switch (args[2][0].toLowerCase()) {
        case "f": res = "food"; break;
        case "o": res = "oil"; break;
        case "p": res = "population"; break;
        case "m": res = "money"; break;
        case "s": res = "steel"; break;
        default: return message.reply("this isn't a valid currency");
    }
    let a: number = args[1] === "a" ? cls.resources[res] : parseInt(args[1]);
    if (!a || a < 0) return message.reply("that isn't a valid amount");
    if (index === -1) return message.reply(`you have no Client State that is named ${args[0]}`);
    if (a > cls.resources[res]) return message.reply("you can't withdraw more than the state owns!");
    if (cls.loyalty <= 0) return message.reply("you can't take away resources from a state with 0% loyalty.");
    const l: number = 3 * loyaltyChange(a, user.clientStates[index].resources[res]) * governments[user.clientStates[index].government].loyaltyLoss;
    if (cls.loyalty - l <= 0) editCLSVal(user._id, index, "loyalty", 0, "$set");
    else editCLSVal(user._id, index, "loyalty", -l, "$inc");
    Promise.all([
        editCLSVal(user._id, index, res!, -a, "$inc"),
        updateValueForUser(user._id, res, a, "$inc")
    ]).then(() => message.reply(
        `succesfully took ${a.commafy()} ${res} from ${cls.name}.\n` +
        `This lowered their loyalty by ${l.toLocaleString("en", { style: "percent" })}`
    ));
}

// export async function clsKill(message: Message, args: string[]){
//     if (!args[0]) return message.reply("please follow the syntax of `.clskill <state> <amount>`")
//     const user: user = await getUser(message.author.id);
//     if (!user) return message.reply("you haven't created an account yet, please use `.create`.");
//     let a = parseInt(args[1]), index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
//     const cls = user.clientStates[index];
//     if (!a || a < 0) return message.reply("that isn't a valid amount");
//     if (index === -1) return message.reply(`you have no Client State that is named ${args[0]}`);
//
//     Promise.all([
//         editCLSVal(user._id, index, "population"!, -a, "$inc"),
//     ]).then(() => message.reply(
//         `succesfully killed ${a.commafy()} population from ${cls.name}.\n`
//     ));
// }