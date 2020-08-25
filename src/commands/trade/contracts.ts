import { Client, Message } from "discord.js";
import * as config from "../../static/config.json";
import { resources, contract, user } from "../../utils/interfaces";
import { getUser, addContract, getContract, deleteContract, getAllContracts, updateValueForUser, ContractTime, ContractAccepted, getContractID } from "../../utils/databasehandler";

//This is to make a contract
export async function propose(message: Message, args: string[], client: Client) {
    if (!args[5]) return message.reply("plese follow the syntax of `.contract <user> <amount> <currency> <price> <price-currency> <time in days>`");
    let sellingprice: number, price: number, time: number = parseInt(args[5]);
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
    
    const _id: string = (await getContractID()).toString();

    const contract: contract = {
        _id,
        proposal: true,
        users: [message.author.id, buyer._id],
        info: {
            totaltime: time,
            selling: selling,
            sellingprice: sellingprice,
            priceresource: priceresource,
            price: price
        }
    };

    addContract(contract);
    try {
        client.users.cache.get(buyer._id)?.send(`You have been given a contract proposal.\nThe contract id is ${_id.commafy()}`);
    } catch { }
    return message.reply(
        `Your proposal has been sent to ${buyer.tag} for a contract of ${sellingprice} ${selling} everday for the price of ${price} ${priceresource}.\nYour contract id is ${_id.commafy()}`
    );
}

export async function viewContract(message: Message, args: string[], client: Client) {
    if(!args[0]) return message.reply("please follow the syntax of `.view-contract <contractID>`.");

    let contract: contract = await getContract(args[0]);

    return message.channel.send({
        embed: {
            title: `Contract #${contract._id}`,
            description: `A contract proposal between ${client.users.cache.get(contract.users[0])?.tag} and ${client.users.cache.get(contract.users[1])?.tag}`,
            fields: [
                {
                    name: `${client.users.cache.get(contract.users[0])?.tag} offer`,
                    value: `${contract.info.sellingprice} ${contract.info.selling}`,
                    inline: true
                },
                {
                    name: `Price`,
                    value: `${contract.info.price} ${contract.info.priceresource}`,
                    inline: true
                }
            ],
            footer: config.properties.footer,
            timestamp: new Date(),
            color: parseInt(config.properties.embedColor)
        }
    });
}

export async function acceptedContract(message: Message, args: string[], client: Client) {
    if(!args[1]) return message.reply("please follow the syntax of `.accept <contractID> <yes | no>`.");
    let contract = await getContract(args[0]);

    if (args[1]?.[0].toLowerCase() === "n"){
        await deleteContract(args[0]);
        client.users.cache.get(contract.users[0])?.send(`${client.users.cache.get(contract.users[1])?.tag} rejected your contract proposal.`);
        return message.reply(`Contract has been cancelled.`);
    } else if (message.author.id === contract.users[1] && args[1]?.[0].toLowerCase() === "y") {
        await ContractAccepted(args[0]);
        client.users.cache.get(contract.users[0])?.send(`${client.users.cache.get(contract.users[1])?.tag} accepted your contract proposal.`);
        return message.reply(`<@${contract.users[0]}> contract has been accepted.`);
    }

    else if(!contract.users.includes(message.author.id)) return message.reply("You can't accept a contract that you proposed!");

    else return message.reply("an error occured.");
}

/**
 * referenced in ../payouts/daily.ts
 */
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

        Promise.all([
            updateValueForUser(u1._id, selling, sellingprice, "$inc"),
            updateValueForUser(u1._id, priceresource, -price, "$inc"),
            updateValueForUser(u2._id, selling, -sellingprice, "$inc"),
            updateValueForUser(u2._id, priceresource, price, "$inc")
        ]).then(() => {
            if (contracts.info.totaltime - 1 > 0) ContractTime(contracts._id, contracts.info.totaltime - 1)

            else deleteContract(contracts._id)
        });
    }
}