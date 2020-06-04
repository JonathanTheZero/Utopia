import { Message } from "discord.js";
import { user } from "../../utils/interfaces";
import { getUser, editCLSVal } from "../../utils/databasehandler";

export async function renameCls(message: Message, args: string[]) {
    if (!args[1]) return message.reply("please follow the syntax of `.rename-cls <old name> <new name>`");
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create`.");
    const index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
    if (index === -1) return message.reply("you don't have a client stated called " + args[0]);
    editCLSVal(user._id, index, "name", args[1]);
    return message.reply(`successfully renamed ${args[0]} to ${args[1]}.`);
}