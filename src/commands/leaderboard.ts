import { Message, User } from "discord.js";
import * as config from "../static/config.json";
import { user, alliance } from "../utils/interfaces";
import { getAllUsers, getAllAlliances, getUser } from "../utils/databasehandler";
import "../utils/utils";

export async function leaderboard(message: Message, args: Array<any>) {
    var lbEmbed;
    if (args[0] == "p" || args[0] == "population") {
        try {
            lbEmbed = (typeof args[1] === "undefined") ? await generateLeaderboardEmbed("p", 1, message) : await generateLeaderboardEmbed("p", args[1], message);
            if (args[1] > Math.floor((await getLeaderboardList("p")).length / 10) + 1 || isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
        }
        catch (e) {
            console.error(e);
            return message.reply("that isn't a valid page number!")
        }
    }
    else if (args[0] == "f" || args[0] == "food") {
        try {
            lbEmbed = (typeof args[1] === "undefined") ? await generateLeaderboardEmbed("f", 1, message) : await generateLeaderboardEmbed("f", args[1], message);
            if (args[1] > Math.floor((await getLeaderboardList("f")).length / 10) + 1 || isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
        }
        catch (e) {
            console.error(e);
            return message.reply("that isn't a valid page number!")
        }
    }
    else if (args[0] == "alliances" || args[0] == "alliance" || args[0] == "a") {
        try {
            lbEmbed = (typeof args[1] === "undefined") ? await generateLeaderboardEmbed("a", 1, message) : await generateLeaderboardEmbed("a", args[1], message);
            if (args[1] > Math.floor((await getLeaderboardList("a")).length / 10) + 1 || isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
        }
        catch (e) {
            console.error(e);
            return message.reply("that isn't a valid page number!")
        }
    }
    else if (["wins", "duels", "w"].includes(args[0])) {
        try {
            lbEmbed = (typeof args[1] === "undefined") ? await generateLeaderboardEmbed("w", 1, message) : await generateLeaderboardEmbed("w", args[1], message);
            if (args[1] > Math.floor((await getLeaderboardList("w")).length / 10) + 1 || isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
        }
        catch (e) {
            console.error(e);
            return message.reply("that isn't a valid page number!")
        }
    }
    else {
        if (!isNaN(args[0])) {
            try {
                lbEmbed = await generateLeaderboardEmbed("m", args[0], message);
                if (args[0] > Math.floor((await getLeaderboardList("m")).length / 10) + 1) return message.reply("this isn't a valid page number!");
            }
            catch (e) {
                console.error(e);
                return message.reply("that isn't a valid page number!")
            }
        }
        else {
            try {
                lbEmbed = (typeof args[1] === "undefined") ? await generateLeaderboardEmbed("m", 1, message) : await generateLeaderboardEmbed("m", args[1], message);
                if (args[1] > Math.floor((await getLeaderboardList("m")).length / 10) + 1 || isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
            }
            catch (e) {
                console.error(e);
                return message.reply("that isn't a valid page number!")
            }
        }
    }
    message.channel.send({ embed: lbEmbed });
}

function getLeaderboardList(type: "p" | "f" | "w" | "m"): Promise<user[]>;
function getLeaderboardList(type: "a"): Promise<alliance[]>;
async function getLeaderboardList(type: "p" | "f" | "a" | "w" | "m"): Promise<user[] | alliance[]> {
    let allUsers = await getAllUsers();
    let allAlliances = await getAllAlliances();
    if (type == "p") {
        return allUsers.sort((a: user, b: user) => b.resources.population - a.resources.population);
    }
    else if (type == "f") {
        return allUsers.sort((a: user, b: user) => (b.resources.food) - (a.resources.food));
    }
    else if (type == "a") {
        return allAlliances.sort((a: alliance, b: alliance) => (b.money) - (a.money));
    }
    /*else if (type == "w") {
        return parsedData.sort((a: user, b: user) => (b.duelsWon) - (a.duelsWon));
    }*/
    else {
        return allUsers.sort((a: user, b: user) => (b.money) - (a.money));
    }
}

async function generateLeaderboardEmbed(type: string, page: number, message: Message): Promise<object> {
    var p = page - 1;
    var lbEmbed;

    if (type == "p") {
        var lb = await getLeaderboardList("p");
        var index = lb.findIndex((item: user, i: number) => {
            return item._id == message.author.id;
        });
        lbEmbed = {
            color: parseInt(config.properties.embedColor),
            title: `Leaderboard sorted by population, ${page} of ${(Math.floor(lb.length / 10) + 1)}`,
            description: `Your rank: \`#${index + 1}\``,
            fields: leaderBoardEmbedFields(p, lb, "p"),
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    }

    else if (type == "f") {
        var lb = await getLeaderboardList("f");
        var index = lb.findIndex((item, i) => {
            return item._id == message.author.id;
        });
        lbEmbed = {
            color: parseInt(config.properties.embedColor),
            title: `Leaderboard sorted by food, ${page} of ${(Math.floor(lb.length / 10) + 1)}`,
            description: `Your rank: \`#${index + 1}\``,
            fields: leaderBoardEmbedFields(p, lb, "f"),
            timestamp: new Date(),
            footer: config.properties.footer,
        }
    }

    else if (type == "a") {
        var lba = await getLeaderboardList("a");
        let u: user = await getUser(message.author.id);
        let i = lba.findIndex((item, i) => {
            return item.name == u.alliance;
        });
        var ind = (i == -1) ? "-" : ++i;
        lbEmbed = {
            color: parseInt(config.properties.embedColor),
            title: `Alliance leaderboard sorted by money, ${page} of ${(Math.floor(lba.length / 10) + 1)}`,
            fields: leaderBoardEmbedFields(p, lba, "a"),
            description: `Your rank: \`#${ind}\``,
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    }

    else if (type == "w") {
        var lb = await getLeaderboardList("w");
        var index = lb.findIndex((item, i) => {
            return item._id == message.author.id;
        });
        lbEmbed = {
            color: parseInt(config.properties.embedColor),
            title: `Leaderboard sorted by wins, ${page} of ${(Math.floor(lb.length / 10) + 1)}`,
            description: `Your rank: \`#${index + 1}\``,
            fields: leaderBoardEmbedFields(p, lb, "w"),
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    }

    else {
        var lb = await getLeaderboardList("m");
        var index = lb.findIndex((item, i) => {
            return item._id == message.author.id;
        });
        lbEmbed = {
            color: parseInt(config.properties.embedColor),
            title: `Leaderboard sorted by money, ${page} of ${(Math.floor(lb.length / 10) + 1)}`,
            description: `Your rank: \`#${index + 1}\``,
            fields: leaderBoardEmbedFields(p, lb, "m"),
            timestamp: new Date(),
            footer: config.properties.footer,
        };
    }
    return lbEmbed;
}

function leaderBoardEmbedFields(p: number, lb: any[], type: "p" | "a" | "m" | "f" | "w"): Array<{ name: string; value: string }> {
    var h = ((lb.length - p * 10) > 10) ? 10 : lb.length - p * 10;
    var fields = [];
    if (type == "p") {
        for (var i = 0; i < h; i++) {
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` - " + lb[i + p * 10].tag,
                value: lb[i + p * 10].resources.population.commafy() + " population"
            });
        }
    }
    else if (type == "a") {
        for (var i = 0; i < h; i++) {
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p * 10].name,
                value: lb[i + p * 10].money.commafy() + " coins",
            });
        }
    }
    else if (type == "f") {
        for (var i = 0; i < h; i++) {
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p * 10].tag,
                value: lb[i + p * 10].resources.food.commafy() + " food",
            });
        }
    }
    else if (type == "w") {
        for (var i = 0; i < h; i++) {
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p * 10].tag,
                value: lb[i + p * 10].duelsWon.commafy() + " wins",
            });
        }
    }
    else {
        for (var i = 0; i < h; i++) {
            fields.push({
                name: "`#" + ((i + 1) + (p * 10)) + "` - " + lb[i + p * 10].tag,
                value: lb[i + p * 10].money.commafy() + " coins"
            });
        }
    }
    return fields;
}