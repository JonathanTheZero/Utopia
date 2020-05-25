import { Message } from "discord.js";
import { marketOffer } from "../../utils/interfaces";
import { getOffer, updateValueForUser, deleteOffer as delOffer, addToUSB } from "../../utils/databasehandler";

export async function deleteOffer(message: Message, args: string[]) {
    if (!args[0]) return message.reply("please follow the syntax of `.cancel-offer <id>`");
    const offer: marketOffer = await getOffer(args[0]);
    if (!offer) return message.reply("there was no offer matching this ID!");
    if (offer.seller._id !== message.author.id) return message.reply("you can't cancel an offer by someone else!");

    Promise.all([
        updateValueForUser(message.author.id, offer.offer.currency, Math.floor(0.98 * offer.offer.amount), "$inc"),
        delOffer(offer._id),
        addToUSB(Math.floor(.02 * offer.offer.amount)),
    ]).then(() => message.reply("you succesfully deleted offer " + args[0]));
}