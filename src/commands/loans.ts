import { Message } from "discord.js";
import { user } from "../utils/interfaces";
import * as config from "../static/config.json";
import "../utils/utils";
import { updateValueForUser } from "../utils/databasehandler";

export async function loancalc(message: Message, args: string[], user: user) {
  let maxloan = lc(user.resources.population);
  let repayment = Math.floor(maxloan * 1.25)
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
  else if (!isNaN(<any>args[0])) {
    maxloan = parseInt(args[0])
    repayment = maxloan + Math.floor(maxloan * 0.25)
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
    return message.reply("Please enter a valid amount")
  }
}

export async function loan(message: Message, args: string[], user: user) {
  var userloan = parseInt(args[0]);

  if (!user.loan) {
    let maxloan = lc(user.resources.population);
    if (userloan > maxloan)
      return message.reply("You can only take upto " + maxloan.commafy() + " coins. Next time use `.loancalc ` ");

    else if (userloan <= 0 || <any>userloan === "undefined" || typeof args[0] === "undefined")
      return message.reply("Please enter a valid amount");

    else if (userloan > 0 && userloan <= maxloan) {
      updateValueForUser(message.author.id, "money", userloan, "$inc");
      updateValueForUser(message.author.id, "loan", Math.floor(user.money + userloan * 1.25));
      return message.reply("Congrats, you took out " + userloan.commafy() + " coins.");
    }
  }
  else {
    return message.reply("You still owe " + user.loan.commafy() + " coins. Use `.payback` to pay it back");
  }
}

export async function payback(message: Message, args: string[], user: user) {
  if ((isNaN(<any>args[0]) || typeof args[0] === "undefined" || <any>args[0] < 1) && args[0] !== "a")
    return message.reply("Please enter valid amount.");

  if (!user || Object.keys(user).length === 0 && user.constructor === Object)
    return message.reply("you haven't created an account yet, please use `.create` first");

  if (user.loan) {
    var userpayment = (args[0] === "a") ? user.money : parseInt(args[0]);
    if (userpayment > user.money) return message.reply("you don't own that much money");
    updateValueForUser(message.author.id, "money", user.money + (-1 * userpayment));
    if (user.loan <= userpayment) {
      const diff = userpayment - user.loan;
      message.reply("you paid in full.");
      updateValueForUser(message.author.id, "loan", 0);
      updateValueForUser(message.author.id, "money", diff, "$inc");
      return;
    }
    user.loan -= userpayment;
    updateValueForUser(message.author.id, "loan", -1 * userpayment, "$inc");
    return message.reply("Congrats, you paid " + userpayment.commafy() + ". You still owe " + user.loan.commafy() + " coins.")
  }
  return message.reply("You do not have a loan to repay!");
}

function lc(pop: number): number {
  return Math.floor(pop / 8);
}