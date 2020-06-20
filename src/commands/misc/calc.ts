import { Message } from "discord.js";
import "../../utils/utils";

export async function calc(message: Message, str: string) {
    try {
        //@ts-ignore
        const { sqrt, cos, sin, log, log10, log2 } = Math;
        message.reply(eval(str)?.commafy() || "error");
    } catch {
        message.reply("this isn't a valid expression.");
    }
}