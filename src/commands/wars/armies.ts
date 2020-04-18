import { Message } from "discord.js";
import { user, war } from "../../utils/interfaces";
import { getUser, findWarByUser } from "../../utils/databasehandler";
import * as config from "../../static/config.json";

export async function armies(message: Message) {
    const u: user = await getUser(message.author.id);

    const w: war | null = await findWarByUser(u._id);
    if (!w) return message.reply("you are not fighting in any active battles.");

    const a = u._id === w._id ? w.p1 : w.p2;

    message.channel.send({
        embed: {
            color: parseInt(config.properties.embedColor),
            title: "These are your armies:",
            fields: getArmyText(a.armies),
            timestamp: new Date(),
            footer: config.properties.footer
        }
    });
}

function getArmyText(arr: war["p1"]["armies"]): Array<{ value: string; name: string }> {
    let r = [];
    for (let i = 0; i < arr.length; ++i) {
        const army = arr[i];
        r.push({
            name: `Army ${i + 1}:`,
            value: `This army consists of ${(army.if * 1000).commafy()} Infantry, ${(army.art * 1000).commafy()} Artillery, ${(army.tnk * 1000).commafy()} Tanks, ${(army.jet * 1000).commafy()} Jets.\n` + 
                `It currently ${army.field ? `stands on field ${army.field[0]}-${army.field[1]}` : "isn't positioned on a field."}`
        });
    }
    return r;
}