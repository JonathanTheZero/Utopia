import * as fs from "fs";
import { Message } from "discord.js";

declare global {
    interface Number {
        commafy(): string;
    }

    interface String {
        commafy(): string;
        isNaN(): boolean;
    }
}

export function getBaseLog(x: number, y: number) {
    return Math.log(y) / Math.log(x);
}

export function Sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

Number.prototype.commafy = function () {
    return String(this).commafy();
},

    String.prototype.commafy = function () {
        return this.replace(/(^|[^\w.])(\d{4,})/g, function ($0, $1, $2) {
            return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
        });
    }

export function searchUser(msg: Message) {
    let parsedData = JSON.parse(fs.readFileSync('userdata.json').toString());
    for (var i = 0; i < parsedData.length; i++) {
        if (msg.author.id == parsedData[i].id) {
            return parsedData[i];
        }
    }
}

export function searchUserByID(id: string) {
    let parsedData = JSON.parse(fs.readFileSync('userdata.json').toString());
    for (var i = 0; i < parsedData.length; i++) {
        if (id == parsedData[i].id) {
            return parsedData[i];
        }
    }
}
export function rangeInt(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getAllianceByName(name: string) {
    let a = JSON.parse(fs.readFileSync('alliances.json').toString());
    for (var i = 0; i < a.length; i++) {
        if (name == a[i].name) {
            return a[i];
        }
    }
}

String.prototype.isNaN = function () {
    return isNaN(<any>this);
}