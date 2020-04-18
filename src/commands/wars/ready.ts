import { getUser, findWarByUser, updateReady } from "../../utils/databasehandler";
import { Message } from "discord.js";
import { user, war } from "../../utils/interfaces";
import * as config from "../../static/config.json";

export async function ready(message: Message) {
    const user: user = await getUser(message.author.id);

    let war: war | null = await findWarByUser(user._id);
    if (!war) return message.reply("you don't participate in any wars at the moment");
    const a = war.p1._id === user._id ? war.p1 : war.p2;

    await updateReady(war._id, war.p1._id === message.author.id);

    a.ready = true;
    
    if(war.p1.ready && war.p2.ready){
        message.channel.send({
            embed: {
                title: "Get ready to fight!",
                description: "Both parties are ready, now deploy your armies on the field using `.setposition <armyindex> <x> <y>`",
                color: 0x00FF00,
                footer: config.properties.footer,
                timestamp: new Date(),
            }
        });
    }
}