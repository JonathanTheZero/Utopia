import { Message } from "discord.js";
import { unoGame } from "../../utils/interfaces";
import { shuffle } from "../../utils/utils";
import { stack } from "./consts";
import { getGameID, addUnoGame } from "../../utils/databasehandler";
import * as config from "../../static/config.json";

export async function startGame(message: Message, args: string[]) {
    if (!args[0] || !parseInt(args[0]) || isNaN(parseInt(args[0]))) return message.reply("please follow the syntax of `.start-uno <fee>`.");
    const game: unoGame = {
        _id: (await getGameID()).toString(),
        players: [{
            _id: message.author.id,
            hand: []
        }],
        stack: shuffle<string>(stack),
        openStack: [],
        fee: parseInt(args[0])
    };
    message.reply("bsfddsf")
    await addUnoGame(game).catch(console.log);
    message.reply("abbb")
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
