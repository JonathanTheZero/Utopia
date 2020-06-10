import { Message, Client } from "discord.js";
import { user, alliance } from "../utils/interfaces";
import { getUser, getAlliance, updateValueForUser, updateValueForAlliance, addToUSB } from "../utils/databasehandler";
import { reminder } from "../utils/utils";

export async function work(message: Message, client: Client) {
    let user: user = await getUser(message.author.id);
    let alliance: alliance = await getAlliance(user.alliance as string) as alliance;

    if (!user)
        return message.reply("you haven't created an account yet, please use the `.create` command.");

    if (Math.floor(Date.now() / 1000) - user.lastWorked < 1800)
        return message.reply("You can work again in " + new Date((1800 - (Math.floor(Date.now() / 1000) - user.lastWorked)) * 1000).toISOString().substr(11, 8));

    if (client.users.get(user._id.toString())?.tag && client.users.get(user._id.toString())!.tag !== user.tag)
        updateValueForUser(user._id, "tag", client.users.get(user._id.toString())!.tag as string);

    let produced = Math.floor(Math.random() * (10000 + user.resources.population / 1000));
    addToUSB(Math.floor(-produced * 1.1));
    if (!alliance) {
        if (user.loan) {
            let paid = Math.floor(produced / 2 + 1)
            produced = Math.floor(produced / 2 - 1)
            if (paid <= user.loan) {
                updateValueForUser(user._id, "loan", -paid, "$inc");
                updateValueForUser(user._id, "money", produced, "$inc");
                message.reply("You successfully worked and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins. You sent " + paid.commafy() + " to your loan.");
            } else {
                paid -= user.loan;
                updateValueForUser(user._id, "loan", 0, "$set");
                produced += paid;
                updateValueForUser(user._id, "money", produced, "$inc");
                message.reply("You successfully worked and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins. You paid off your loan.");
            }
        } else {
            updateValueForUser(user._id, "money", produced, "$inc");
            message.reply("You successfully worked and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins.");
        }
    }
    else {
        var taxed = Math.floor((alliance.tax / 100) * produced);
        produced -= taxed;
        updateValueForAlliance(alliance.name, "money", taxed, "$inc");
        if (user.loan) {
            let paid = Math.floor(produced / 2 + 1)
            produced = Math.floor(produced / 2 - 1)
            if (paid <= user.loan) {
                updateValueForUser(user._id, "loan", -paid, "$inc");
                updateValueForUser(user._id, "money", produced, "$inc");
                message.reply("You successfully worked and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins. " + taxed.commafy() + " coins were sent to your alliance. You sent " + paid.commafy() + " to your loan.");
            } else {
                paid -= user.loan;
                updateValueForUser(user._id, "loan", 0, "$set");
                produced += paid;
                updateValueForUser(user._id, "money", produced, "$inc");
                message.reply("You successfully worked and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins. " + taxed.commafy() + " coins were sent to your alliance. You paid off your loan.");
            }
        } else {
            updateValueForUser(user._id, "money", produced, "$inc");
            message.reply("You successfully worked and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins. " + taxed.commafy() + " coins were sent to your alliance.");
        }
    }
    updateValueForUser(user._id, "lastWorked", Math.floor(Date.now() / 1000));
    updateValueForUser(message.author.id, "income", produced, "$inc");
    updateValueForUser(message.author.id, "lastMessage", { channelID: message.channel.id, messageID: message.id, alreadyPinged: false });
    if (user.autoping) reminder(
        message,
        1800000,
        "I'll remind you in 30 minutes that you can work again.\nIf you wish to disable reminders, use `.autoping`. (Note: this won't cancel all currently pending reminders)",
        "Reminder: Work again"
    );
}

export async function crime(message: Message) {
    let user: user = await getUser(message.author.id);
    let alliance: alliance | null = await getAlliance(user.alliance as string);
    if (!user) return message.reply("you haven't created an account yet, please use the `.create` command.");
    if (Math.floor(Date.now() / 1000) - user.lastCrime < 14400)
        return message.reply("You can commit a crime again in " + new Date((14400 - (Math.floor(Date.now() / 1000) - user.lastCrime)) * 1000).toISOString().substr(11, 8));
    let oldBalance = Math.floor(user.money);
    let produced;
    if (Math.floor(Math.random() * 99) < 7) {
        var p = Math.floor(oldBalance * Math.random() * 0.03);
        produced = (p > 50000) ? p : 50000;
    } else produced = Math.floor(-1 * Math.abs(oldBalance * Math.random() * 0.02));
    addToUSB(Math.floor(-produced * 1.1));
    updateValueForUser(user._id, "lastCrime", Math.floor(Date.now() / 1000));
    if (!alliance) {
        updateValueForUser(user._id, "money", produced, "$inc");
        if (produced > 1) {
            if (user.loan) { //checks if user has loan
                let paid = Math.floor(produced / 2 + 1)
                produced = Math.floor(produced / 2 - 1)
                if (paid < user.loan) {
                    updateValueForUser(user._id, "loan", -paid, "$inc");
                    updateValueForUser(user._id, "money", produced, "$inc");
                    message.reply(
                        "You successfully commited a crime and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins."
                    );
                } else {
                    paid -= user.loan;
                    updateValueForUser(user._id, "loan", 0, "$set");
                    produced += paid;
                    updateValueForUser(user._id, "money", produced, "$inc");
                    message.reply("You successfully commited a crime and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins.");
                }
            } else {
                updateValueForUser(user._id, "money", produced, "$inc");
                message.reply("You successfully commited a crime and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins.");
            }
        }
        else message.reply("You were unsuccesful and lost " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins.");
    } else {
        if (produced > 1) {
            var taxed = Math.floor((alliance.tax / 100) * produced);
            produced -= taxed;
            updateValueForAlliance(alliance?.name, "money", taxed, "$inc");
            updateValueForUser(user._id, "money", produced, "$inc");
            if (user.loan) {
                let paid = Math.floor(produced / 2 + 1)
                produced = Math.floor(produced / 2 - 1)
                if (paid < user.loan) {
                    updateValueForUser(user._id, "loan", -paid, "$inc");
                    updateValueForUser(user._id, "money", produced, "$inc");
                    message.reply("You successfully commited a crime and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins. You paid " + paid.commafy() + " towards your loan.");
                } else {
                    paid -= user.loan;
                    updateValueForUser(user._id, "loan", 0, "$set");
                    produced += paid;
                    updateValueForUser(user._id, "money", produced, "$inc");
                    message.reply("You successfully commited a crime and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins. You paid of your loan");
                }
            } else {
                updateValueForUser(user._id, "money", produced, "$inc");
                message.reply("You successfully commited a crime and gained " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins.");
            }
        } else {
            updateValueForUser(user._id, "money", produced, "$inc");
            message.reply("You were unsuccesful and lost " + produced.commafy() + " coins. Your new balance is " + (user.money + produced).commafy() + " coins.");
        }
    }
    updateValueForUser(message.author.id, "lastMessage", { channelID: message.channel.id, messageID: message.id, alreadyPinged: false });
    if (user.autoping) reminder(
        message,
        14400000,
        "I'll remind you in 4h to commit a crime again.\nIf you wish to disable reminders, use `.autoping`. (Note: this won't cancel all currently pending reminders)",
        "Reminder: Commit a crime."
    );
}