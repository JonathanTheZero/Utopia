import { Message, Client, TextChannel } from "discord.js";

export async function modmail(message: Message, args: string[], client: Client) {
    if (!args[2]) return message.reply("The command is `.mail <suggestion | mods> message`");
    if (args[0]?.[0] === "s") {
        let channel = <TextChannel>client.channels.get("621046082859958275");
        channel.send({
            embed: {
                title: `New Suggestion from ${message.author.username}`,
                description: `${message.author.id}\n${args.slice(1).join(" ")}`,
                color: 0xFF0000,
                timestmap: new Date()
            }
        })
    } else if (args[0]?.[0] === "m") {
        let channel = <TextChannel>client.channels.get("721062176042778666");
        channel.send({
            embed: {
                title: `New Message from ${message.author.username}`,
                description: `${message.author.id}\n${args.slice(1).join(" ")}`,
                color: 0xFF0000,
                timestmap: new Date()
            }
        })
    }
}

export async function anonmail(message: Message, args: string[], client: Client) {
    if (!args[2]) return message.reply("The command is `.mail <suggestion | mods> message`");
    if (args[0]?.[0] === "s") {
        let channel = <TextChannel>client.channels.get("621046082859958275");
        channel.send({
            embed: {
                title: `New Suggestion`,
                description: `${args.slice(1).join(" ")}`,
                color: 0xFF0000
            }
        });
    } else if (args[0]?.[0] === "m") {
        let channel = <TextChannel>client.channels.get("721062176042778666");
        channel.send({
            embed: {
                title: `New Message`,
                description: `${args.slice(1).join(" ")}`,
                color: 0xFF0000
            }
        });
    }
}