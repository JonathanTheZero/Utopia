import { Message } from "discord.js";
import { getUser, updateValueForUser, addUpgrade, getAlliance, addAllianceUpgrade, updateValueForAlliance, addPF, addToUSB } from "../utils/databasehandler";
import { user, alliance } from "../utils/interfaces";
import "../utils/utils";

export async function buy(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);
    if (!user) return message.reply("you haven't created an account yet, please use `.create` first");

    if (args[0] == "uk" || (args[0] == "invade") && args[1] == "the" && args[2] == "uk")
        return message.reply(await buyItem("UK", message.author.id, 100000));
    else if (args[0] == "equipment" || (args[0] == "advanced") && args[1] == "equipment")
        return message.reply(await buyItem("AE", message.author.id, 250000));
    else if (args[0] == "russia" || (args[0] == "invade") && args[1] == "russia")
        return message.reply(await buyItem("RU", message.author.id, 500000));
    else if (args[0] == "city" || (args[0] == "expand") && args[1] == "your" && args[2] == "city" || args[0] == "expanded" && args[1] == "city")
        return message.reply(await buyItem("EC", message.author.id, 1000000));
    else if (args[0] == "globalization")
        return message.reply(await buyItem("GL", message.author.id, 2500000));
    else if (args[0] == "soldiers" || (args[0] == "recruit") && args[1] == "more" && args[2] == "soldiers")
        return message.reply(await buyItem("MS", message.author.id, 10000000));
    else if (args[0] == "us" || (args[0] == "invade") && args[1] == "the" && args[2] == "us")
        return message.reply(await buyItem("US", message.author.id, 50000000));
    else if (args[0].startsWith("hospital"))
        return message.reply(await buyHospital(message.author.id));
    else if (args[0] == "food" || args[0] == "a" && args[1] == "pack" && args[2] == "of" && args[3] == "food") {
        let amount;
        if (typeof args[1] != "undefined" && !isNaN(parseInt(args[1]))) amount = parseInt(args[1]);
        if (typeof args[1] != "undefined" && !isNaN(parseInt(args[4]))) amount = parseInt(args[4]);
        if (isNaN(<any>amount) || typeof amount == "undefined") amount = 1;
        if (user.money >= amount * 20000) {
            updateValueForUser(message.author.id, "money", -20000 * amount, "$inc");
            addToUSB(20000 * amount);
            updateValueForUser(message.author.id, "food", Math.floor(amount * 50000), "$inc");
            return message.reply(`you successfully bought ${(amount * 50000).commafy()} food for your population.`);
        }
        return message.reply("you don't have enough money.");
    }
    else if (args[0] == "arable" && args[1] == "farming")
        return message.reply(await buyItemAlliance("AF", message.author.id, 100000));
    else if (args[0] == "pastoral" && args[1] == "farming")
        return message.reply(await buyItemAlliance("PF", message.author.id, 1750000));
    else if (args[0] == "mixed" && args[1] == "farming")
        return message.reply(await buyItemAlliance("MF", message.author.id, 7500000));
    else if (args[0] == "nf" || (args[0] == "nomadic") && args[1] == "farming")
        return message.reply(await buyPersonalfarm("nf", message.author.id, 750000));
    else if (args[0] == "sf" || (args[0] == "subsistence") && args[1] == "farming")
        return message.reply(await buyPersonalfarm("sf", message.author.id, 2750000));
    else if (args[0] == "sef" || (args[0] == "sedentary") && args[1] == "farming")
        return message.reply(await buyPersonalfarm("sef", message.author.id, 7500000));
    else if (args[0] == "if" || (args[0] == "intensive") && args[1] == "farming")
        return message.reply(await buyPersonalfarm("if", message.author.id, 15000000));
}

async function buyPersonalfarm(item: "nf" | "sf" | "sef" | "if", id: string, price: number): Promise<string> {
    let user: user = await getUser(id);
    if (user.money < price)
        return `this items costs ${price.commafy()} coins! You only own ${user.money.commafy()}`;
    addToUSB(price);
    if (item === "nf") {
        if (user.upgrades.pf.nf >= 4)
            return "you already own this item four times!";
        addPF(id, item);
        updateValueForUser(id, "money", -price, "$inc");
        return "Congrats! You just bought a new personal farm";
    } else {
        if (user.upgrades.pf[item] >= 3)
            return "you already own this item three times!";
        addPF(id, item);
        updateValueForUser(id, "money", -price, "$inc");
        return "Congrats! You just bought a new personal farm!";
    }
}

