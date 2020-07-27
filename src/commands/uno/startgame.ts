import { Message } from "discord.js";
import { unoGame } from "../../utils/interfaces";
import { shuffle } from "../../utils/utils";
import { stack } from "./consts";

export function startGame(message: Message, args: string[]) {
    if (!args[0] || !parseInt(args[0]) || isNaN(parseInt(args[0]))) return message.reply("please follow the syntax of `.start-uno <fee>`.");
    const game: unoGame = {
        _id: message.id,
        players: [{
            _id: message.author.id,
            hand: []
        }],
        stack: shuffle<string>(stack),
        openStack: [],
        fee: parseInt(args[0])
    };
}
