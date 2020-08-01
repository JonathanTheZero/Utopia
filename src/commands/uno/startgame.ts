import { Message } from "discord.js";
import { unoGame } from "../../utils/interfaces";
import { getUnoGame, setPlayerHand, setStack, setGameStarted } from "../../utils/databasehandler";
//import * as config from "../../static/config.json";

export async function startGame(message: Message, args: string[]) {
    if (!args[0]) return message.reply("please follow the syntax of `.start-uno <gameID>`.\nOnly the game initiliazer can start the game.");
    const game: unoGame = await getUnoGame(args[0]);
    if (!game) return message.reply(`there is no game with the ID ${args[0].commafy()}`);
    if (game.players[0]._id !== message.author.id) return message.reply("you are not the initliazer of the game, you are not allowed to start it.");
    for (let i = 0; i < game.players.length; ++i) {
        setPlayerHand(game._id, i, [
            game.stack.shift()!,
            game.stack.shift()!,
            game.stack.shift()!,
            game.stack.shift()!,
            game.stack.shift()!,
            game.stack.shift()!,
            game.stack.shift()!
        ]);
    }
    setStack(game._id, game.stack);
    setGameStarted(game._id, true);
    message.reply(JSON.stringify(await getUnoGame(args[0])));
}
