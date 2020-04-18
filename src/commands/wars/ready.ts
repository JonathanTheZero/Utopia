import { getUser, findWarByUser, updateReady } from "../../utils/databasehandler";
import { Message } from "discord.js";
import { user, war } from "../../utils/interfaces";

export async function ready(message: Message) {
    const user: user = await getUser(message.author.id);

    let war: war | null = await findWarByUser(user._id);
    if (!war) return message.reply("you don't participate in any wars at the moment");
    const a = war.p1._id === user._id ? war.p1 : war.p2;

    await updateReady(war._id, war.p1._id === message.author.id);

    a.ready = true;
    
    if(war.p1.ready && war.p2.ready){
        message.channel.send("blub")
    }
}