import { Message } from "discord.js";
import { user, war, army } from "../../utils/interfaces";
import { getUser, findWarByUser, moveArmy, replaceArmy } from "../../utils/databasehandler";
import { battleStats as ba, prices } from ".";

export async function attack(message: Message, args: string[]) {
    if (!args[1]) return message.reply("please follow the syntax of `.attack <armyindex> <enemy-army>`");
    const u: user = await getUser(message.author.id);

    let w: war | null = await findWarByUser(u._id);
    if (!w) return message.reply("you are not fighting in any active battles.");
    //if (!(w.p1.ready && w.p2.ready)) return message.reply("not everyone is ready yet!");

    const p1 = u._id === w.p1._id;
    const [a, b] = p1 ? [w.p1, w.p2] : [w.p2, w.p1];
    const curr = a.armies[parseInt(args[0]) - 1];
    const opp = b.armies[parseInt(args[1]) - 1];

    if (curr.moved) return message.reply("you already moved that army this round!");
    if (!curr.field) return message.reply("you haven't deployed that army yet!");

    if (Math.abs(curr.field![0] - opp.field![0]) > 1 || Math.abs(curr.field![1] - opp.field![1]) > 1) {
        return message.reply("that army is out of range! You can only attack armies on neighbouring fields.");
    }
    else {

        message.channel.send({
            embed: {
                title: `Battle between Army ${args[0]} of ${a.tag} and Army ${args[1]} of ${b.tag}`,
                description: (await battle(curr, opp, w, p1, args[0])).join("\n")
            }
        });
    }
}

