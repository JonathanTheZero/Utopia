import { Message } from "discord.js";
import { marketOffer, resources, user } from "../../utils/interfaces";
import { addOffer, updateValueForUser, getUser, getOfferID } from "../../utils/databasehandler";

//.make-offer <amount> <currency> <price> <price-currency>
export async function makeOffer(message: Message, args: string[]) {
    if (!args[3]) return message.reply("plese follow the syntax of `.make-offer <amount> <currency> <price> <price-currency>`");
    var oc: resources, pc: resources;
    switch (args[1][0]) {
        case "p": oc = "population"; break;
        case "m": oc = "money"; break;
        case "o": oc = "oil"; break;
        case "s": oc = "steel"; break;
        case "f": oc = "food"; break;
        default: return message.reply("please choose a valid currency for selling!");
    }
    switch (args[3][0]) {
        case "p": pc = "population"; break;
        case "m": pc = "money"; break;
        case "o": pc = "oil"; break;
        case "s": pc = "steel"; break;
        case "f": pc = "food"; break;
        default: return message.reply("please choose a valid currency for selling!");
    }

    const user: user = await getUser(message.author.id);
    if (parseInt(args[0].replace(/[,]/g, '')) < 0 || parseInt(args[2].replace(/[,]/g, '')) < 0 ||
        isNaN(parseInt(args[0].replace(/[,]/g, ''))) || isNaN(parseInt(args[2].replace(/[,]/g, ''))))
        return message.reply("this is an invalid amount!");

    if ((oc === "money" && parseInt(args[0].replace(/[,]/g, '')) > user.money) || oc !== "money" && parseInt(args[0].replace(/[,]/g, '')) > user.resources[oc])
        return message.reply("you can't offer more than you own!");

    const offer: marketOffer = {
        _id: (await getOfferID()).toString(),
        seller: {
            _id: message.author.id,
            tag: message.author.tag
        },
        offer: {
            amount: parseInt(args[0].replace(/[,]/g, '')),
            currency: oc
        },
        price: {
            amount: parseInt(args[2].replace(/[,]/g, '')),
            currency: pc
        }
    };

    updateValueForUser(message.author.id, offer.offer.currency, -offer.offer.amount, "$inc");
    addOffer(offer).then(() => message.reply("you succesfully added your offer to the market!"));
}