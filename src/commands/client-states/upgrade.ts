import { Message } from "discord.js";
import { user, clsUpgrades } from "../../utils/interfaces";
import { getUser, editCLSVal, addToUSB } from "../../utils/databasehandler";
import { governments } from "./consts";

export async function upgradeCLS(message: Message, args: string[]) {
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create`!");
    const index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
    if (index === -1) return message.reply("you have no client state called " + args[0]);
    const cls = user.clientStates[index];
    let r: clsUpgrades;
    switch (args[1][0].toLowerCase()) {
        case "f": r = "farms"; break;
        case "r": r = "rigs"; break;
        case "m": r = "mines"; break;
        default: return message.reply("this isn't a valid upgrade type!");
    }
    const price = {
        money: (cls.upgrades[r] + 1) * 150000,
        steel: (cls.upgrades[r] + 1) * 50000,
        oil: (cls.upgrades[r] + 1) * 50000
    };
    if (cls.resources.money < price.money || cls.resources.steel < price.steel || cls.resources.oil < price.oil) {
        let str: string = "";
        if (cls.resources.money < price.money)
            str += `${args[0]} doesn't have enough money! It needs ${price.money.commafy()} but only got ${cls.resources.money.commafy()}. Consider sending it some money.\n`;
        if (cls.resources.steel < price.steel)
            str += `${args[0]} doesn't have enough steel! It needs ${price.steel.commafy()} but only got ${cls.resources.steel.commafy()}. Consider sending it some steel.\n`;
        if (cls.resources.oil < price.oil)
            str += `${args[0]} doesn't have enough oil! It needs ${price.oil.commafy()} but only got ${cls.resources.oil.commafy()}. Consider sending it some oil.\n`;
        return message.reply(str);
    }
    editCLSVal(user._id, index, r, 1, "$inc");
    editCLSVal(user._id, index, "money", -price.money, "$inc");
    editCLSVal(user._id, index, "steel", -price.steel, "$inc");
    editCLSVal(user._id, index, "oil", -price.oil, "$inc");
    addToUSB(price.money);
    const gain = (.1 * governments[user.clientStates[index].government].loyaltyIncrease);
    if (cls.loyalty < 1 - gain) editCLSVal(user._id, index, "loyalty", gain, "$inc");
    else editCLSVal(user._id, index, "loyalty", 1, "$set");
    return message.reply(
        `Upgrade bought successfully! ${user.clientStates[index].name} now owns ${cls.upgrades[r] + 1} ${r}.\n` +
        `This increased their loyalty by ${gain.toLocaleString("en", { style: "percent" })}!`
    );
}