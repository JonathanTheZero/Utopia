import { Message } from "discord.js";
import { unoGame } from "../../utils/interfaces";
import { getUnoGame } from "../../utils/databasehandler";

export async function joinGame(message: Message, args: string[]) {
    if (!args[0]) return message.reply("please specifiy a game following the syntax of `.join-game <id>`.");
    const game: unoGame = await getUnoGame(args[0]);
    if(!game) return message.reply("there is no running game with this ID!");
}