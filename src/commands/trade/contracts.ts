import { Client, Message } from "discord.js";

import { resources, contract_interface, user} from "../../utils/interfaces";
import { getUser, addContracts} from "../../utils/databasehandler";
import { rangeInt } from "../../utils/utils";
import { buy } from "../buy";

//This is to make a contract
export async function propose(message: Message, args: string[], client: Client) {
    if (!args[3]) return message.reply("plese follow the syntax of `.contract <user> <amount> <currency> <price> <price-currency> <time in hours>`");
    var sellingprice: number, price: number;
    let priceresource: resources, selling: resources;

    let u: user = await getUser(message.author.id)
    sellingprice = parseInt(args[1])
    price = parseInt(args[3])
    switch (args[2][0]) {
        case "p": selling = "population"; break;
        case "m": selling = "money"; break;
        case "o": selling = "oil"; break;
        case "s": selling = "steel"; break;
        case "f": selling = "food"; break;
        default: return message.reply("please choose a valid currency for selling!");
    }

    

    switch (args[4][0]) {
        case "p": priceresource = "population"; break;
        case "m": priceresource = "money"; break;
        case "o": priceresource = "oil"; break;
        case "s": priceresource = "steel"; break;
        case "f": priceresource = "food"; break;
        default: return message.reply("please choose a valid currency for selling!");
    }



    //|| message.author.id
    let buyer = await getUser(message.mentions?.users?.first()?.id || args[0] );

    if (!u) {
        return message.reply("you haven't created an account yet, please use `.create` first");
    }

    if(!buyer){
        return message.reply("Bitch they don't make account")
    }
    
    else{
        if (selling !== "money" && u.resources[selling] < sellingprice || sellingprice <= 0){
            return message.reply("You can't sell more than you own")
        }
        let contractid = ((message.author.id.slice(0, 3))+
        (buyer._id.slice(0, 3)) + Math.floor(rangeInt(0, 100000000000000000000)).toString()).slice(0, 5)

        const contract: contract_interface = {
            proposal: true,
            users: [message.author.id, buyer._id],
            info: { 
                totaltime: 48,
                selling: selling,
                sellingprice: sellingprice,
                priceresource: priceresource,
                price: price
                //renew: boolean;
            }
        };

        
        addContracts(contractid, contract)
        try {
                client.users.get(buyer._id)?.send(`You have been given a contract proposal.\nThe contract id is ${contractid}`);
            } catch { }
        return message.reply(`Your proposal has been sent to ${buyer.tag} for a contract of ${sellingprice} ${selling} everday for the price of ${price} ${priceresource}.\nYour contract id is ${contractid}`);
    }

    

}