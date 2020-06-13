import { Message } from "discord.js";
import "../../utils/utils";

export async function calc(message: Message, str: string){
    try {
        message.reply(eval(str)?.commafy() || "error");
    } catch { 
        message.reply("this isn't a valid expression.");
    }
}