async function battle(curr: army, opp: army, war: war, p1: boolean, index: string) {
    const costs = {
        a: {
            money: curr.if * prices.infantry.perRound.money + curr.art * prices.artillery.perRound.money + curr.tnk * prices.tanks.perRound.money + curr.jet * prices.jets.perRound.money,
            oil: curr.tnk * prices.tanks.perRound.oil + curr.jet * prices.jets.perRound.oil,
            food: curr.if * prices.infantry.perRound.food + curr.art * prices.artillery.perRound.food
        },
        b: {
            money: opp.if * prices.infantry.perRound.money + opp.art * prices.artillery.perRound.money + opp.tnk * prices.tanks.perRound.money + opp.jet * prices.jets.perRound.money,
            oil: opp.tnk * prices.tanks.perRound.oil + opp.jet * prices.jets.perRound.oil,
            food: opp.if * prices.infantry.perRound.food + opp.art * prices.artillery.perRound.food
        }

    }
    const [n, m] = p1 ? [war.p1, war.p2] : [war.p2, war.p1];
    let [x, y] = [1, 1];
    if (n.resources.money.consumed + costs.a.money > n.resources.money.begin
        || n.resources.oil.consumed + costs.a.oil > n.resources.oil.begin
        || n.resources.food.consumed + costs.a.food > n.resources.food.begin)
        x = .5;
    if (m.resources.money.consumed + costs.b.money > m.resources.money.begin
        || m.resources.oil.consumed + costs.b.oil > m.resources.oil.begin
        || m.resources.food.consumed + costs.b.food > m.resources.food.begin)
        y = .5;
    const att = {
        attack: {
            inf: (curr.if * ba.if.attack.if + curr.art * ba.art.attack.if + curr.tnk * ba.art.attack.if + curr.jet * ba.jets.attack.if) * x,
            art: (curr.if * ba.if.attack.art + curr.art * ba.art.attack.art + curr.tnk * ba.art.attack.art + curr.jet * ba.jets.attack.art) * x,
            tanks: (curr.if * ba.if.attack.tanks + curr.art * ba.art.attack.tanks + curr.tnk * ba.art.attack.tanks + curr.jet * ba.jets.attack.tanks) * x,
            jet: (curr.if * ba.if.attack.jets + curr.art * ba.art.attack.jets + curr.tnk * ba.art.attack.jets + curr.jet * ba.jets.attack.jets) * x,
        },
        defense: {
            inf: (curr.if * ba.if.defense) * x,
            art: (curr.art * ba.art.defense) * x,
            tanks: (curr.tnk * ba.tanks.defense) * x,
            jet: (curr.jet * ba.jets.defense) * x
        },
        hp: {
            inf: (curr.if * ba.if.hp) * x,
            art: (curr.art * ba.art.hp) * x,
            tanks: (curr.tnk * ba.tanks.hp) * x,
            jet: (curr.jet * ba.jets.hp) * x
        }
    };
    const def = {
        attack: {
            inf: (opp.if * ba.if.attack.if + opp.art * ba.art.attack.if + opp.tnk * ba.art.attack.if + opp.jet * ba.jets.attack.if) * y,
            art: (opp.if * ba.if.attack.art + opp.art * ba.art.attack.art + opp.tnk * ba.art.attack.art + opp.jet * ba.jets.attack.art) * y,
            tanks: (opp.if * ba.if.attack.tanks + opp.art * ba.art.attack.tanks + opp.tnk * ba.art.attack.tanks + opp.jet * ba.jets.attack.tanks) * y,
            jet: (opp.if * ba.if.attack.jets + opp.art * ba.art.attack.jets + opp.tnk * ba.art.attack.jets + opp.jet * ba.jets.attack.jets) * y,
        },
        defense: {
            inf: (opp.if * ba.if.defense) * y,
            art: (opp.art * ba.art.defense) * y,
            tanks: (opp.tnk * ba.tanks.defense) * y,
            jet: (opp.jet * ba.jets.defense) * y
        },
        hp: {
            inf: (opp.if * ba.if.hp) * y,
            art: (opp.art * ba.art.hp) * y,
            tanks: (opp.tnk * ba.tanks.hp) * y,
            jet: (opp.jet * ba.jets.hp) * y
        }
    };
    let str: string[] = [];
    let defenderarmy: army = {
        if: opp.if,
        art: opp.art,
        tnk: opp.tnk,
        jet: opp.jet,
        moved: false,
        field: opp.field
    }
    if (att.attack.inf > def.defense.inf) {
        str.push("The attackers break through the defense of the Infantry.");
        if (att.attack.inf > def.defense.inf + def.hp.inf) {
            str.push("All of the defending Infantry has been defeated.");
            defenderarmy.if = 0
        }
        else {
            str.push("The Infantry is defeated but survives");
            defenderarmy.if = Math.round(((def.defense.inf + def.hp.inf) - att.attack.inf) / ba.if.hp);
        }
    }
    if (att.attack.art > def.defense.art) {
        str.push("The attackers break through the defense of the Artillery.");
        if (att.attack.art > def.defense.art + def.hp.art) {
            str.push("All of the defending Artillery has been defeated.");
            defenderarmy.art = 0
        }
        else {
            str.push("The Artillery is defeated but survives");
            defenderarmy.art = Math.round(((def.defense.art + def.hp.art) - att.attack.art) / ba.if.hp);
        }
    }
    if (att.attack.tanks > def.defense.tanks) {
        str.push("The attackers break through the defense of the Tanks.");
        if (att.attack.tanks > def.defense.tanks + def.hp.tanks) {
            str.push("All the defending Tanks have been defeated.");
            defenderarmy.tnk = 0
        }
        else {
            str.push("The Tanks are defeated but some survive.");
            defenderarmy.tnk = Math.round(((def.defense.tanks + def.hp.tanks) - att.attack.tanks) / ba.if.hp);
        }
    }
    if (att.attack.jet > def.defense.jet) {
        str.push("The attackers break through the defense of the jets.");
        if (att.attack.jet > def.defense.jet + def.hp.jet) {
            str.push("All the defending jets have been defeated.");
            defenderarmy.jet = 0
        }
        else {
            str.push("The jets are defeated but some survive.");
            defenderarmy.jet = Math.round(((def.defense.jet + def.hp.jet) - att.attack.jet) / ba.if.hp);
        }
    }
    await replaceArmy(war._id, !p1, Number(index), defenderarmy);
    return str;
}