import { Message } from "discord.js";
import { unoGame, user } from "../../utils/interfaces";
import { getGameID, addUnoGame, getUser, updateValueForUser } from "../../utils/databasehandler";
import { shuffle } from "../../utils/utils";
import { stack } from "./consts";
import * as config from "../../static/config.json";

export async function uno(message: Message, args: string[]) {
    if (!args[0] || !parseInt(args[0]) || isNaN(parseInt(args[0]))) return message.reply("please follow the syntax of `.uno <fee>`.");
    const fee = parseInt(args[0]),
        u: user = await getUser(message.author.id);
    if (!u) return message.reply("you haven't created an account yet, please use `.create`.");
    if (fee < 0 || isNaN(fee) || [Infinity, -Infinity].includes(fee)) return message.reply("please choose a valid amount!");
    if (fee > u.money) return message.reply("you can't set a fee that's higher than your current balance!");
    updateValueForUser(u._id, "money", -fee, "$inc");
    const game: unoGame = {
        _id: (await getGameID()).toString(),
        players: [{
            _id: message.author.id,
            hand: []
        }],
        stack: shuffle<string>(stack),
        openStack: [],
        fee,
        channel: message.channel.id,
        started: false,
        currentPlayer: 0,
        drawCount: 0,
        color: null
    };
    await addUnoGame(game).catch(console.log);
    message.channel.send({
        embed: {
            color: 0x00FF00,
            title: `${message.author.tag} started a uno game`,
            description: `The entry fee is ${game.fee.commafy()} money.\n` +
                `Use \`.join-game ${game._id}\` in order to join.`,
            footer: config.properties.footer,
            timestamp: new Date()
        }
    });
}