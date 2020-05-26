import { Message } from "discord.js";
import { user, clsUpgrades } from "../../utils/interfaces";
import { getUser, editCLSVal } from "../../utils/databasehandler";

export async function upgradeCLS(message: Message, args: string[]) {
    const user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create`!");
    const index = user.clientStates.findIndex(el => el.name.toLowerCase() === args[0].toLowerCase());
    if (index === -1) return message.reply("you have no client state called " + args[0]);
    const cls = user.clientStates[index];
    let r: clsUpgrades;
    switch (args[1][0]) {
        case "f": r = "farms"; break;
        case "r": r = "rigs"; break;
        case "m": r = "mines"; break;
        default: return message.reply("this isn't a valid upgrade type!");
    }
    const price = {
        money: (cls.upgrades.farms + cls.upgrades.mines + cls.upgrades.rigs + 1) * 150000,
        steel: (cls.upgrades.farms + cls.upgrades.mines + cls.upgrades.rigs + 1) * 70000,
        oil: (cls.upgrades.farms + cls.upgrades.mines + cls.upgrades.rigs + 1) * 50000
    };
    if (cls.resources.money < price.money)
        return message.reply(`${args[0]} doesn't have enough money! It needs ${price.money.commafy()} but only got ${cls.resources.money.commafy()}. Consider sending it some money.`);
    if (cls.resources.steel < price.steel)
        return message.reply(`${args[0]} doesn't have enough steel! It needs ${price.steel.commafy()} but only got ${cls.resources.steel.commafy()}. Consider sending it some steel.`);
    if (cls.resources.oil < price.oil)
        return message.reply(`${args[0]} doesn't have enough oil! It needs ${price.oil.commafy()} but only got ${cls.resources.oil.commafy()}. Consider sending it some oil.`);
    editCLSVal(user._id, index, r, 1, "$inc");
    editCLSVal(user._id, index, "money", -price.money, "$inc");
    editCLSVal(user._id, index, "steel", -price.steel, "$inc");
    editCLSVal(user._id, index, "oil", -price.oil, "$inc");
    if (cls.loyalty < .9) editCLSVal(user._id, index, "loyalty", .1, "$inc");
    else editCLSVal(user._id, index, "loyalty", 1, "$set");
    return message.reply(
        `Upgrade bought successfully! ${user.clientStates[index].name} now owns ${cls.upgrades[r] + 1} ${r}.\n` + 
        "This increased their loyalty by 10%!"
    );
}