import { Message } from "discord.js";
import { marketOffer, resources } from "../../utils/interfaces";
import { findOffer } from "../../utils/databasehandler";
import "../../utils/utils";
import * as config from "../../static/config.json";

//.market [currency] [minAmount] [page]
export async function activeOffers(message: Message, args: string[]) {
    const inp = args.join(" ");
    let page: number, currency: resources, min: number, query: any = {};
    if (inp.match(/p(age)?:\d{1,}/))
        page = Number(inp.match(/p(age)?:\d{1,}/)![0].match(/\d+/)![0]);
    if (inp.match(/c(urrency)?:(p(opulation)?|s(teel)?|m(oney)?|o(il)?|f(ood)?)/)) {
        let x = inp.match(/c(urrency)?:(p(opulation)?|s(teel)?|m(oney)?|o(il)?|f(ood)?)/)![2].toLowerCase();
        switch (x[0]) {
            case "f": currency = "food"; break;
            case "m": currency = "money"; break;
            case "p": currency = "population"; break;
            case "s": currency = "steel"; break;
            case "o": currency = "oil"; break;
            default: return message.reply("that isn't a valid currency.");
        }
    }
    if (inp.match(/m(in)?:\d{1,}/))
        min = Number(inp.match(/m(in)?:\d{1,}/)![0].match(/\d+/)![0]);
    if (currency!) query["offer.currency"] = currency!;
    if (min!) query["offer.amount"] = { $gt: min! };
    let offers: marketOffer[] = await findOffer(query);
    const fields = [];
    if (page!) offers = offers.splice((page! - 1) * 10);
    for (let i = 0; i < Math.min(10, offers.length); ++i)
        fields.push({
            name: `Offer by ${offers[i].seller.tag} (ID: ${offers[i]._id})`,
            value: `${offers[i].offer.amount.commafy()} ${offers[i].offer.currency} for ${offers[i].price.amount.commafy()} ${offers[i].price.currency} ` +
                `(${(offers[i].price.amount / offers[i].offer.amount).toFixed(2).commafy()} per unit)`
        });

    return message.channel.send({
        embed: {
            title: "Welcome to the market.",
            description: fields.length === 0 ?
                "There are no offers matching your criteria" :
                "If you want to buy an item you are intersted in, use `.buy-offer <id>`",
            fields,
            footer: config.properties.footer,
            color: parseInt(config.properties.embedColor),
            timestamp: new Date()
        }
    });
}

