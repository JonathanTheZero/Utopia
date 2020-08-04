import { Message, TextChannel, Client } from "discord.js";
import { unoGame } from "../../utils/interfaces";
import { getUnoGame, setPlayerHand, updateGame } from "../../utils/databasehandler";
import * as config from "../../static/config.json";
import { displayCard } from "./consts";

export async function startGame(message: Message, args: string[], client: Client) {
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
    game.openStack.unshift(game.stack.shift()!);
    updateGame(game._id, "stack", game.stack);
    updateGame(game._id, "openStack", game.stack);
    updateGame(game._id, "started", true);
    message.reply(JSON.stringify(await getUnoGame(args[0])));
    message.reply((await getUnoGame(args[0])).stack.length);
    (<TextChannel>client.channels.cache.get(game.channel)).send({
        embed: {
            title: `${message.author.tag} started the game, it's their first turn`,
            description: `The open card is a ${displayCard(game.openStack[0], client)}`,
            color: 0x00FF00,
            footer: config.properties.footer,
            timestamp: new Date()
        }
    });
}
