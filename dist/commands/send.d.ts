import { Message } from "discord.js";
import "../utils/utils";
export declare function send(message: Message, args: string[]): Promise<Message | Message[] | undefined>;
export declare function deposit(message: Message, args: string[]): Promise<Message | Message[] | undefined>;
