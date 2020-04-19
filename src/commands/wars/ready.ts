import { getUser, findWarByUser, updateReady, markAllArmies, } from "../../utils/databasehandler";
import { Message } from "discord.js";
import { user, war } from "../../utils/interfaces";
import * as config from "../../static/config.json";

export async function ready(message: Message) {
    const user: user = await getUser(message.author.id);
    let war: war | null = await findWarByUser(user._id);
    if (!war) return message.reply("you don't participate in any wars at the moment");
    const a = war.p1._id === user._id ? war.p1 : war.p2;

    await updateReady(war._id, war.p1._id === user._id);

    a.ready = true;

    if (war.p1.ready && war.p2.ready && !war.p1.armies[0].field) {
        await Promise.all([
            updateReady(war._id, true, false),
            updateReady(war._id, false, false)
        ]);
        message.channel.send({
            embed: {
                title: "Get ready to fight!",
                description:
                    "Both parties are ready, now deploy your armies on the field using `.setposition <armyindex> <x> <y>`",
                color: 0x00ff00,
                footer: config.properties.footer,
                timestamp: new Date(),
            }
        });
    }
    else if (war.p1.ready && war.p2.ready) {
        await Promise.all([
            markAllArmies(war!._id, false),
            updateReady(war._id, false, false),
            updateReady(war._id, true, false),
        ]);
        message.channel.send({
            embed: {
                title: "Next round is starting!",
                description:
                    "You can move your armies with `.move <armyindex> <x> <y>` or attack the armies of your opponent using `.attack <armyindex> <enemy-army>`.",
                color: 0x00bbbb,
                footer: config.properties.footer,
                timestamp: new Date(),
            }
        });
    }
}
