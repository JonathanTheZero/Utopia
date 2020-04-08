"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
exports.getBaseLog = getBaseLog;
function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
exports.Sleep = Sleep;
Number.prototype.commafy = function () {
    return String(this).commafy();
};
String.prototype.commafy = function () {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function ($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
};
String.prototype.isNaN = function () {
    return isNaN(this);
};
function rangeInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.rangeInt = rangeInt;
function getAllianceByName(name) {
    let a = JSON.parse(fs.readFileSync('alliances.json').toString());
    for (var i = 0; i < a.length; i++) {
        if (name == a[i].name) {
            return a[i];
        }
    }
}
exports.getAllianceByName = getAllianceByName;
async function reminder(message, duration, preText, postText) {
    message.channel.send(preText);
    await Sleep(duration);
    message.reply(postText);
}
exports.reminder = reminder;
