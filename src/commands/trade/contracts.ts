import { Client, Message } from "discord.js";

import { resources, contract_interface} from "../../utils/interfaces";
import { getUser, addContracts} from "../../utils/databasehandler";
import { rangeInt } from "../../utils/utils";

//This is to make a contract
export async function propose(message: Message, args: string[], client: Client) {
    if (!args[3]) return message.reply("plese follow the syntax of `.contract <user> <amount> <currency> <price> <price-currency> <time in hours>`");
    var selling: resources, price: resources;

    switch (args[2][0]) {
        case "p": selling = "population"; break;
        case "m": selling = "money"; break;
        case "o": selling = "oil"; break;
        case "s": selling = "steel"; break;
        case "f": selling = "food"; break;
        default: return message.reply("please choose a valid currency for selling!");
    }
    switch (args[4][0]) {
        case "p": price = "population"; break;
        case "m": price = "money"; break;
        case "o": price = "oil"; break;
        case "s": price = "steel"; break;
        case "f": price = "food"; break;
        default: return message.reply("please choose a valid currency for selling!");
    }

    //|| message.author.id
    const buyer = await getUser(message.mentions?.users?.first()?.tag || args[0] );

    if (!buyer) {
        if (!args[0]) return message.reply("you haven't created an account yet, please use `.create` first");
        else return message.reply("this user hasn't created an account yet!");
    }

    else{
        let contractid = ((message.author.id.slice(0, 3))+
        (buyer._id.slice(0, 3)) + Math.floor(rangeInt(0, 100000000000000000000)).toString()).slice(0, 5)

        const contract: contract_interface = {
            proposal: true,
            users: [message.author.id, buyer._id],
            info: { 
                totaltime: 48,
                selling: selling,
                price: price,
                //renew: boolean;
            }
        };

        
        addContracts(contractid, contract)
        try {
                client.users.get(buyer._id)?.send(`You have been given a contract proposal.\nThe contract id is ${contractid}`);
            } catch { }
        return message.reply(`Your proposal has been sent to ${buyer.tag}> for a contract of ${selling} everday for the price of ${price}.\nYour contract id is ${contractid}`);
    }

    

}