import { Message, Client, TextChannel, Collection, MessageReaction, User } from "discord.js";
import * as config from "../static/config.json";
import { giveaway } from "../utils/interfaces";
import { getGiveaway, updateValueForUser, deleteGiveaway, addGiveaway } from "../utils/databasehandler";
import { Sleep } from "../utils/utils";
import "better-arrays.js";
import "../utils/utils";

export async function startGiveaway(message: Message, args: string[], client: Client) {
    //.start-giveaway <amount> <currency> <winners> <ending>
    if (!config.botAdmins.includes(message.author.id)) return message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
    const endstr = args.slice(3).join(" ");
    if (args.length < 4 || parseInt(args[3]) < 1 || parseInt(args[0]) < 1) return message.reply("please follow the syntax `.start-giveaway <amount> <currency> <winners> <ending>`");

    let currency: string;
    if (args[1].startsWith("p") || args[1].startsWith("P"))
        currency = "Population";
    else if (args[1].startsWith("f") || args[1].startsWith("F"))
        currency = "Food";
    else if (args[1].startsWith("m") || args[1].startsWith("M"))
        currency = "Money";
    else
        return message.reply("the only valid currencies are food, population and money!");

    var ending: Date;
    var addTime = -1;
    if (endstr.match(/[in]?[ ]?\d{1,}[ ]?m/ig)) {//x minutes
        addTime = Math.floor(endstr.match(/\d+/g)!.map(Number)[0]) * 60 * 1000;
        ending = new Date(Date.now() + addTime);
    }
    else if (endstr.match(/[in]?[ ]?\d{1,}[ ]?h/ig)) {//x hours
        addTime = Math.floor(endstr.match(/\d+/g)!.map(Number)[0]) * 3600 * 1000;
        ending = new Date(Date.now() + addTime);
    }
    else if (endstr.match(/[in]?[ ]?\d{1,}[ ]?d/ig)) {//x days
        addTime = Math.floor(endstr.match(/\d+/g)!.map(Number)[0]) * 24 * 3600 * 1000;
        ending = new Date(Date.now() + addTime);
    }
    if (addTime == -1)
        return message.reply("please specifiy a valid time.")
    if (addTime > 172800000)
        return message.reply("You can't start a giveaway that lasts longer than two days!");
    var giveaway: giveaway;
    await message.channel.send({
        embed: {
            color: parseInt(config.properties.embedColor),
            title: `Giveaway for ${args[0].commafy()}x${currency}`,
            description: `React to the message to participate in the giveaway. There will be ${args[2]} winners.`,
            footer: {
                text: `${config.properties.footer.text}  •  Ends at: `,
                icon_url: config.properties.footer.icon_url
            },
            timestamp: new Date(ending!)
        }
    }).then(async sent => {
        giveaway = {
            channelid: message.channel.id,
            _id: message.id,
            winners: parseInt(args[2]),
            startedAt: Date.now(),
            endingISO: ending,
            priceAm: args[0],
            priceCur: currency,
            endingAt: new Date(ending).getTime(),
            embedId: (sent as Message).id,
            users: []
        }

        await addGiveaway(giveaway);
        let msg = await message.channel.messages.fetch(giveaway!.embedId);
        msg.react("🎉");
        giveawayCheck(giveaway!._id, client);
    });
}

export async function giveawayCheck(_id: string, client: Client) {
    let giveaway: giveaway = await getGiveaway(_id);
    if (!giveaway) return;
    const channel = <TextChannel>client.channels.cache.get(giveaway.channelid)!;
    var voteCollection: Collection<string, MessageReaction>;

    await Sleep(giveaway.endingAt - Date.now());

    await channel.messages.fetch(giveaway.embedId).then(msg => {
        voteCollection = msg.reactions.cache;
    });

    giveaway.users = voteCollection!.first()!.users.cache.array();
    giveaway.users.shift();
    if (giveaway.users.length === 0) {
        let y: User[] = (await voteCollection!.first()!.users.fetch()).array();
        y.pop();
        giveaway.users = y;
    }
    let x: User[] = giveaway.users.sort(() => 0.5 - Math.random()).slice(0, giveaway.winners); //winners
    let winnerMentions = `<@${x[0].id}>`;
    for (let i = 1; i < x.length; i++) winnerMentions += `, <@${x[i].id}>`;

    channel.send(winnerMentions).then((msg: any) => msg.delete());

    channel.send({
        embed: {
            color: parseInt(config.properties.embedColor),
            title: "Giveaway ended",
            description: `Congratulations ${winnerMentions}, you won the ${giveaway.priceAm.commafy()} ${giveaway.priceCur}`,
            footer: config.properties.footer,
            timestamp: new Date()
        }
    });

    if (giveaway.priceCur == "Food") {
        for (const u of giveaway.users) updateValueForUser(u.id, "food", Math.floor(giveaway.priceAm as number), "$inc");
    } else if (giveaway.priceCur == "Population") {
        for (const u of giveaway.users) updateValueForUser(u.id, "population", Math.floor(giveaway.priceAm as number), "$inc");
    } else if (giveaway.priceCur == "Money") {
        for (const u of giveaway.users) updateValueForUser(u.id, "money", Math.floor(giveaway.priceAm as number), "$inc");
    }
    deleteGiveaway(giveaway._id);
}