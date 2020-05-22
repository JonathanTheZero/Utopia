import { Message } from "discord.js";
import { marketOffer } from "../../utils/interfaces";
import { getOffer } from "../../utils/databasehandler";
import "../../utils/utils";
import * as config from "../../static/config.json";

export async function offer(message: Message, args: string[]) {
    if (!args[0]) return message.reply("please follow the syntax of `.offer <id>`.");
    let offer: marketOffer = await getOffer(args[0]);
    if (!offer) return message.reply("there is no offer matching this id.");

    return message.channel.send({
        embed: {
            title: `Offer #${offer._id} by ${offer.seller.tag}`,
            fields: [
                {
                    name: "Price:",
                    value: `${offer.price.amount.commafy()} ${offer.price.currency}`,
                    inline: true
                },
                {
                    name: "Offer:",
                    value: `${offer.offer.amount.commafy()} ${offer.offer.currency}`,
                    inline: true
                }
            ],
            color: parseInt(config.properties.embedColor),
            timestamp: new Date()
        }
    });
}