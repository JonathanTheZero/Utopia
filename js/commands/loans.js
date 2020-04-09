"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("../config.json"));
require("../utils/utils");
const databasehandler_1 = require("../utils/databasehandler");
async function loancalc(message, args, user) {
    let maxloan = lc(user.resources.population);
    let repayment = Math.floor(maxloan * 1.25);
    if (typeof args[0] === "undefined") {
        return message.channel.send({
            embed: {
                color: parseInt(config.properties.embedColor),
                title: `Maximum loan for ${message.author.tag}`,
                fields: [{
                        name: "Maximum Loan:",
                        value: maxloan.commafy(),
                        inline: true
                    },
                    {
                        name: "Total repayment:",
                        value: repayment.commafy(),
                        inline: true
                    },
                ],
                footer: config.properties.footer,
                timestamp: new Date()
            }
        });
    }
    else if (!isNaN(args[0])) {
        maxloan = parseInt(args[0]);
        repayment = maxloan + Math.floor(maxloan * 0.25);
        return message.channel.send({
            embed: {
                color: parseInt(config.properties.embedColor),
                title: `Loan for ${message.author.tag}`,
                fields: [{
                        name: "Loan:",
                        value: maxloan.commafy(),
                        inline: true
                    },
                    {
                        name: "Total repayment:",
                        value: repayment.commafy(),
                        inline: true
                    },
                ],
                footer: config.properties.footer,
                timestamp: new Date()
            }
        });
    }
    else {
        return message.reply("Please enter a valid amount");
    }
}
exports.loancalc = loancalc;
async function loan(message, args, user) {
    var userloan = parseInt(args[0]);
    if (!user.loan) {
        let maxloan = lc(user.resources.population);
        if (userloan > maxloan)
            return message.reply("You can only take upto " + maxloan.commafy() + " coins. Next time use `.loancalc ` ");
        else if (userloan <= 0 || userloan === "undefined" || typeof args[0] === "undefined")
            return message.reply("Please enter a valid amount");
        else if (userloan > 0 && userloan <= maxloan) {
            databasehandler_1.updateValueForUser(message.author.id, "money", userloan, "$inc");
            databasehandler_1.updateValueForUser(message.author.id, "loan", Math.floor(user.money + userloan * 1.25));
            return message.reply("Congrats, you took out " + userloan.commafy() + " coins.");
        }
    }
    else {
        return message.reply("You still owe " + user.loan.commafy() + " coins. Use `.payback` to pay it back");
    }
}
exports.loan = loan;
async function payback(message, args, user) {
    if ((isNaN(args[0]) || typeof args[0] === "undefined" || args[0] < 1) && args[0] !== "a")
        return message.reply("Please enter valid amount.");
    if (!user || Object.keys(user).length === 0 && user.constructor === Object)
        return message.reply("you haven't created an account yet, please use `.create` first");
    if (user.loan) {
        var userpayment = (args[0] === "a") ? user.money : parseInt(args[0]);
        if (userpayment > user.money)
            return message.reply("you don't own that much money");
        databasehandler_1.updateValueForUser(message.author.id, "money", user.money + (-1 * userpayment));
        if (user.loan <= userpayment) {
            const diff = userpayment - user.loan;
            message.reply("you paid in full.");
            databasehandler_1.updateValueForUser(message.author.id, "loan", 0);
            databasehandler_1.updateValueForUser(message.author.id, "money", diff, "$inc");
            return;
        }
        user.loan -= userpayment;
        databasehandler_1.updateValueForUser(message.author.id, "loan", -1 * userpayment, "$inc");
        return message.reply("Congrats, you paid " + userpayment.commafy() + ". You still owe " + user.loan.commafy() + " coins.");
    }
    return message.reply("You do not have a loan to repay!");
}
exports.payback = payback;
function lc(pop) {
    return Math.floor(pop / 8);
}
