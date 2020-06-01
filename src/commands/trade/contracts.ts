import { Client, Message } from "discord.js";
import * as config from "../../static/config.json";
import { resources, contract, user } from "../../utils/interfaces";
import { getUser, addContract, getContract, deleteContract, getAllContracts, updateValueForUser, ContractTime, ContractAccepted } from "../../utils/databasehandler";

//This is to make a contract
export async function propose(message: Message, args: string[], client: Client) {
    if (!args[3]) return message.reply("plese follow the syntax of `.contract <user> <amount> <currency> <price> <price-currency> <time in days>`");
    var sellingprice: number, price: number, time: number = parseInt(args[5]);
    let priceresource: resources, selling: resources;

    let u: user = await getUser(message.author.id)
    sellingprice = parseInt(args[1]);
    price = parseInt(args[3]);

    switch (args[2][0]) {
        case "p": selling = "population"; break;
        case "m": selling = "money"; break;
        case "o": selling = "oil"; break;
        case "s": selling = "steel"; break;
        case "f": selling = "food"; break;
        default: return message.reply("please choose a valid currency for selling!");
    }

    if (time < 0) return message.reply("Your time can't be negative");

    if (time > 14) return message.reply("Your time can't be greater than 2 weeks");

    switch (args[4][0]) {
        case "p": priceresource = "population"; break;
        case "m": priceresource = "money"; break;
        case "o": priceresource = "oil"; break;
        case "s": priceresource = "steel"; break;
        case "f": priceresource = "food"; break;
        default: return message.reply("please choose a valid currency for selling!");
    }

    let buyer = await getUser(message.mentions?.users?.first()?.id || args[0]);

    if (!u) return message.reply("you haven't created an account yet, please use `.create` first");

    if (!buyer) return message.reply("This user hasn't created an account yet");
    if (selling !== "money" && u.resources[selling] < sellingprice || sellingprice <= 0)
        return message.reply("You can't sell more than you own");

    const contract: contract = {
        _id: message.id,
        proposal: true,
        users: [message.author.id, buyer._id],
        info: {
            totaltime: time,
            selling: selling,
            sellingprice: sellingprice,
            priceresource: priceresource,
            price: price
            //renew: boolean;
        }
    };

    addContract(contract);
    try {
        client.users.get(buyer._id)?.send(`You have been given a contract proposal.\nThe contract id is ${contract._id}`);
    } catch { }
    return message.reply(
        `Your proposal has been sent to ${buyer.tag} for a contract of ${sellingprice} ${selling} everday for the price of ${price} ${priceresource}.\nYour contract id is ${contract._id}`
    );
}

export async function viewContract(message: Message, args: string[], client: Client) {
    let contractid = args[0]

    let contractinfo: contract = await getContract(contractid);

    return message.channel.send({
        embed: {
            title: `Contract #${client.users.get(contractid)?.tag}`,
            description: `A contract proposal between ${contractid}`,
            fields: [
                {
                    name: `${client.users.get(contractinfo.users[0])?.tag} offer`,
                    value: `${contractinfo.info.sellingprice} ${contractinfo.info.selling}`,
                    inline: true
                },
                {
                    name: `Price`,
                    value: `${contractinfo.info.price} ${contractinfo.info.priceresource}`,
                    inline: true
                }
            ],
            footer: config.properties.footer,
            timestamp: new Date(),
            color: parseInt(config.properties.embedColor)
        }
    });


}

export async function acceptedContract(message: Message, args: string[]) {
    let contractid = args[0]
    let contractinfo = await getContract(contractid);

    if (["no", "n", "N", "No"].includes(args[1]))
        return message.channel.send(`Contract between <@${contractinfo.users[0]}> and <@${contractinfo.users[1]}> ${await deleteContract(contractid)}`);

    else if (message.author.id === contractinfo.users[1] && ["yes", "y", "Y", "Yes"].includes(args[1])) {
        await ContractAccepted(contractid);
        return message.reply(`<@${contractinfo.users[0]}> contract has been accepted.`);
    }

    else return message.reply("You can't accept a contract that you proposed!");

}

export async function contractPayout() {
    //user[0] is the buyer <--- gets selling loses price
    //user[1] sells <--- gets price loses selling
    let allContracts = await getAllContracts();
    for (const contracts of allContracts) {
        if (contracts.proposal) continue;
        let u1 = await getUser(contracts.users[0])
        let u2 = await getUser(contracts.users[1])
        let selling = contracts.info.selling
        let sellingprice = contracts.info.sellingprice
        let price = contracts.info.price
        let priceresource = contracts.info.priceresource

        await Promise.all([
            updateValueForUser(u1._id, selling, sellingprice, "$inc"),
            updateValueForUser(u1._id, priceresource, price, "$inc"),
            updateValueForUser(u2._id, selling, sellingprice, "$inc"),
            updateValueForUser(u2._id, priceresource, price, "$inc")
        ]);

        if (contracts.info.totaltime - 1 > 0) await ContractTime(contracts._id, contracts.info.totaltime - 1)

        else await deleteContract(contracts._id)

    }
}