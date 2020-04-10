import { user, alliance } from "../utils/interfaces";
import { Message } from "discord.js";
export declare function createUser(message: Message): user;
export declare function createAlliance(name: string, message: Message): alliance;
