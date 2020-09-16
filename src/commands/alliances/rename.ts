import { Message } from "discord.js";
import { user } from "../../utils/interfaces";
import { getUser, getAlliance, updateValueForAlliance, customUpdateQuery } from "../../utils/databasehandler";

export async function renameAlliance(message: Message, args: string[]) {
    if(!args[0]) return message.reply("you need to add a name!")
    let user: user = await getUser(message.author.id);

    const old = (' ' + user.alliance).slice(1), newName = args.join(" ");

    if ((await getAlliance(newName)))
        return message.reply("error: there is already another alliance with that name!");

    updateValueForAlliance(old, "name", newName);
    customUpdateQuery("users", { alliance: old }, { $set: { alliance: newName } });
    return message.reply(`Succesfully renamed your alliance to ${newName}`);
}