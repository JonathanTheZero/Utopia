import { Message } from "discord.js";
import "../../utils/utils";

export async function calc(message: Message, str: string) {
    try {
        if (str.match(/(message|for|return|reply)/)) throw new EvalError();
        //@ts-ignore
        const { sqrt, cos, sin, log, log10, log2 } = Math;
        message.reply(eval(str)?.commafy() || "error");
    } catch (e) { message.reply("this isn't a valid expression."); }
}