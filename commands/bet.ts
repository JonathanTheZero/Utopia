import { Message } from "discord.js";
import { getUser, updateValueForUser } from "../utils/databasehandler";
import { user } from "../utils/interfaces";

export async function bet(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);
    if (!user) return message.reply("You haven't created an account yet! Use `.create` in order to create one");

    if (user.money === 0) return message.reply("you don't have any money left!");

    else if ((isNaN(<any>args[0]) && args[0] != "a" && !args[0].toLowerCase().startsWith("h") && !args[0].toLowerCase().startsWith("q"))
        || typeof args[0] === "undefined" || <number><unknown>args[0] < 1) {
        return message.reply("please enter a valid amount using `.bet <amount>` or `.bet a` to bet all your money.");
    }
    let won = (Math.random() > 0.5);

    let money = (args[0].toLowerCase() == "a") ? user.money : parseInt(args[0]);

    if (args[0].toLowerCase() == "half" || args[0].toLowerCase().startsWith("h"))
        money = Math.floor((user.money) / 2);

    //To allow the user to bet a quarter of their money rounded down
    else if (args[0].toLowerCase() == "quarter" || args[0].toLowerCase().startsWith("q"))
        money = Math.floor((user.money) * 0.25);

    if (money < 1) return message.reply("you can't bet a negative amount");

    if (money > user.money) return message.reply("you can't bet more money than you own!");

    let addedMoney = won ? money : -1 * money;
    if (won) message.reply("congratulations! You won " + money.commafy() + " coins!");
    else message.reply("you lost " + money.commafy() + " coins. Try again next time!");
    updateValueForUser(message.author.id, "money", addedMoney);
}