import { unoGame } from "../../utils/interfaces";
import { Client, Message, Emoji, User, MessageReaction } from "discord.js";
import { displayCard } from "./consts";

export async function gameRound(game: unoGame, client: Client) {
    let player = game.players[game.currentPlayer];
    const msg: Message = await client.users.cache.get(player._id)!.send({
        embed: {
            title: "It's your turn, this is your hand:",
            description: "React to chose a card: \n" +
                `${player.hand.map(el => displayCard(el, client)).join(", ")}`,
            color: 0x00FF00,
            timestamp: new Date()
        }
    });

    const r = msg.createReactionCollector(
        (reaction: { emoji: Emoji; }, user: User) => player.hand.includes(reaction.emoji.id!) && !user.bot, 
        { time: 120000 }
    );
    player.hand.forEach(el => msg.react((<Emoji>displayCard(el, client)).id!));
    r.on("collect", async (reaction: MessageReaction) => {
        r.stop();
        player.hand.splice(player.hand.indexOf(reaction), 1);
    });
}