import { Message, Client } from "discord.js";
import { getUser, updateValueForUser } from "../utils/databasehandler";
import { properties } from "../static/config.json";
import "../utils/utils";

/**
 * @param message the original message
 * @param args the arguments entered by the user
 * @param client the client
 * @returns either nothing or an embed
 */
export async function statsEmbed(message: Message, args: string[], client: Client): Promise<any | void> {
    const user = await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id);
    const url = client?.users?.get(user?._id.toString())?.displayAvatarURL;

    if (!user) {
        if (!args[0])
            return message.reply("you haven't created an account yet, please use `.create` first");
        else
            return message.reply("this user hasn't created an account yet!");
    }

    var alliance = user.alliance;

    if (alliance == null)
        alliance = (!args[0]) ? "You haven't joined an alliance yet." : user.tag + ` hasn't joined an alliance yet.`;

    if (user.allianceRank == "M") alliance = "Member of " + alliance;
    else if (user.allianceRank == "C") alliance = "Co-leader of " + alliance;
    else if (user.allianceRank == "L") alliance = "Leader of " + alliance;
    
    var upgrades = (!args[0]) ? "You haven't purchased any upgrades yet." : `${user.tag} hasn't purchased any upgrades yet.`;
    const r: string[] = [];
    if (user.upgrades.population.length !== 0) {
        if (user.upgrades.population.includes("UK")) r.push("UK")
        if (user.upgrades.population.includes("AE")) r.push("Equipment")
        if (user.upgrades.population.includes("RU")) r.push("Russia");
        if (user.upgrades.population.includes("EC")) r.push("Expanded City");
        if (user.upgrades.population.includes("GL")) r.push("Globalization");
        if (user.upgrades.population.includes("MS")) r.push("More Soldiers");
        if (user.upgrades.population.includes("US")) r.push("US");
    }
    if (!user.resources.food) {
        updateValueForUser(user._id, "food", 0, "$set");
        user.resources.food = 0;
    }
    const pf = user.upgrades.pf;
    message.channel.send({
        embed: {
            color: parseInt(properties.embedColor),
            title: `Data for ` + ((typeof args[0] === "undefined") ? `${message.author.tag}` : `${user.tag}`),
            thumbnail: {
                url: url,
            },
            fields: [
                {
                    name: 'Money:',
                    value: user.money.commafy(),
                    inline: true,
                },
                {
                    name: 'Food:',
                    value: user.resources.food.commafy(),
                    inline: true,
                },
                {
                    name: "Population:",
                    value: user.resources.population.commafy(),
                    inline: true
                },
                {
                    name: "Steel:",
                    value: user.resources.steel.commafy(),
                    inline: true
                },
                {
                    name: "Oil",
                    value: user.resources.oil.commafy(),
                    inline: true,
                },
                {
                    name: 'Alliance:',
                    value: alliance,
                    inline: true
                },
                {
                    name: "Personal Farms:",
                    value: `${pf.nf} Nomadic Farming\n` +
                        `${pf.sf} Subsistence Farming\n` +
                        `${pf.sef} Sedentary Farming\n` +
                        `${pf.if} Intensive Farming\n`,
                    inline: true
                },
                {
                    name: "Upgrades:",
                    value: r.length !== 0 ? r.join(", ") : upgrades,
                    inline: true
                }
            ],
            timestamp: new Date(),
            footer: properties.footer,
        }
    });
}