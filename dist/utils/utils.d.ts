import { Message } from "discord.js";
declare global {
    interface Number {
        commafy: () => string;
    }
    interface String {
        commafy: () => string;
        isNaN: () => boolean;
    }
}
export declare function getBaseLog(x: number, y: number): number;
export declare function Sleep(milliseconds: number): Promise<void>;
export declare function rangeInt(min: number, max: number): number;
export declare function reminder(message: Message, duration: number, preText: string, postText: string): Promise<void>;
