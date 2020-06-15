import { Message, Client, TextChannel } from "discord.js";

export async function modmail(message: Message, args: string[], client: Client) {
    if (!args[1]) return message.reply("The command is `.mail <suggestion | mods> message`");
    if (args[0]?.[0] === "s") {
        let channel = <TextChannel>client.channels.cache.get("621046082859958275");
        channel.send({
            embed: {
                title: `New Suggestion from ${message.author.username} - ${message.author.id}`,
                description: args.slice(1).join(" "),
                color: 0xFF0000,
                timestmap: new Date()
            }
        });
        return message.reply("succesfull sent your message to the suggestion channel.");
    } else if (args[0]?.[0] === "m") {
        let channel = <TextChannel>client.channels.cache.get("721062176042778666");
        channel.send({
            embed: {
                title: `New Message from ${message.author.username} - ${message.author.id}`,
                description: args.slice(1).join(" "),
                color: 0xFF0000,
                timestmap: new Date()
            }
        });
        return message.reply("succesfull sent your message to the mods.");
    } else return message.reply("this is not a valid type!");
}

export async function anonmail(message: Message, args: string[], client: Client) {
    if (!args[1]) return message.reply("The command is `.mail <suggestion | mods> message`");
    if (args[0]?.[0] === "s") {
        let channel = <TextChannel>client.channels.cache.get("621046082859958275");
        channel.send({
            embed: {
                title: `New Suggestion`,
                description: `${args.slice(1).join(" ")}`,
                color: 0xFF0000
            }
        });
        return message.reply("succesfull sent your message to the suggestion channel.");
    } else if (args[0]?.[0] === "m") {
        let channel = <TextChannel>client.channels.cache.get("721062176042778666");
        channel.send({
            embed: {
                title: `New Message`,
                description: `${args.slice(1).join(" ")}`,
                color: 0xFF0000
            }
        });
        return message.reply("succesfull sent your message to the mods.");
    } else return message.reply("this is not a valid type!");
}

export async function reply(message: Message, args: string[], client: Client){
    if (!args[1]) return message.reply("The command is `.reply 'stuff'`");
    client.users.get(args[0])?.send({
        embed: {
            title: `New Message from ${message.author.username}`,
            description: args.slice(1).join(" "),
            color: 0xFF0000,
            timestmap: new Date()
        }
    })
    return message.reply("Reply has been sent!")
}