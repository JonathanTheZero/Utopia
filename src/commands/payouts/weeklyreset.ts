import { Client, TextChannel } from "discord.js";
import { getAllUsers, updateValueForUser, editConfig, addToUSB } from "../../utils/databasehandler";
import { user } from "../../utils/interfaces";
import * as config from "../../static/config.json";

export async function weeklyReset(client: Client) {
    let users: user[] = await getAllUsers();
    const channel = <TextChannel>client.channels.get(config.payoutChannel);
    for (const u of users) {
        updateValueForUser(u._id, "minereturn", 1, "$set");

        if (u.payoutDMs) {
            try {
                client.users.get(u._id)?.send("Your mines have been reset, happy mining!");
            } catch { }
        }
        //taxing
        if (u.money < 100000) {
            updateValueForUser(u._id, "money", ~~(.98 * u.money), "$set");
            addToUSB(~~(.02 * u.money));
            try {
                client.users.get(u._id)?.send("You have payed your weekly taxes (you are in class 1: 2% tax).");
            } catch { }
        } else if (u.money < 1000000) {
            updateValueForUser(u._id, "money", ~~(.95 * u.money), "$set");
            addToUSB(~~(.05 * u.money));
            try {
                client.users.get(u._id)?.send("You have payed your weekly taxes (you are in class 2: 5% tax).");
            } catch { }
        } else if (u.money < 10000000) {
            updateValueForUser(u._id, "money", ~~(.9 * u.money), "$set");
            addToUSB(~~(.1 * u.money));
            try {
                client.users.get(u._id)?.send("You have payed your weekly taxes (you are in class 3: 10% tax).");
            } catch { }
        } else if (u.money < 100000000) {
            updateValueForUser(u._id, "money", Math.floor(.8 * u.money), "$set");
            addToUSB(Math.floor(.2 * u.money));
            try {
                client.users.get(u._id)?.send("You have payed your weekly taxes (you are in class 4: 20% tax).");
            } catch { }
        } else if (u.money < 500000000) {
            updateValueForUser(u._id, "money", Math.floor(.65 * u.money), "$set");
            addToUSB(Math.floor(.35 * u.money));
            try {
                client.users.get(u._id)?.send("You have payed your weekly taxes (you are in class 5: 35% tax).");
            } catch { }
        } else if (u.money < 1000000000) {
            updateValueForUser(u._id, "money", Math.floor(.5 * u.money), "$set");
            addToUSB(Math.floor(.5 * u.money));
            try {
                client.users.get(u._id)?.send("You have payed your weekly taxes (you are in class 6: 50% tax).");
            } catch { }
        } else {
            updateValueForUser(u._id, "money", Math.floor(.4 * u.money), "$set");
            addToUSB(Math.floor(.6 * u.money));
            try {
                client.users.get(u._id)?.send("You have payed your weekly taxes (you are in class 7: 60% tax).");
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