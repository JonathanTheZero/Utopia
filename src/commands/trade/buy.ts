import { Message } from "discord.js";
import { marketOffer, user } from "../../utils/interfaces";
import { getOffer, updateValueForUser, getUser, deleteOffer } from "../../utils/databasehandler";

export async function buyOffer(message: Message, args: string[]) {
    if (!args[0]) return message.reply("please follow the syntax of `.buy-offer <id>`");
    const offer: marketOffer = await getOffer(args[0]);
    if (!offer) return message.reply("sorry, there is no offer matching this ID, make sure you spelled it right.");
    if(offer.seller._id === message.author.id) 
        return message.reply("you can't buy your own offers!");

    const user: user = await getUser(message.author.id);
    if ((offer.price.currency === "money" && offer.price.amount > user.money) || 
        offer.price.currency != "money" && offer.price.amount > user.resources[offer.price.currency])
        return message.reply("you don't have enough to buy that item!");

    Promise.all([
        updateValueForUser(message.author.id, offer.offer.currency, offer.offer.amount, "$inc"),
        updateValueForUser(message.author.id, offer.price.currency, -offer.price.amount, "$inc"),
        updateValueForUser(offer.seller._id, offer.price.currency, offer.price.amount, "$inc"),
        deleteOffer(offer._id)
    ]).then(() => message.reply("you succesfully bought the offer!"));
}