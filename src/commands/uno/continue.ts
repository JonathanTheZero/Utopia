import { Client, Message } from "discord.js";
import { getUnoGame } from "../../utils/databasehandler";
import { unoGame } from "../../utils/interfaces";
import { gameRound } from "./gameRound";

export async function continueGame(message: Message, args: string[], client: Client) {
    if (!args[0]) return message.reply("please follow the snytax of `.continue <game ID>`.");
    const game: unoGame = await getUnoGame(args[0]);
    if (!game) return message.reply("there is no ongoing game with this ID, make sure you spelled everything right.");
    message.channel.send("Continuing game...");
    gameRound(game, client);
}