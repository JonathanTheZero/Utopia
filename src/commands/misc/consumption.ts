import { Message } from "discord.js";
import { absBaseLog } from "../../utils/utils";

export async function consumption(message: Message, args: string[]) {
    if (!args[0] || !parseInt(args[0]) && parseInt(args[0]) !== 0) return message.reply("please follow the syntax of `.consumption <number>`.");
    const c = Math.floor(parseInt(args[0]) * (2 + absBaseLog(10, absBaseLog(10, absBaseLog(3, parseInt(args[0]) + 1))))) || 0;
    return message.reply(`${args[0].commafy()} population will consume ${c.commafy()} food.`);
}