import { Message, Client, TextChannel } from "discord.js";

export async function modmail(message: Message, args: string[], client: Client) {
    if (!args[1]) return message.reply("The command is `.mail <suggestion | mods> message`");
    if (args[0]?.[0] === "s") {
        let channel = <TextChannel>client.channels.get("621046082859958275");
        channel.send({
            embed: {
                title: `New Suggestion from ${message.author.username} - ${message.author.id}`,
                description: args.slice(1).join(" "),
                color: 0xFF0000,
                timestmap: new Date()
            }
        })
        message.reply("Mods may contact you for further inquiry")
    } 

    else if (args[0]?.[0] === "m") {
        let channel = <TextChannel>client.channels.get("721062176042778666");
        channel.send({
            embed: {
                title: `New Message from ${message.author.username} - ${message.author.id}`,
                description: args.slice(1).join(" "),
                color: 0xFF0000,
                timestmap: new Date()
            }
        })
        message.reply("Mods may contact you for further inquiry")
    }
}

export async function anonmail(message: Message, args: string[], client: Client) {
    if (!args[1]) return message.reply("The command is `.mail <suggestion | mods> message`");
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