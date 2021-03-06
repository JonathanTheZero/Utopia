import { Message, Client, TextChannel } from "discord.js";
import { unoGame, user } from "../../utils/interfaces";
import { getUnoGame, addPlayer, getUser, updateValueForUser } from "../../utils/databasehandler";
import * as config from "../../static/config.json";

export async function joinGame(message: Message, args: string[], client: Client) {
    if (!args[0]) return message.reply("please specifiy a game following the syntax of `.join-game <id>`.");
    const game: unoGame = await getUnoGame(args[0]),
        u: user = await getUser(message.author.id);
    if (!u) return message.reply("you haven't created an account yet, please use `.create`.");
    if (!game) return message.reply("there is no running game with this ID!");
    if (game.players.length === 10) return message.reply("this game is full, there are already 10 players participating.");
    if (game.started) return message.reply("this game has already started, you can't join anymore!");
    if (game.players.some(p => p._id === message.author.id)) return message.reply("you are already part of this game!");
    if (u.money < game.fee) return message.reply(`you only have ${u.money.commafy()} money but need ${game.fee} to participate!`);
    addPlayer(game._id, { _id: message.author.id, hand: [] });
    updateValueForUser(u._id, "money", -game.fee, "$inc");
    (<TextChannel>client.channels.cache.get(game.channel)).send({
        embed: {
            title: `${message.author.tag} joined the game`,
            description: `${game.players.length + 1}/10 players are now in the game.`,
            color: 0x00FF00,
            footer: config.properties.footer,
            timestamp: new Date()
        }
    });
}