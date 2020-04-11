import { user, alliance } from "../../utils/interfaces";
import { getUser, getAlliance, updateValueForAlliance } from "../../utils/databasehandler";
import { Message } from "discord.js";

export async function settax(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
    if (user.allianceRank == null) return message.reply("you haven't joined an alliance yet.");
    if (typeof args[0] === "undefined" || parseInt(args[0]) > 90 || parseInt(args[0]) < 0 || isNaN(parseInt(args[0]))) return message.reply("please provide a valid number following `.settax <0-90>`.")
    if (user.allianceRank == "M") return message.reply("Only the Leader and the Co-Leaders can set the alliance status");
    const tax = parseInt(args[0]);

    let alliance: alliance = await getAlliance(user.alliance!)! as alliance;
    updateValueForAlliance(alliance.name, "tax", tax);
    return message.reply("the new taxrate of your alliance is " + tax + "%");
}