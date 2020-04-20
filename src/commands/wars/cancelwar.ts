import { Message } from "discord.js";
import { war } from "../../utils/interfaces";
import { findWarByUser, deleteWar, updateValueForUser } from "../../utils/databasehandler";

export async function cancelWar(message: Message){
    const w: war | null = await findWarByUser(message.author.id);
    if(!w) return message.reply("you don't participate in any active war!");

    if(w.started) return message.reply("the war lasts too long as that one could end it now!");

    updateValueForUser(w.p1._id, "food", -w.p1.resources.food.consumed, "$inc");
    updateValueForUser(w.p1._id, "money", -w.p1.resources.money.consumed, "$inc");
    updateValueForUser(w.p1._id, "steel", -w.p1.resources.steel.consumed, "$inc");
    updateValueForUser(w.p1._id, "oil", -w.p1.resources.oil.consumed, "$inc");
    updateValueForUser(w.p1._id, "food", -w.p1.resources.food.consumed, "$inc");

    updateValueForUser(w.p2._id, "food", -w.p2.resources.food.consumed, "$inc");
    updateValueForUser(w.p2._id, "money", -w.p2.resources.money.consumed, "$inc");
    updateValueForUser(w.p2._id, "steel", -w.p2.resources.steel.consumed, "$inc");
    updateValueForUser(w.p2._id, "oil", -w.p2.resources.oil.consumed, "$inc");
    updateValueForUser(w.p2._id, "food", -w.p2.resources.food.consumed, "$inc");

    await deleteWar(w._id);
    return message.reply(`the running war between <@${w.p1._id}> and <@${w.p2._id}> has been cancelled`);
}