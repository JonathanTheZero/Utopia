import { user, army, war } from "../../utils/interfaces";
import { Message } from "discord.js";
import { getUser, findWarByUser, addArmy, updateCosts } from "../../utils/databasehandler";
import "../../utils/utils";
import { prices } from "./consts";

//format: .mobilize armyID Infantry Artillery Tanks Jets
export async function mobilize(message: Message, args: string[]) {
    if (!args[3]) return message.reply("please follow the syntax of `.mobilize <Infantry> <Artillery> <Tanks> <Jets>`");
    const user: user = await getUser(message.author.id);

    let war: war | null = await findWarByUser(user._id);
    if (!war) return message.reply("you don't participate in any wars at the moment");
    const a = war.p1._id === user._id ? war.p1.armies : war.p2.armies;
    if (a.length === 3) return message.reply("you can only have 3 armies.")

    const army: army = {
        if: parseInt(args[0]),
        art: parseInt(args[1]),
        tnk: parseInt(args[2]),
        jet: parseInt(args[3]),
        field: null,
        moved: true,
    };

    const costs = {
        creation: {
            money: army.if * prices.infantry.creation.money + army.art * prices.artillery.creation.money + army.tnk * prices.tanks.creation.money + army.jet * prices.jets.creation.money,
            steel: army.if * prices.infantry.creation.steel + army.art * prices.artillery.creation.steel + army.tnk * prices.tanks.creation.steel + army.jet * prices.jets.creation.steel,
            population: army.if * prices.infantry.creation.population + army.art * prices.artillery.creation.population +
                army.tnk * prices.tanks.creation.population + army.jet * prices.jets.creation.population,
        },
        perRound: {
            money: army.if * prices.infantry.perRound.money + army.art * prices.artillery.perRound.money + army.tnk * prices.tanks.perRound.money + army.jet * prices.jets.perRound.money,
            oil: army.tnk * prices.tanks.perRound.oil + army.jet * prices.jets.perRound.oil,
            food: army.if * prices.infantry.perRound.food + army.art * prices.artillery.perRound.food
        }
    }

    if(costs.creation.money > user.money) 
        return message.reply(`this would cost you ${costs.creation.money.commafy()} money, but you only have ${user.money.commafy()} money!`);
    if(costs.creation.steel > user.resources.steel) 
        return message.reply(`this would cost you ${costs.creation.steel.commafy()} steel, but you only have ${user.resources.steel.commafy()} steel!`);
    if(costs.creation.population > user.resources.population)
        return message.reply(`this would cost you ${costs.creation.population.commafy()} population, but you only have ${user.resources.population.commafy()} population!`);

    await addArmy(war._id, army, user._id === war.p1._id);
    a.push(army);
    message.channel.send({
        embed: {
            title: "Your army: ",
            description: `This army consists of ${(army.if * 1000).commafy()} Infantry, ${(army.art * 1000).commafy()} Artillery, ${(army.tnk * 1000).commafy()} Tanks, ${(army.jet * 1000).commafy()} Jets.\n` +
                `The creation costs ${costs.creation.money.commafy()} money, ${costs.creation.steel.commafy()} steel and ${costs.creation.population.commafy()} population.\n` +
                `They will cost you ${costs.perRound.money.commafy()} money, ${costs.perRound.oil.commafy()} oil and ${costs.perRound.food.commafy()} food per Round.\n` +
                "You can view your armies using `.armies`"
        }
    });

    await Promise.all([
        updateCosts(war._id, "money", user._id === war.p1._id, costs.creation.money),
        updateCosts(war._id, "steel", user._id === war.p1._id, costs.creation.steel),
        updateCosts(war._id, "population", user._id === war.p1._id, costs.creation.population)
    ]);
    return message.reply(a.length === 3 ? "you have successfully mobilized all your armies. Use `.ready` whenever you are ready." : `You still have ${3 - a.length} army slots`);
}

export async function deployTrrops(message: Message, _args: string[]) {
    const user: user = await getUser(message.author.id);

    let war: war | null = await findWarByUser(user._id);
    if (!war) return message.reply("you don't participate in any wars at the moment");

    if (!(war.p1.ready && war.p2.ready)) return message.reply("not both players are ready yet.");

    const armies = war.p1._id === user._id ? war.p1.armies : war.p2.armies;

    message.channel.send({
        embed: {
            title: "Troops of " + user.tag,
            description: "These are your armies:",
            fields: [
                {
                    title: "Army 1:",
                    inline: true,
                    value: `${(armies[0].if * 1000).commafy()} Infantry
                        ${(armies[0].art * 1000).commafy()} Artillery
                        ${(armies[0].tnk * 1000).commafy()} Tanks
                        ${(armies[0].jet * 1000).commafy()} Jets`
                },
                {
                    title: "Army 2:",
                    inline: true,
                    value: `${(armies[1].if * 1000).commafy()} Infantry
                        ${(armies[1].art * 1000).commafy()} Artillery
                        ${(armies[1].tnk * 1000).commafy()} Tanks
                        ${(armies[1].jet * 1000).commafy()} Jets`
                },
                {
                    title: "Army 3:",
                    inline: true,
                    value: `${(armies[2].if * 1000).commafy()} Infantry
                        ${(armies[2].art * 1000).commafy()} Artillery
                        ${(armies[2].tnk * 1000).commafy()} Tanks
                        ${(armies[2].jet * 1000).commafy()} Jets`
                }
            ]
        }
    });
}