import { Message } from "discord.js";

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

Number.prototype.commafy = function (): string {
    return String(this).commafy();
}

String.prototype.commafy = function (): string {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function ($0, $1, $2) {
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