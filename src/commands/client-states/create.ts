import { Message } from "discord.js";
import { clientState, user } from "../../utils/interfaces";
import { getUser, addClientState, updateValueForUser, addToUSB, updateValueForAlliance } from "../../utils/databasehandler";
import "../../utils/utils";
import Governor from "./governors";

export async function createCLS(message: Message, args: string[]) {
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create`.");
    const price = (user.clientStates.length + 1) * 500000000;
    if (user.money < price) return message.reply(`you don't have enough money to found yet another client state, you need ${price.commafy()} money.`);
    if (!args[0]) return message.reply("please follow the syntax of `.create-cls <name>`");
    if (user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase()) !== -1) return message.reply("you already have a client state called " + args[0]);
    const cls: clientState = {
        name: args[0],
        resources: {
            food: 0,
            oil: 0,
            steel: 0,
            population: 0,
            money: 0
        },
        loyalty: 1,
        upgrades: {
            mines: 0,
            rigs: 0,
            farms: 0
        },
        focus: null,
        government: "monarchy"
    }
    updateValueForUser(user._id, "money", -price, "$inc");
    if (user.alliance) updateValueForAlliance(user.alliance, "clientStates", 1, "$inc");
    addToUSB(price);
    addClientState(user._id, cls);
    message.channel.send(`\`\`\`ts
        ${JSON.stringify(new Governor(), null, 2)}
    \`\`\``);
    return message.reply(`you successfully founded the state of ${cls.name}. It is a monarchy!`);
}