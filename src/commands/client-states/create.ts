import { Message } from "discord.js";
import { clientState, user } from "../../utils/interfaces";
import { getUser, addClientState } from "../../utils/databasehandler";

export async function createCLS(message: Message, _args?: string[]){
    const user: user = await getUser(message.author.id);
    if(!user) return message.reply("you haven't created an account yet, please use `.create`.");
    const cls: clientState = {
        money: 0,
        resources: {
            food: 0,
            oil: 0,
            steel: 0,
            population: 0
        }
    }

    addClientState(user._id, cls);
    message.reply(JSON.stringify(cls));
}