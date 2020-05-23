import { Message } from "discord.js";
import { user } from "../../utils/interfaces";
import { getUser } from "../../utils/databasehandler";
import * as config from "../../static/config.json";

export async function singleStateOverview(message: Message, args: string[]){
    const user: user = await getUser(message.author.id);
    if(!user) return message.reply("you haven't created an account yet, please use `.create`!");
    const index = user.clientStates.findIndex(el => el.name === args[0]);
    if(index === -1)return message.reply("you have no client state called " + args[0]);
    const cls = user.clientStates[index];
    return message.channel.send({
        embed: {
            color: parseInt(config.properties.embedColor)
        }
    })
}