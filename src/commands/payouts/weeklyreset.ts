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
                client.users.get(u._id)?.send("Your mines have been reset, happy mining!");
            } catch { }
        }
        //taxing
        if (u.income < 100000) {
            updateValueForUser(u._id, "money", ~(.98 * u.income), "$inc");
            addToUSB(~~(.02 * u.income));
            cl = 1, tax = 2;
        } else if (u.income < 1000000) {
            updateValueForUser(u._id, "money", ~(.95 * u.income), "$inc");
            addToUSB(~~(.05 * u.income));
            cl = 2, tax = 5;
        } else if (u.income < 10000000) {
            updateValueForUser(u._id, "money", ~(.9 * u.income), "$inc");
            addToUSB(~~(.1 * u.income));
            cl = 3, tax = 10;
        } else if (u.income < 100000000) {
            updateValueForUser(u._id, "money", -Math.floor(.8 * u.income), "$inc");
            addToUSB(Math.floor(.2 * u.income));
            cl = 4, tax = 20;
        } else if (u.income < 500000000) {
            updateValueForUser(u._id, "money", Math.floor(.65 * u.income), "$inc");
            addToUSB(Math.floor(.35 * u.income));
            cl = 5, tax = 35;
        } else if (u.income < 1000000000) {
            updateValueForUser(u._id, "money", Math.floor(.5 * u.income), "$inc");
            addToUSB(Math.floor(.5 * u.income));
            cl = 6, tax = 50;
        } else {
            updateValueForUser(u._id, "money", Math.floor(.4 * u.income), "$inc");
            addToUSB(Math.floor(.6 * u.income));
            cl = 7, tax = 60;
        }
        updateValueForUser(u._id, "income", 0, "$set");
        updateValueForUser(u._id, "money", Math.floor(.98 * u.money), "$set");
        addToUSB(Math.floor(.02 * u.money));
        if (u.taxDMs) {
            try {
                client.users.get(u._id)?.send(
                    `You have payed your weekly income taxes (you are in class ${cl!}: ${tax!}% tax).\n` +
                    "Additionally 2% of your balance has been taxed.\n\n" + 
                    `If you wish to disable tax DMs, use \`.taxdms\`.`
                );
            } catch { }
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