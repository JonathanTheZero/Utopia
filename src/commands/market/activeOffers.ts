import { Message } from "discord.js";
import { marketOffer } from "../../utils/interfaces";
import { findOffer } from "../../utils/databasehandler";
import "../../utils/utils";
import * as config from "../../static/config.json";

//.market [currency] [minAmount] [page]
export async function activeOffers(message: Message, args: string[]) {
    let query: any = {};
    if (args[0] && args[0] != "?")
        query["offer.currency"] = args[0];
    if (args[1] && args[0] != "?")
        query["offer.amount"] = { $gt: parseInt(args[1]) };
    let offers: marketOffer[] = await findOffer(query);
    const fields = [];
    if (args[2]) offers = offers.splice((parseInt(args[2]) - 1) * 10);
    let max = offers.length > 10 ? 10 : offers.length;
    for (let i = 0; i < max; ++i)
        fields.push({
            name: `Offer by ${offers[i].seller.tag} (ID: ${offers[i]._id})`,
            value: `${offers[i].offer.amount.commafy()} ${offers[i].offer.currency} for ${offers[i].price.amount.commafy()} ${offers[i].price.currency}`
        });

    return message.channel.send({
        embed: {
            title: "Welcome to the market. You are on page " + (args[2] || 1),
            description: fields.length === 0 ?
                "There are no offers matching your criteria" :
                "If you want to buy an item you are intersted in, use `.buy <id>`",
            fields,
            footer: config.properties.footer,
            color: parseInt(config.properties.embedColor),
            timestamp: new Date()
        }
    });
}

