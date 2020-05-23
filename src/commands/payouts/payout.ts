import { Message } from "discord.js";
import { getBaseLog, secondsToDhms } from "../../utils/utils";
import "../../utils/utils";
import { getUser, getAlliance, getConfig } from "../../utils/databasehandler";
import { user, alliance, configDB } from "../../utils/interfaces";
import * as config from "../../static/config.json";

export async function payout(message: Message, args: string[]) {
    let user: user = await getUser(message.mentions.users?.first()?.id || args[0] || message.author.id);
    const c: configDB = await getConfig();

    var userPop = 0;
    if (user.upgrades.population.length != 0) {
        if (user.upgrades.population.includes("UK")) userPop += 5000;
        if (user.upgrades.population.includes("AE")) userPop += 10000;
        if (user.upgrades.population.includes("RU")) userPop += 15000;
        if (user.upgrades.population.includes("EC")) userPop += 25000;
        if (user.upgrades.population.includes("GL")) userPop += 50000;
        if (user.upgrades.population.includes("MS")) userPop += 200000;
        if (user.upgrades.population.includes("US")) userPop += 750000;
    }

    var userFood = 0;
    if (user.alliance != null) {
        let alliance: alliance = await getAlliance(user.alliance) as alliance;
        if (user.allianceRank == "L") {
            userFood = Math.floor((alliance.upgrades.af * 15000 + Math.floor(((alliance.upgrades.af * 120000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
                alliance.upgrades.pf * 100000 + Math.floor(((alliance.upgrades.pf * 800000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
                alliance.upgrades.mf * 500000 + Math.floor(((alliance.upgrades.mf * 4000000) / (alliance.members.length + alliance.coLeaders.length + 1)))) * 1.2 ** alliance.clientStates);
            if (alliance.coLeaders.length == 0)
                userFood += Math.floor((alliance.upgrades.af * 15000 + alliance.upgrades.pf * 100000 + alliance.upgrades.mf * 500000) * 1.2 ** alliance.clientStates);
        }
        else if (user.allianceRank == "C") {
            userFood = Math.floor((alliance.upgrades.af * 7500 + Math.floor(((alliance.upgrades.af * 120000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
                alliance.upgrades.mf * 250000 + Math.floor(((alliance.upgrades.mf * 4000000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
                alliance.upgrades.pf * 50000 + Math.floor(((alliance.upgrades.pf * 800000) / (alliance.members.length + alliance.coLeaders.length + 1)))) * 1.2 ** alliance.clientStates);
        }
        else if (user.allianceRank == "M") {
            userFood = Math.floor((Math.floor(((alliance.upgrades.af * 120000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
                Math.floor(((alliance.upgrades.mf * 4000000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
                Math.floor(((alliance.upgrades.pf * 800000) / (alliance.members.length + alliance.coLeaders.length + 1)))) * 1.2 ** alliance.clientStates);
        }
    }

    var u: number = 0;
    if (user.upgrades.pf.nf > 0) u += (user.upgrades.pf.nf * 500000);
    if (user.upgrades.pf.sf > 0) u += (user.upgrades.pf.sf * 1000000);
    if (user.upgrades.pf.sef > 0) u += (user.upgrades.pf.sef * 5000000);
    if (user.upgrades.pf.if > 0) u += (user.upgrades.pf.if * 10000000);
    userFood += u;

    message.channel.send({
        embed: {
            color: parseInt(config.properties.embedColor),
            title: `Next payout stats for ${user.tag}`,
            fields: [
                {
                    name: "Population:",
                    value: userPop.commafy(),
                    inline: true
                },
                {
                    name: "Money",
                    value: `Between ${Math.floor(user.resources.population / 15).commafy()} and ${Math.floor(user.resources.population / 8).commafy()}`,
                    inline: true
                },
                {
                    name: "Food:",
                    value: userFood.commafy(),
                    inline: true
                },
                {
                    name: "How much will your population consume next payout?",
                    value: Math.floor(user.resources.population * (2 + getBaseLog(10, getBaseLog(10, getBaseLog(3, user.resources.population))))).commafy() || 0,
                    inline: false
                },
                {
                    name: "Next Food and Population payout",
                    value: secondsToDhms(14400 + (c.lastPayout - Math.floor(Date.now() / 1000))) ||
                        "*if you see this something went wrong and the payouts stopped, please contact the owner ASAP*",
                    inline: true
                },
                {
                    name: "Next Food consumption and Money payout",
                    value: secondsToDhms((14400 * 3) + (c.lastPopulationWorkPayout - Math.floor(Date.now() / 1000))) ||
                        "*if you see this something went wrong and the payouts stopped, please contact the owner ASAP*",
                    inline: true
                }
            ],
            footer: config.properties.footer,
            timestamp: new Date()
        }
    });
}

export async function alliancePayout(message: Message, args: string[]) {
    var total = [0, 0, 0]; //leader at 0, cos at 1, members at 2
    let user: user = await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id);

    if (!user)
        return message.reply((!args[0]) ? "you haven't created an account yet, please use `.create` first" : "this user hasn't created an account yet!")
    var alliance: alliance | null = await getAlliance(<string>user.alliance);
    if (!alliance) return message.reply((!args[0]) ? "you haven't joined an alliance yet" : "this user hasn't joined an alliance yet");

    total[0] = Math.floor((alliance.upgrades.af * 15000 + Math.floor(((alliance.upgrades.af * 120000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
        alliance.upgrades.pf * 100000 + Math.floor(((alliance.upgrades.pf * 800000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
        alliance.upgrades.mf * 500000 + Math.floor(((alliance.upgrades.mf * 4000000) / (alliance.members.length + alliance.coLeaders.length + 1)))) * 1.2 ** alliance.clientStates);
    total[1] = Math.floor((alliance.upgrades.af * 7500 + Math.floor(((alliance.upgrades.af * 120000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
        alliance.upgrades.pf * 50000 + Math.floor(((alliance.upgrades.pf * 800000) / (alliance.members.length + alliance.coLeaders.length + 1))) +
        alliance.upgrades.mf * 250000 + Math.floor(((alliance.upgrades.mf * 4000000) / (alliance.members.length + alliance.coLeaders.length + 1)))) * 1.2 ** alliance.clientStates);
    total[2] = Math.floor((Math.floor((alliance.upgrades.af * 120000) / (alliance.members.length + alliance.coLeaders.length + 1)) +
        Math.floor((alliance.upgrades.pf * 800000) / (alliance.members.length + alliance.coLeaders.length + 1)) +
        Math.floor((alliance.upgrades.mf * 4000000) / (alliance.members.length + alliance.coLeaders.length + 1))) * 1.2 ** alliance.clientStates);
    if (alliance.coLeaders.length == 0) {
        total[0] += Math.floor((alliance.upgrades.af * 15000 +
            alliance.upgrades.pf * 100000 +
            alliance.upgrades.mf * 500000) * 1.2 ** alliance.clientStates);
        total[1] = 0;
    }

    if (alliance.members.length === 0)
        total[2] = 0;

    return message.channel.send({
        embed: {
            color: parseInt(config.properties.embedColor),
            title: `Payout for ${alliance.name}`,
            fields: [
                {
                    name: "The Leader will receive:",
                    value: `${total[0].commafy()} food`
                },
                {
                    name: "The Co-Leaders will receive:",
                    value: `${total[1].commafy()} food`
                },
                {
                    name: "Members will receive:",
                    value: `${total[2].commafy()} food`
                }
            ],
            timestamp: new Date(),
            footer: config.properties.footer
        }
    });
}