import { Message } from "discord.js";
import { user } from "../utils/interfaces";
import "../utils/utils";
export declare function loancalc(message: Message, args: string[], user: user): Promise<Message | Message[]>;
export declare function loan(message: Message, args: string[], user: user): Promise<Message | Message[] | undefined>;
export declare function payback(message: Message, args: string[], user: user): Promise<Message | Message[] | undefined>;
