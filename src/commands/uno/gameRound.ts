import { unoGame } from "../../utils/interfaces";
import { Client, Message, Emoji, User, MessageReaction, TextChannel } from "discord.js";
import { displayCard, isValidMove } from "./consts";

export async function gameRound(game: unoGame, client: Client) {
    let player = game.players[game.currentPlayer];
    let msg: Message = await client.users.cache.get(player._id)!.send({
        embed: {
            title: "It's your turn, this is your hand:",
            description: "React to chose a card: \n" +
                `${player.hand.map(el => displayCard(el, client)).join(", ")}`,
            color: 0x00FF00,
            timestamp: new Date()
        }
    });
    player.hand.forEach(async el => isValidMove(el, game.openStack[0]) && await msg.react((<Emoji>displayCard(el, client)).id!));
    msg = await msg.channel.messages.fetch(msg.id);
    console.log(msg.reactions);
    console.log("----------------");
    console.log(msg.reactions.cache.toJSON());
    console.log("----------------");
    const r = msg.createReactionCollector(
        (_reaction: MessageReaction, user: User) => user.id === player._id && !user.bot, 
        { time: 120000 }
    );
    r.on("collect", async (reaction: MessageReaction) => {
        console.log("Reacted");
        const card: string = displayCard(client.emojis.cache.get(reaction.emoji.id!)!, client);
        if(!player.hand.includes(card)) return;
        (<TextChannel>client.channels.cache.get(game.channel)).send(card);
        player.hand.splice(player.hand.indexOf(card, 1));
        r.stop();
    });
}