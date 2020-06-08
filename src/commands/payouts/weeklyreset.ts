import { Client, TextChannel } from "discord.js";
import { getAllUsers, updateValueForUser, editConfig, addToUSB } from "../../utils/databasehandler";
import { user } from "../../utils/interfaces";
import * as config from "../../static/config.json";

export async function weeklyReset(client: Client) {
    let users: user[] = await getAllUsers();
    const channel = <TextChannel>client.channels.get(config.payoutChannel);
    for (const u of users) {
        let tax: number, cl: number;
        updateValueForUser(u._id, "minereturn", 1, "$set");
        if (u.payoutDMs) {
            try {
                client.users.get(u._id)!.send({
                    embed: {
                        description: "Your mines have been reset, happy mining!"
                    }
                });
            } catch{ }
        }
        //taxing
        if (u.income < 100000) {
            cl = 1, tax = 2;
        } else if (u.income < 1000000) {
            cl = 2, tax = 5;
        } else if (u.income < 10000000) {
            cl = 3, tax = 10;
        } else if (u.income < 100000000) {
            cl = 4, tax = 20;
        } else if (u.income < 500000000) {
            cl = 5, tax = 35;
        } else if (u.income < 1000000000) {
            cl = 6, tax = 50;
        } else {
            cl = 7, tax = 60;
        }
        const payment = Math.floor((tax / 100) * u.income);
        if (payment > u.money) {
            client.users.get(u._id)?.send({
                embed: {
                    description: `You couldn't pay your income taxes and took out a loan of ${(payment - u.money).commafy()}`
                }
            }).catch(console.log);
            updateValueForUser(u._id, "loan", payment - u.money, "$set");
            updateValueForUser(u._id, "money", 0, "$set");
        } else {
            updateValueForUser(u._id, "money", -payment, "$inc");
        }
        updateValueForUser(u._id, "income", 0, "$set");
        addToUSB(payment);
        //updateValueForUser(u._id, "money", -Math.floor(.02 * u.money), "$inc");
        addToUSB(Math.floor(.02 * u.money));
        if (u.taxDMs) {
            client.users.get(u._id)?.send({
                embed: {
                    description: `You have payed your weekly income taxes (you are in class ${cl!}: ${tax!}% tax).\n` +
                        "Additionally 2% of your balance has been taxed.\n\n" +
                        `If you wish to disable tax DMs, use \`.taxdms\`.`
                }
            }).catch(console.log);
        }
    }
    channel.send({
        embed: {
            title: "The weekly reset has been made.",
            description: "Your mines have been reset and you've paid your taxes.",
            color: 0x00FF00,
            timestamp: new Date()
        }
    });
    editConfig("lastMineReset", Date.now());
    setTimeout(() => weeklyReset(client), 604800 * 1000);
}