import { Message } from "discord.js";
import { user } from "../../utils/interfaces";
import { getUser, deleteClientState, updateValueForAlliance } from "../../utils/databasehandler";

export async function deleteCLS(message: Message, args: string[]) {
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create` first.");
    if (user.clientStates.findIndex(c => c.name === args[0]) === -1) return message.reply("you don't have a client state named " + args[0]);
    deleteClientState(user._id, args[0]);
    if(user.alliance != null) updateValueForAlliance(user.alliance, "clientStates", -1, "$inc");
    return message.reply("you succesfully deleted " + args[0]);
}