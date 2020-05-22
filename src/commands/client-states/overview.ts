import { Message } from "discord.js";
import { user } from "../../utils/interfaces";
import { getUser } from "../../utils/databasehandler";

export async function clsOverview(message: Message, args: string[]) {
    const user: user = await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id);
    if (!user) return message.reply(args[0] ? "This user hasn't created an account yet." : "you haven't created an account yet, please use `.create` first");
    const fields = [];
    for (const c of user.clientStates) fields.push({ name: c.name, value: JSON.stringify(c) });
    message.channel.send({
        embed: {
            title: "Client states of " + user.tag,
            description: user.clientStates.length === 0 ? "No client states": null,
            fields
        }
    })
}