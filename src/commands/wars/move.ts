import { Message } from "discord.js";
import { user, war } from "../../utils/interfaces";
import { getUser, findWarByUser, moveArmy, updateValueForUser, deleteWar, getWar } from "../../utils/databasehandler";
import { showField } from "./showfield";

export async function move(message: Message, args: string[]) {
    if (!args[2]) return message.reply("please follow the syntax of `.move <armyindex> <x> <y>`");
    if (parseInt(args[0]) > 3) return message.reply("you have only 3 armies, please follow the syntax of `.move <armyindex> <x> <y>`");
    const u: user = await getUser(message.author.id);

    let w: war | null = await findWarByUser(u._id);
    if (!w) return message.reply("you are not fighting in any active battles.");
    //if (!(w.p1.ready && w.p2.ready)) return message.reply("not everyone is ready yet!");

    const p1 = u._id === w.p1._id;
    const [a, b] = p1 ? [w.p1, w.p2] : [w.p2, w.p1];
    const curr = a.armies[parseInt(args[0]) - 1];
    let x = parseInt(args[1]) - 1,
        y = parseInt(args[2]) - 1;

    if(x > 14 || x < 0 || y > 14 || y < 0) return message.reply("you can't position your army outside of the field!");
    if(curr.moved) return message.reply("you already moved that army this round!");

    if (!curr.field)
        return message.reply("you haven't deployed that army yet!");
    else {
        if(Math.abs(curr.field![0] - x) > 2 || Math.abs(curr.field![1] - y) > 2) return message.reply("you can't move your army that far!");
        if(p1 && x === 13 && y === 7){
            await endWar(true, w._id);
            return message.channel.send(`<@${a._id}> won!`);
        }
        if(!p1 && x === 1 && y === 7){
            await endWar(false, w._id);
            return message.channel.send(`<@${b._id}> won!`);
        }
        await moveArmy(w._id, p1, parseInt(args[0]) - 1, [x, y]);
    }

    showField(w._id, message);
}

async function endWar(p1Won: boolean, _id: string){
    const w: war = await getWar(_id);
    await Promise.all([
        updateValueForUser(w.p1._id, "food", -w.p1.resources.food.consumed, "$inc"),
        updateValueForUser(w.p1._id, "money", -w.p1.resources.money.consumed, "$inc"),
        updateValueForUser(w.p1._id, "steel", -w.p1.resources.steel.consumed, "$inc"),
        updateValueForUser(w.p1._id, "oil", -w.p1.resources.oil.consumed, "$inc"),
        updateValueForUser(w.p1._id, "food", -w.p1.resources.food.consumed, "$inc"),
    
        updateValueForUser(w.p2._id, "food", -w.p2.resources.food.consumed, "$inc"),
        updateValueForUser(w.p2._id, "money", -w.p2.resources.money.consumed, "$inc"),
        updateValueForUser(w.p2._id, "steel", -w.p2.resources.steel.consumed, "$inc"),
        updateValueForUser(w.p2._id, "oil", -w.p2.resources.oil.consumed, "$inc"),
        updateValueForUser(w.p2._id, "food", -w.p2.resources.food.consumed, "$inc"),
    ]);
    const [winnerId, loserId] = p1Won ? [w.p1._id, w.p2._id] : [w.p2._id, w.p1._id];
    const loser = await getUser(loserId);
    const random = Math.random() * 0.25;

    updateValueForUser(winnerId, "food", Math.floor(loser.resources.food * 0.05 * random), "$inc");
    updateValueForUser(winnerId, "money", Math.floor(loser.money * 0.05 * random), "$inc");
    updateValueForUser(winnerId, "population", Math.floor(loser.resources.population * 0.05 * random), "$inc");
    updateValueForUser(winnerId, "oil", Math.floor(loser.resources.oil * 0.05 * random), "$inc");
    updateValueForUser(winnerId, "steel", Math.floor(loser.resources.steel * 0.05 * random), "$inc");

    await deleteWar(_id);
}