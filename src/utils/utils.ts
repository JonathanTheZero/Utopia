import { Message, ReactionCollector, User } from "discord.js";

//declarations
declare global {
    interface Number {
        commafy: () => string;
    }

    interface String {
        commafy: () => string;
        isNaN: () => boolean;
    }
}

export function getBaseLog(x: number, y: number) {
    return Math.log(y) / Math.log(x);
}

export function Sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function getRandomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

Number.prototype.commafy = function (): string {
    return String(this).commafy();
}

String.prototype.commafy = function (): string {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function (_$0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
}

String.prototype.isNaN = function () {
    return isNaN(<any>this);
}

export function rangeInt(min: number, max: number): number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function reminder(message: Message, duration: number, preText: string, postText: string): Promise<void> {
    message.channel.send(preText);
    await Sleep(duration);
    message.reply(postText);
}

export function secondsToDhms(seconds: number) {
    let d = Math.floor(seconds / (3600 * 24)),
        h = Math.floor(seconds % (3600 * 24) / 3600),
        m = Math.floor(seconds % 3600 / 60),
        s = Math.floor(seconds % 60);

    let dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}
//@ts-ignore
export const filter = (reaction: ReactionCollector, user: User) => [];