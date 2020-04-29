import { Message } from "discord.js";
import { getUser, findOffer } from "../../utils/databasehandler";
import { user, marketOffer } from "../../utils/interfaces";

export async function myOffers(message: Message) {
    const offers: marketOffer[] = await findOffer({ "seller._id": message.author.id });
    offers.length = 10;
    message.channel.send(JSON.stringify(offers));
}