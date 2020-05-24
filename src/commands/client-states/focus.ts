import { Message } from "discord.js";
import { resources } from "../../utils/interfaces";
import { getUser, editCLSVal } from "../../utils/databasehandler";

export async function setFocus(message: Message, args: string[]) {
    let res: resources | null = "money";
    const user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet please use `.create`.");
    if (!args[1]) return message.reply("please follow the syntax of `.set-focus <state> <type>`.");
    switch (args[1][0]) {
        case "f": res = "food"; break;
        case "m": res = "money"; break;
        case "o": res = "oil"; break;
        case "s": res = "steel"; break;
        case "p": res = "population"; break;
        case "n": res = null; break;
        default: return message.reply("this isn't a valid resource!");
    }
    const index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
    if (index === -1) return message.reply("you have no client state called " + args[0]);
    editCLSVal(user._id, index, "focus", res);
    return message.reply(`succesfully set the focus of ${user.clientStates[index].name} to ${res}`);
}