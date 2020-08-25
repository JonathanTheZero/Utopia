import { Message } from "discord.js";
import * as config from "../static/config.json";
import { user, alliance } from "../utils/interfaces";
import { getAllUsers, getAllAlliances, getUser } from "../utils/databasehandler";
import "../utils/utils";
import { backwardsFilter, forwardsFilter } from "../utils/utils";

export async function leaderboard(message: Message, args: Array<any>) {
    let symbol: "m" | "p" | "f" | "a" | "o" | "s" | "v" = "m", page: number = typeof args[1] === "undefined" ? isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]) : args[1];;
    switch (args[0]?.[0]) {
        case "p": symbol = "p"; break;
        case "f": symbol = "f"; break;
        case "a": symbol = "a"; break;
        case "o": symbol = "o"; break;
        case "s": symbol = "s"; break;
        case "v": symbol = "v"; break;
        default: symbol = "m";
    }
    if (page > Math.floor((await getLeaderboardList("m")).length / 10) + 1 || isNaN(page) && typeof page !== "undefined")
        return message.reply("this isn't a valid page number!");
    const m: Message = <Message>(await message.channel.send({ embed: await generateLeaderboardEmbed(symbol, page, message) }));
    await m.react("⬅")
    await m.react("➡");

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await generateLeaderboardEmbed(symbol, --page, message) });
    });
    forwards.on('collect', async () => {
        m.reactions.cache.forEach(reaction => reaction.users.remove(message.author.id));
        m.edit({ embed: await generateLeaderboardEmbed(symbol, ++page, message) });
    });
}

async function getLeaderboardList(type: "p" | "f" | "m" | "o" | "s" | "v"): Promise<user[]>;
async function getLeaderboardList(type: "a"): Promise<alliance[]>;
async function getLeaderboardList(type: "a" | "p" | "f" | "o" | "m" | "s" | "v"): Promise<Array<user | alliance>> {
    let allUsers = await getAllUsers(), allAlliances = await getAllAlliances();
    if (type === "p") return allUsers.sort((a: user, b: user) => b.resources.population - a.resources.population);
    else if (type === "f") return allUsers.sort((a: user, b: user) => (b.resources.food) - (a.resources.food));
    else if (type === "a") return allAlliances.sort((a: alliance, b: alliance) => (b.money) - (a.money));
    else if (type === "o") return allUsers.sort((a, b) => b.resources.oil - a.resources.oil);
    else if (type === "s") return allUsers.sort((a, b) => b.resources.steel - a.resources.steel);
    else if (type === "v") return allUsers.sort((a, b) => b.highestVotingStreak - a.highestVotingStreak);
    else return allUsers.sort((a: user, b: user) => (b.money) - (a.money));
}

async function generateLeaderboardEmbed(type: "a" | "p" | "f" | "o" | "m" | "s" | "v", page: number, message: Message): Promise<object> {
    let p = page - 1,
        lb = [],
        index,
        fields = [],
        title = "";
    if (type !== "a") {
        lb = await getLeaderboardList(type);
        index = lb.findIndex(item => item._id == message.author.id);
        fields = leaderBoardEmbedFields(p, lb, type);
        if (type === "p") title = `Leaderboard sorted by population, ${page} of ${(Math.floor(lb.length / 10) + 1)}`;
        else if (type === "m") title = `Leaderboard sorted by money, ${page} of ${(Math.floor(lb.length / 10) + 1)}`;
        else if (type === "f") title = `Leaderboard sorted by food, ${page} of ${(Math.floor(lb.length / 10) + 1)}`;
        else if (type === "s") title = `Leaderboard sorted by steel, ${page} of ${(Math.floor(lb.length / 10) + 1)}`;
        else if (type === "o") title = `Leaderboard sorted by oil, ${page} of ${(Math.floor(lb.length / 10) + 1)}`;
        else if (type === "v") title = `Leaderboard sorted by voting streaks, ${page} of ${(Math.floor(lb.length / 10) + 1)}`;
    } else {
        lb = await getLeaderboardList("a");
        let u: user = await getUser(message.author.id);
        index = lb.findIndex(item => item.name === u.alliance);
        title = `Alliance leaderboard sorted by money, ${page} of ${(Math.floor(lb.length / 10) + 1)}`;
        fields = leaderBoardEmbedFields(p, lb, "a");
    }
    return {
        color: parseInt(config.properties.embedColor),
        title,
        fields,
        description: `Your rank: \`#${index + 1 || "-"}\``,
        timestamp: new Date(),
        footer: config.properties.footer,
    };
}

function leaderBoardEmbedFields(p: number, lb: any[], type: "p" | "a" | "m" | "f" | "o" | "s" | "v"): Array<{ name: string; value: string }> {
    var h = ((lb.length - p * 10) > 10) ? 10 : lb.length - p * 10;
    const fields = [];
    if (["a", "m"].includes(type)) {
        for (var i = 0; i < h; ++i)
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` " + (lb[i + p * 10].name || lb[i + p * 10].tag),
                value: lb[i + p * 10].money.commafy() + " coins",
            });
    } else if (type === "v") {
        for (var i = 0; i < h; ++i)
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` - " + lb[i + p * 10].tag,
                value: (<user[]>lb)[i + p * 10].highestVotingStreak?.commafy() + ` votes`
            });
    } else {
        let res: string;
        switch (type) {
            case "p": res = "population"; break;
            case "o": res = "oil"; break;
            case "f": res = "food"; break;
            case "s": res = "steel"; break;
        }
        for (var i = 0; i < h; ++i)
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` - " + lb[i + p * 10].tag,
                value: lb[i + p * 10].resources[res!].commafy() + ` ${res!}`
            });
    }
    return fields;
}