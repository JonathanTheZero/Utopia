import { Message } from "discord.js";
import { findOffer } from "../../utils/databasehandler";
import { marketOffer } from "../../utils/interfaces";
import * as config from "../../static/config.json";

export async function myOffers(message: Message, args: string[]) {
    let page: number = Number(args[0]?.match(/\d+/)?.[0]) || 1;
    let offers: marketOffer[] = (await findOffer({ "seller._id": message.author.id })).splice((page - 1) * 10);
    const fields = [];
    for (let i = 0; i < Math.min(offers.length, 10); ++i)
        fields.push({
            name: `Offer ID: ${offers[i]._id}`,
            value: `${offers[i].offer.amount.commafy()} ${offers[i].offer.currency} for ${offers[i].price.amount.commafy()} ${offers[i].price.currency} ` +
                `(${(offers[i].price.amount / offers[i].offer.amount).toFixed(2).commafy()} per unit)`
        });

    return message.channel.send({
        embed: {
            title: `View your offers. Page ${page} of ${Math.floor((await findOffer({ "seller._id": message.author.id })).length / 10) + 1}`,
            description: fields.length === 0 ?
                "There are no offers matching your criteria" :
                "If you wish to cancel an offer, use `.cancel-offer <id>`",
            fields,
            footer: config.properties.footer,
            color: parseInt(config.properties.embedColor),
            timestamp: new Date()
        }
    });
}