import { Message, Client } from "discord.js";
import * as config from "../../static/config.json";
import { getUser, getAlliance } from "../../utils/databasehandler";
import { user, alliance } from "../../utils/interfaces";
import "../../utils/utils";

export async function allianceOverview(message: Message, args: string[], client: Client) {
    const user: user = await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id);
    const url = client.users.cache.get(user?._id.toString())?.displayAvatarURL();

    let alliance: alliance = await getAlliance(!user ? args.join(" ") : user.alliance as string) as alliance;
    if (!alliance) {
        if (!args[0])
            return message.reply("you haven't joined an alliance yet.");
        else
            return message.reply(user.tag + " hasn't joined an alliance yet");
    }
    var coLeaders = "This alliance doesn't have any Co-Leaders";
    const cl = alliance.coLeaders;
    if (cl.length == 1)
        coLeaders = "The Co-Leader of this alliance is <@" + cl[0] + ">";
    else if (cl.length == 2)
        coLeaders = "The Co-Leaders of this alliance are <@" + cl[0] + "> and <@" + cl[1] + ">";
    const u = alliance.upgrades;
    return message.channel.send({
        embed: {
            color: parseInt(config.properties.embedColor),
            title: "Data for " + alliance.name,
            thumbnail: (user) ? {
                url,
            } : undefined,
            fields: [
                {
                    name: 'Leader:',
                    value: "<@" + alliance.leader._id + ">",
                    inline: true,
                },
                {
                    name: "Level",
                    value: "This alliance is level " + alliance.level,
                    inline: true,
                },
                {
                    name: 'Co-Leaders:',
                    value: coLeaders,
                },
                {
                    name: "Membercount:",
                    value: alliance.members.length + alliance.coLeaders.length + 1,
                    inline: true,
                },
                {
                    name: "Money:",
                    value: "The balance of this alliance is " + alliance.money.commafy(),
                    inline: true,
                },
                {
                    name: "Privacy settings:",
                    value: "This alliance is " + ((alliance.public) ? "public" : "private"),
                    inline: true
                },
                {
                    name: "Taxrate:",
                    value: alliance.tax + "%",
                    inline: true,
                },
                {
                    name: 'Upgrades:',
                    value: "This alliance owns: \n" + u.af + "x Arable Farming, " + u.pf + "x Pastoral Farming, " + u.mf + "x Mixed Farming",
                    inline: true,
                },
                {
                    name: "Client states:",
                    value: `This alliance has ${alliance.clientStates} in it, which boost the payout by ${((1.2 ** alliance.clientStates) - 1).toLocaleString("en", { style: "percent" })}`,
                    inline: true
                }
            ],
            timestamp: new Date(),
            footer: config.properties.footer,
        }
    });
}