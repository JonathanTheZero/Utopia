import { Message } from "discord.js";
import * as config from "../static/config.json";
import { user, alliance } from "../utils/interfaces";
import { getAllUsers, getAllAlliances, getUser } from "../utils/databasehandler";
import "../utils/utils";

export async function leaderboard(message: Message, args: Array<any>) {
    let symbol: "m" | "p" | "f" | "a" | "o" | "s" = "m", page: number = typeof args[1] === "undefined" ? isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]) : args[1];;
    switch (args[0]?.[0]) {
        case "p": symbol = "p"; break;
        case "f": symbol = "f"; break;
        case "a": symbol = "a"; break;
        case "o": symbol = "o"; break;
        case "s": symbol = "s"; break;
        default: symbol = "m";
    }
    if (page > Math.floor((await getLeaderboardList("m")).length / 10) + 1 || isNaN(page) && typeof page !== "undefined")
        return message.reply("this isn't a valid page number!");
    const m: Message = <Message>(await message.channel.send({ embed: await generateLeaderboardEmbed(symbol, page, message) }));

    await m.react("⬅")
    await m.react("➡");
    const backwardsFilter = (reaction: { emoji: { name: string; }; }, user: { id: string; }) => reaction.emoji.name === '⬅' && user.id === message.author.id;
    const forwardsFilter = (reaction: { emoji: { name: string; }; }, user: { id: string; }) => reaction.emoji.name === '➡' && user.id === message.author.id;

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.forEach(reaction => reaction.remove(message.author.id));
        m.edit({ embed: await generateLeaderboardEmbed(symbol, --page, message) });
    });
    forwards.on('collect', async () => {
        m.reactions.forEach(reaction => reaction.remove(message.author.id));
        m.edit({ embed: await generateLeaderboardEmbed(symbol, ++page, message) });
    });
}

async function getLeaderboardList(type: "p" | "f" | "m" | "o" | "s"): Promise<user[]>;
async function getLeaderboardList(type: "a"): Promise<alliance[]>;
async function getLeaderboardList(type: "p" | "f" | "a" | "o" | "m" | "s"): Promise<user[] | alliance[]> {
    let allUsers = await getAllUsers();
    let allAlliances = await getAllAlliances();
    if (type === "p") return allUsers.sort((a: user, b: user) => b.resources.population - a.resources.population);
    else if (type === "f") return allUsers.sort((a: user, b: user) => (b.resources.food) - (a.resources.food));
    else if (type === "a") return allAlliances.sort((a: alliance, b: alliance) => (b.money) - (a.money));
    else if (type === "o") return allUsers.sort((a, b) => b.resources.oil - a.resources.oil);
    else if (type === "s") return allUsers.sort((a, b) => b.resources.steel - a.resources.steel);
    else return allUsers.sort((a: user, b: user) => (b.money) - (a.money));
}

async function generateLeaderboardEmbed(type: "a" | "p" | "f" | "o" | "m" | "s", page: number, message: Message): Promise<object> {
    var p = page - 1;
    if (type === "p") {
        var lb = await getLeaderboardList("p");
        var index = lb.findIndex(item => item._id == message.author.id);
        return {
            color: parseInt(config.properties.embedColor),
            title: `Leaderboard sorted by population, ${page} of ${(Math.floor(lb.length / 10) + 1)}`,
            description: `Your rank: \`#${index + 1}\``,
            fields: leaderBoardEmbedFields(p, lb, "p"),
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    } else if (type === "f") {
        var lb = await getLeaderboardList("f");
        var index = lb.findIndex(item => item._id == message.author.id);
        return {
            color: parseInt(config.properties.embedColor),
            title: `Leaderboard sorted by food, ${page} of ${(Math.floor(lb.length / 10) + 1)}`,
            description: `Your rank: \`#${index + 1}\``,
            fields: leaderBoardEmbedFields(p, lb, "f"),
            timestamp: new Date(),
            footer: config.properties.footer,
        }
    } else if (type === "a") {
        var lba = await getLeaderboardList("a");
        let u: user = await getUser(message.author.id);
        let i = lba.findIndex(item => item.name == u.alliance);
        var ind = (i === -1) ? "-" : ++i;
        return {
            color: parseInt(config.properties.embedColor),
            title: `Alliance leaderboard sorted by money, ${page} of ${(Math.floor(lba.length / 10) + 1)}`,
            fields: leaderBoardEmbedFields(p, lba, "a"),
            description: `Your rank: \`#${ind}\``,
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    } else if (type === "o") {
        var lb = await getLeaderboardList("o");
        var index = lb.findIndex(item => item._id == message.author.id);
        return {
            color: parseInt(config.properties.embedColor),
            title: `Leaderboard sorted by oil, ${page} of ${(Math.floor(lb.length / 10) + 1)}`,
            description: `Your rank: \`#${index + 1}\``,
            fields: leaderBoardEmbedFields(p, lb, "o"),
            timestamp: new Date(),
            footer: config.properties.footer,
        }
    } else if (type === "s") {
        var lb = await getLeaderboardList("s");
        var index = lb.findIndex(item => item._id == message.author.id);
        return {
            color: parseInt(config.properties.embedColor),
            title: `Leaderboard sorted by oil, ${page} of ${(Math.floor(lb.length / 10) + 1)}`,
            description: `Your rank: \`#${index + 1}\``,
            fields: leaderBoardEmbedFields(p, lb, "s"),
            timestamp: new Date(),
            footer: config.properties.footer,
        }
    } else {
        var lb = await getLeaderboardList("m");
        var index = lb.findIndex(item => item._id == message.author.id);
        return {
            color: parseInt(config.properties.embedColor),
            title: `Leaderboard sorted by money, ${page} of ${(Math.floor(lb.length / 10) + 1)}`,
            description: `Your rank: \`#${index + 1}\``,
            fields: leaderBoardEmbedFields(p, lb, "m"),
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    }
}

function leaderBoardEmbedFields(p: number, lb: any[], type: "p" | "a" | "m" | "f" | "o" | "s"): Array<{ name: string; value: string }> {
    var h = ((lb.length - p * 10) > 10) ? 10 : lb.length - p * 10;
    const fields = [];
    if (type === "p") {
        for (var i = 0; i < h; i++)
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` - " + lb[i + p * 10].tag,
                value: lb[i + p * 10].resources.population.commafy() + " population"
            });
    } else if (type === "a") {
        for (var i = 0; i < h; i++)
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p * 10].name,
                value: lb[i + p * 10].money.commafy() + " coins",
            });
    } else if (type === "f") {
        for (var i = 0; i < h; i++)
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p * 10].tag,
                value: lb[i + p * 10].resources.food.commafy() + " food",
            });
    } else if (type === "o") {
        for (var i = 0; i < h; i++)
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p * 10].tag,
                value: lb[i + p * 10].resources.oil.commafy() + " oil",
            });
    } else if (type === "s") {
        for (var i = 0; i < h; i++)
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p * 10].tag,
                value: lb[i + p * 10].resources.steel.commafy() + " steel",
            });
    } else {
        for (var i = 0; i < h; i++)
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` - " + lb[i + p * 10].tag,
                value: lb[i + p * 10].money.commafy() + " coins"
            });
    }
    return fields;
}