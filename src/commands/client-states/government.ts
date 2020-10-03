import { Message } from "discord.js";
import { getUser, editCLSVal } from "../../utils/databasehandler";
import { user, clsGovernment } from "../../utils/interfaces";

export async function setGovernment(message: Message, args: string[]) {
    if (!args[1]) 
        return message.reply("please follow the syntax of `.set-government <name> <type>`.");
    if (!["democracy", "dictatorship", "monarchy"].includes(args[1]))
        return message.reply("the only valid government forms are \"democracy\", \"dictatorship\" and \"monarchy\"");

    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create`.");
    const index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
    if (index === -1) return message.reply("you don't have a client stated called " + args[0]);
    editCLSVal(user._id, index, "government", args[1] as clsGovernment);
    editCLSVal(user._id, index, "loyalty", -0.1, "$inc");
    return message.reply(`${user.clientStates[index].name}'s government from is now ${args[1]}`);
}