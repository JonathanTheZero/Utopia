import { Message, CollectorFilter } from "discord.js";
import { marketOffer, resources } from "../../utils/interfaces";
import { findOffer } from "../../utils/databasehandler";
import "../../utils/utils";
import * as config from "../../static/config.json";

//.market [currency] [minAmount] [page]
export async function activeOffers(message: Message, args: string[]) {
    const inp = args.join(" ");
    let page: number = 1, currency: resources, min: number, query: any = {};
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

    const m = <Message>(await message.channel.send({ embed: await marketEmbed(query, page!) }));
    await m.react("⬅")
    await m.react("➡");
    const backwardsFilter: CollectorFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
    const forwardsFilter: CollectorFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;

    const backwards = m.createReactionCollector(backwardsFilter, { time: 100000 });
    const forwards = m.createReactionCollector(forwardsFilter, { time: 100000 });

    backwards.on('collect', async () => {
        m.reactions.forEach(reaction => reaction.remove(message.author.id));
        m.edit({ embed: await marketEmbed(query, --page) });
    });
    forwards.on('collect', async () => {
        m.reactions.forEach(reaction => reaction.remove(message.author.id));
        m.edit({ embed: await marketEmbed(query, ++page) });
    });
}

async function marketEmbed(query: { [key: string]: string }, page: number = 1) {
    page = page < 1 ? 1 : page;
    let offers: marketOffer[] = (await findOffer(query)).splice((page - 1) * 10);
    const fields = [];
    for (let i = 0; i < Math.min(10, offers.length); ++i)
        fields.push({
            name: `Offer by ${offers[i].seller.tag} (ID: ${offers[i]._id})`,
            value: `${offers[i].offer.amount.commafy()} ${offers[i].offer.currency} for ${offers[i].price.amount.commafy()} ${offers[i].price.currency} ` +
                `(${(offers[i].price.amount / offers[i].offer.amount).toFixed(2).commafy()} per unit)`
        });

    return {
        title: `Welcome to the market. You are on page ${page! || 1} of ${Math.floor((await findOffer(query)).length / 10) + 1}`,
        description: fields.length === 0 ?
            "There are no offers matching your criteria" :
            "If you want to buy an item you are intersted in, use `.buy-offer <id>`",
        fields,
        footer: config.properties.footer,
        color: parseInt(config.properties.embedColor),
        timestamp: new Date()
    }
}