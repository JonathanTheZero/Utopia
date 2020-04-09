import { Message } from "discord.js";
import "../utils/utils";
export declare function payout(message: Message, args: string[]): Promise<void>;
export declare function alliancePayout(message: Message, args: string[]): Promise<Message | Message[]>;
