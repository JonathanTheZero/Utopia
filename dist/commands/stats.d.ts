import { Message, Client } from "discord.js";
import "../utils/utils";
/**
 *
 * @param message the original message
 * @param args the arguments entered by the user
 * @param client the client
 * @returns either nothing or an embed
 */
export declare function statsEmbed(message: Message, args: string[], client: Client): Promise<any | void>;
