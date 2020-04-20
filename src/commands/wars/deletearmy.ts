import { Message } from "discord.js";

export async function deleteArmy(message: Message, args: string[]){
    if(!args[0]) return message.reply("please follow the syntax of `.deletearmy <index>`");
}