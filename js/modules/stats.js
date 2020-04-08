"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databasehandler_1 = require("../utils/databasehandler");
const config_json_1 = require("../config.json");
require("../utils/utils");
/**
 *
 * @param message the original message
 * @param args the arguments entered by the user
 * @param client the client
 * @returns either nothing or an embed
 */
async function statsEmbed(message, args, client) {
    var _a, _b;
    var user;
    var url;
    if (typeof args[0] === "undefined") {
        user = await databasehandler_1.getUser(message.author.id);
        url = `${message.author.displayAvatarURL}`;
    }
    else {
        try {
            user = await databasehandler_1.getUser(message.mentions.users.first().id);
            url = `${message.mentions.users.first().displayAvatarURL}`;
        }
        catch (_c) {
            user = await databasehandler_1.getUser(args[0]);
            url = (_b = (_a = client === null || client === void 0 ? void 0 : client.users) === null || _a === void 0 ? void 0 : _a.get(user._id.toString())) === null || _b === void 0 ? void 0 : _b.displayAvatarURL;
        }
    }
    if (!user) {
        if (typeof args[0] !== "undefined")
            return message.reply("you haven't created an account yet, please use `.create` first");
        else
            return message.reply("this user hasn't created an account yet!");
    }
    var alliance = user.alliance;
    if (!alliance) {
        alliance = (typeof args[0] === "undefined") ? "You haven't joined an alliance yet." : user.tag + ` hasn't joined an alliance yet.`;
    }
    if (user.allianceRank == "M") {
        alliance = "Member of " + alliance;
    }
    else if (user.allianceRank == "C") {
        alliance = "Co-leader of " + alliance;
    }
    else if (user.allianceRank == "L") {
        alliance = "Leader of " + alliance;
    }
    var upgrades = (typeof args[0] === "undefined") ? "You haven't purchased any upgrades yet." : `${user.tag} hasn't purchased any upgrades yet.`;
    if (user.upgrades.population.length != 0) {
        upgrades = "\u200b";
        if (user.upgrades.population.includes("UK"))
            upgrades += "UK";
        if (user.upgrades.population.includes("AE"))
            upgrades += ", Equipment";
        if (user.upgrades.population.includes("RU"))
            upgrades += ", Russia";
        if (user.upgrades.population.includes("EC"))
            upgrades += ", Expanded City";
        if (user.upgrades.population.includes("GL"))
            upgrades += ", Globalization";
        if (user.upgrades.population.includes("MS"))
            upgrades += ", More Soldiers";
        if (user.upgrades.population.includes("US"))
            upgrades += ", US";
    }
    if (user.resources.food == null)
        user.resources.food = 0;
    const pf = user.upgrades.pf;
    message.channel.send({
        embed: {
            color: parseInt(config_json_1.properties.embedColor),
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
                    value: upgrades,
                    inline: true
                }
            ],
            timestamp: new Date(),
            footer: config_json_1.properties.footer,
        }
    });
}
exports.statsEmbed = statsEmbed;
