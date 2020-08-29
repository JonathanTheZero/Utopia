import { unoGame, unoCard } from "../../utils/interfaces";
import { Client, Message, Emoji, User, MessageReaction, TextChannel } from "discord.js";
import { displayCard, isValidMove } from "./consts";
import { updateGame } from "../../utils/databasehandler";

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
    player.hand.forEach(async el => isValidMove(el, game.openStack[0], game.color) && await msg.react((<Emoji>displayCard(el, client)).id!));
    msg = await msg.channel.messages.fetch(msg.id);
    const r = msg.createReactionCollector(
        (_reaction: MessageReaction, user: User) => user.id === player._id && !user.bot,
        { time: 120000 }
    );
    r.on("collect", async (reaction: MessageReaction) => {
        console.log("Reacted");
        const card: unoCard = displayCard(client.emojis.cache.get(reaction.emoji.id!)!, client);
        if (!player.hand.includes(card)) return;
        (<TextChannel>client.channels.cache.get(game.channel)).send(card);
        player.hand.splice(player.hand.indexOf(card, 1));
        if (card[0] === "s") {
            const reactions = ["🔴", "🔵", "🟢", "🟡"];
            const m = await msg.channel.send({
                embed: pickANewCard(card[1] === "4")
            });
            await Promise.all([
                m.react(reactions[0]),
                m.react(reactions[1]),
                m.react(reactions[2]),
                m.react(reactions[3])
            ]);
            const rm = m.createReactionCollector(
                (_reaction: MessageReaction, user: User) => user.id === player._id && !user.bot,
                { time: 120000 }
            );
            rm.on("collect", async (re: MessageReaction) => {
                if (!reactions.includes(re.emoji.name)) return;
                let col: "g" | "y" | "b" | "r";
                switch (re.emoji.name) {
                    case "🔴": col = "r"; break;
                    case "🔵": col = "b"; break;
                    case "🟢": col = "g"; break;
                    default: col = "y";
                }
                updateGame(game._id, "color", col);
            });
        }
        r.stop();
    });
}

function pickANewCard(plus4: boolean = false) {
    return {
        color: 0x00FF00,
        title: "Pick a new color",
        description: plus4
    };
}