async function buyItem(item: "UK" | "AE" | "RU" | "EC" | "GL" | "MS" | "US", id: string, price: number): Promise<string> {
    let user: user = await getUser(id);
    if (user.upgrades.population.includes(item) || user.upgrades.misc.includes(item))
        return "you already own that item!";
    if (user.money >= price) {
        updateValueForUser(id, "money", -price, "$inc");
        addToUSB(price);
        const populationUpgrades = ["UK", "AE", "RU", "EC", "GL", "MS", "US"];
        if (populationUpgrades.includes(item)) addUpgrade(id, item, "population");
        switch (item) {
            case "UK": return "you succesfully invaded the UK.";
            case "AE": return "you succesfully used the Advanced Equipment.";
            case "RU": return "you succesfully invaded Russia.";
            case "EC": return "you succesfully expanded your city.";
            case "GL": return "you succesfully discovered globalization."
            case "MS": return "you succesfully recruited more soldiers.";
            case "US": return "you succesfully invaded the US";
            default: return "Error!";
        }
    }
    return "You don't have enough money to buy that item.";
}

async function buyItemAlliance(itemShort: "AF" | "PF" | "MF", id: string, price: number): Promise<string> {
    let user: user = await getUser(id);
    let alliance: alliance | null = await getAlliance(user.alliance as string);
    if (!alliance) return "you haven't joined an alliance yet";
    if (user.allianceRank == "M") return "sorry, you rank isn't high enough to buy upgrades.";

    if (alliance.money >= price) {
        addToUSB(price);
        if (itemShort == "AF") {
            if (alliance.upgrades.af >= alliance.level)
                return "sorry, your alliance level isn't high enough to buy this upgrade another time. Use `.upgradealliance` to increase your alliance level."
            addAllianceUpgrade(alliance.name, "af");
        }
        else if (itemShort == "PF") {
            if (alliance.upgrades.pf >= alliance.level)
                return "sorry, your alliance level isn't high enough to buy this upgrade another time. Use `.upgradealliance` to increase your alliance level."
            addAllianceUpgrade(alliance.name, "pf");
        }
        else if (itemShort == "MF") {
            if (alliance.upgrades.mf >= alliance.level)
                return "sorry, your alliance level isn't high enough to buy this upgrade another time. Use `.upgradealliance` to increase your alliance level."
            addAllianceUpgrade(alliance.name, "mf");
        }
        else return "sorry, an error occured."
        updateValueForAlliance(alliance.name, "money", -1 * price, "$inc");
    }
    else return "your alliance doesn't have enough money to buy that item.";
    switch (itemShort) {
        case "AF": return "you successfully bought the arable farming upgrade for your alliance.";
        case "PF": return "you successfully bought the pastoral farming upgrade for your alliance.";
        case "MF": return "you successfully bought the mixed farming upgrade for your alliance.";
    }
}

async function buyHospital(id: string): Promise<string> {
    const u: user = await getUser(id);
    const price = {
        money: (u.upgrades.hospitals + 1) * 100000,
        steel: (u.upgrades.hospitals + 1) * 20000
    };
    if (u.money < price.money) return `you don't have enough money, you need ${price.money.commafy()} but you only have ${u.money.commafy()}.`;
    if (u.resources.steel < price.steel) return `you don't have enough steel, you need ${price.steel.commafy()} but you only have ${u.resources.steel.commafy()}.`;
    if (u.upgrades.hospitals >= 5) return `you already own the maximum amount of 5 hospitals.`;
    updateValueForUser(id, "money", -price.money, "$inc");
    updateValueForUser(id, "steel", -price.steel, "$inc");
    updateValueForUser(id, "hospitals", 1, "$inc");
    addToUSB(price.money + price.steel);
    return "you succesfully bought a new hospital for your population!";
}