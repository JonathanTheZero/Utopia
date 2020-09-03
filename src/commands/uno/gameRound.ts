import { unoGame, unoCard } from "../../utils/interfaces";
import { Client, Message, Emoji, User, MessageReaction, TextChannel } from "discord.js";
import { displayCard, isValidMove, reactions } from "./consts";
import { updateGame, updateValueForUser, deleteUnoGame, setPlayerHand, getUnoGame } from "../../utils/databasehandler";
import * as config from "../../static/config.json";
import { shuffle, Sleep } from "../../utils/utils";

export async function gameRound(game: unoGame, client: Client): Promise<void> {
    let player = game.players[game.currentPlayer],
        msg: Message = await client.users.cache.get(player._id)!.send({
            embed: {
                title: "It's your turn, this is your hand:",
                description: "React to chose a card: \n" +
                    `${player.hand.map(el => displayCard(el, client)).join(", ")}`,
                color: 0x00FF00,
                timestamp: new Date(),
                footer: config.properties.footer
            }
        });
    player.hand.forEach(
        async el => isValidMove(el, game.openStack[0], game.color) && await msg.react((<Emoji>displayCard(el, client)).id!)
    );
    msg = await msg.channel.messages.fetch(msg.id);
    const r = msg.createReactionCollector(
        (_reaction: MessageReaction, user: User) => user.id === player._id && !user.bot,
        { time: 120000 }
    );
    if (msg.reactions.cache.size == 0) {
        if (game.alreadyDrawed) {
            msg.channel.send({
                embed: {
                    title: "There was no valid card for you to use",
                    description: "As you already got an extra card, you will be skipped this round."
                }
            });
            moveRound(game);
        } else {
            msg.channel.send({
                embed: {
                    title: "There was no valid card for you to use",
                    description: "You received an extra card from the stack."
                }
            });
            let card = game.stack.shift();
            if (!card) {
                const o = game.openStack[0];
                game.stack = shuffle(game.openStack);
                game.openStack = [o];
                card = game.stack.shift()!;
            }
            player.hand.push(card);
            await Promise.all([
                updateGame(game._id, "alreadyDrawed", true),
                updateGame(game._id, "openStack", game.openStack),
                updateGame(game._id, "stack", game.stack),
                setPlayerHand(game._id, game.currentPlayer, player.hand)
            ]);
            return gameRound(await getUnoGame(game._id), client);
        }
    }
    let nextPlayer: { _id: string; hand: unoCard[]; } = await moveRound(game),
        description: string = "";
    r.on("collect", async (reaction: MessageReaction) => {
        console.log("Reacted");
        const card: unoCard = displayCard(client.emojis.cache.get(reaction.emoji.id!)!, client);
        if (!player.hand.includes(card)) return;
        player.hand.splice(player.hand.indexOf(card, 1));
        game.openStack.unshift(card);
        await updateGame(game._id, "openStack", game.openStack);
        description = `The open card is a ${displayCard(game.openStack[0], client)}.`;
        if (game.drawCount && card[1] !== "+") {
            msg.channel.send({
                embed: { title: `You need to draw ${game.drawCount} cards` }
            });
            for (let i = 0; i < game.drawCount; ++i) {
                let card = game.stack.shift();
                if (!card) {
                    const o = game.openStack[0];
                    game.stack = shuffle(game.openStack);
                    game.openStack = [o];
                    card = game.stack.shift()!;
                }
                player.hand.push(card);
                await Promise.all([
                    updateGame(game._id, "openStack", game.openStack),
                    updateGame(game._id, "stack", game.stack),
                    setPlayerHand(game._id, game.currentPlayer, player.hand)
                ]);
            }
        }
        if (card[1] === "s") {
            nextPlayer = await moveRound(game);
            r.stop("Done");
        } else if (card[1] === "+") {
            updateGame(game._id, "drawCount", game.drawCount + 2);
            r.stop("Done");
        } else if (card[1] === "r") {
            updateGame(game._id, "reverseOrder", !game.reverseOrder);
            r.stop("Done");
        } else if (card[0] === "s") {
            const m = await msg.channel.send({ embed: pickANewCard(card[1] === "4") });
            await Promise.all(reactions.map(m.react));
            if (card[1] === "4") updateGame(game._id, "drawCount", game.drawCount + 4);
            const rm = m.createReactionCollector(
                (_reaction: MessageReaction, user: User) => user.id === player._id && !user.bot,
                { time: 300000 }
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
                await updateGame(game._id, "color", col);
                description += `\nThe open color is ${re.emoji.name}`;
                rm.stop("Done");
                await Sleep(5000);
                r.stop("Done");
            });
            rm.on("end", async (_collected, reason) => {
                if (reason === "Done") return;
                const co = reactions[Math.floor(Math.random() * reactions.length)];
                msg.channel.send({
                    embed: { 
                        title: "You did not react in time, the game automatically chose a color for you.",
                        description: `It chose ${co}`,
                        timestamp: new Date()
                    }
                });
                let col: "g" | "y" | "b" | "r";
                switch (co) {
                    case "🔴": col = "r"; break;
                    case "🔵": col = "b"; break;
                    case "🟢": col = "g"; break;
                    default: col = "y";
                }
                await updateGame(game._id, "color", col);
            });
        } else { r.stop("Done") }
        if (player.hand.length == 0) {
            (<TextChannel>client.channels.cache.get(game.channel)).send({
                embed: {
                    title: `${client.users.cache.get(player._id)?.tag} won the round!`,
                    description: `The price is ${(game.players.length * game.fee).commafy()} money`,
                    color: 0x00FF00,
                    footer: config.properties.footer,
                    timestamp: new Date()
                }
            });
            await Sleep(2000);
            await Promise.all([
                updateValueForUser(player._id, "money", game.players.length * game.fee, "$inc"),
                deleteUnoGame(game._id)
            ]);
            return;
        }
    });
    r.on("end", async (_collected, reason) => {
        if (reason !== "Done") return;
        (<TextChannel>client.channels.cache.get(game.channel)).send({
            embed: {
                title: `It's ${client.users.cache.get(nextPlayer._id)?.tag}'s turn`,
                description,
                color: 0x00FF00,
                footer: config.properties.footer,
                timestamp: new Date()
            }
        });
        gameRound(game, client);
    });
}

function pickANewCard(plus4: boolean = false) {
    return {
        color: 0x00FF00,
        title: "Pick a new color",
        description: plus4 ? "The next player will need to draw 4 cards" : "The next player won't need to draw 4 cards",
        timestamp: new Date(),
        footer: config.properties.footer
    };
}

async function moveRound(game: unoGame) {
    if (game.reverseOrder) {
        if (game.currentPlayer == 0) {
            await updateGame(game._id, "currentPlayer", game.players.length - 1);
            return game.players[game.players.length - 1];
        }
        await updateGame(game._id, "currentPlayer", game.currentPlayer - 1);
        return game.players[game.currentPlayer - 1];
    }
    if (game.currentPlayer + 1 == game.players.length) {
        await updateGame(game._id, "currentPlayer", 0);
        return game.players[0];
    }
    await updateGame(game._id, "currentPlayer", game.currentPlayer + 1);
    return game.players[game.currentPlayer + 1];
}