import { Client, TextChannel, Message } from "discord.js";

export async function modmail(command: string, args: string[], client: Client, message: Message){
    if (command === "mail"){
        if(!args) return message.reply("The command is .mail <suggestion|mods> `message`")

        if(["s"].includes(args[0])){
            let channel = <TextChannel>client.channels.get("621046082859958275");
            channel.send({
                embed: {
                    title: `New Suggestion from ${message.author.username}`,
                    description: `${message.author.id}\n${args.slice(1).join(" ")}`,
                    color: 0xFF0000
                }
            })

        }

        else if(["m"]){
            let channel = <TextChannel>client.channels.get("721062176042778666");
            channel.send({
                embed: {
                    title: `New Message from ${message.author.username}`,
                    description: `${message.author.id}\n${args.slice(1).join(" ")}`,
                    color: 0xFF0000
                }
            })
        }
    }

    else if (command === "anonmail"){
        if(!args) return message.reply("The command is .anonmail <suggestion|mods> `message`")

        if(["s"].includes(args[0])){
            let channel = <TextChannel>client.channels.get("621046082859958275");
            channel.send({
                embed: {
                    title: `New Suggestion`,
                    description: `${args.slice(1).join(" ")}`,
                    color: 0xFF0000
                }
            })

        }

        else if(["m"]){
            let channel = <TextChannel>client.channels.get("721062176042778666");
            channel.send({
                embed: {
                    title: `New Message`,
                    description: `${args.slice(1).join(" ")}`,
                    color: 0xFF0000
                }
            })
        }
    }
}