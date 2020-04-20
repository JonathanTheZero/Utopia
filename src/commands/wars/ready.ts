import { getUser, findWarByUser, updateReady, markAllArmies, updateCosts, } from "../../utils/databasehandler";
import { Message, TextChannel, Channel } from "discord.js";
import { user, war } from "../../utils/interfaces";
import * as config from "../../static/config.json";
import { prices } from ".";

export async function ready(message: Message) {
    const user: user = await getUser(message.author.id);
    let war: war | null = await findWarByUser(user._id);
    if (!war) return message.reply("you don't participate in any wars at the moment");
    const a = war.p1._id === user._id ? war.p1 : war.p2;

    await updateReady(war._id, war.p1._id === user._id);

    a.ready = true;

    if (war.p1.ready && war.p2.ready && !war.p1.armies[0].field) {
        await Promise.all([
            updateReady(war._id, true, false),
            updateReady(war._id, false, false)
        ]);
        message.channel.send({
            embed: {
                title: "Get ready to fight!",
                description:
                    "Both parties are ready, now deploy your armies on the field using `.setposition <armyindex> <x> <y>`",
                color: 0x00ff00,
                footer: config.properties.footer,
                timestamp: new Date(),
            }
        });
    }
    else if (war.p1.ready && war.p2.ready) {
        await Promise.all([
            markAllArmies(war!._id, false),
            updateReady(war._id, false, false),
            updateReady(war._id, true, false),
        ]);
        message.channel.send({
            embed: {
                title: "Next round is starting!",
                description:
                    "You can move your armies with `.move <armyindex> <x> <y>` or attack the armies of your opponent using `.attack <armyindex> <enemy-army>`.",
                color: 0x00bbbb,
                footer: config.properties.footer,
                timestamp: new Date(),
            }
        });
        await consumption(war, <TextChannel>message.channel)
    }
}

async function consumption(war: war, channel: TextChannel) {
    for (const army of war.p1.armies) {
        const costs = {
            money: army.if * prices.infantry.perRound.money + army.art * prices.artillery.perRound.money + army.tnk * prices.tanks.perRound.money + army.jet * prices.jets.perRound.money,
            oil: army.tnk * prices.tanks.perRound.oil + army.jet * prices.jets.perRound.oil,
            food: army.if * prices.infantry.perRound.food + army.art * prices.artillery.perRound.food
        }
        await Promise.all([
            updateCosts(war._id, "money", true, costs.money),
            updateCosts(war._id, "oil", true, costs.oil),
            updateCosts(war._id, "food", true, costs.food),
        ]);
        if (war.p1.resources.money.consumed + costs.money > war.p1.resources.money.begin)
            channel.send(`<@${war.p1._id}>, you ran out of money, your troops will be performing worse!`);
        if (war.p1.resources.oil.consumed + costs.oil > war.p1.resources.oil.begin)
            channel.send(`<@${war.p1._id}>, you ran out of oil, your troops will be performing worse!`);
        if (war.p1.resources.food.consumed + costs.food > war.p1.resources.food.begin)
            channel.send(`<@${war.p1._id}>, you ran out of food, your troops will be performing worse!`);
    }
    for (const army of war.p2.armies) {
        const costs = {
            money: army.if * prices.infantry.perRound.money + army.art * prices.artillery.perRound.money + army.tnk * prices.tanks.perRound.money + army.jet * prices.jets.perRound.money,
            oil: army.tnk * prices.tanks.perRound.oil + army.jet * prices.jets.perRound.oil,
            food: army.if * prices.infantry.perRound.food + army.art * prices.artillery.perRound.food
        }
        await Promise.all([
            updateCosts(war._id, "money", false, costs.money),
            updateCosts(war._id, "oil", false, costs.oil),
            updateCosts(war._id, "food", false, costs.food),
        ]);
        if (war.p2.resources.money.consumed + costs.money > war.p2.resources.money.begin)
            channel.send(`<@${war.p2._id}>, you ran out of money, your troops will be performing worse!`);
        if (war.p2.resources.oil.consumed + costs.oil > war.p2.resources.oil.begin)
            channel.send(`<@${war.p2._id}>, you ran out of oil, your troops will be performing worse!`);
        if (war.p2.resources.food.consumed + costs.food > war.p2.resources.food.begin)
            channel.send(`<@${war.p2._id}>, you ran out of food, your troops will be performing worse!`);
    }
}
