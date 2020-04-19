import { Message } from "discord.js";
import { user, war } from "../../utils/interfaces";
import { getUser, findWarByUser, moveArmy } from "../../utils/databasehandler";
import { showField } from "./showfield";

export async function move(message: Message, args: string[]) {
    if (!args[2]) return message.reply("please follow the syntax of `.move <armyindex> <x> <y>`");
    if (parseInt(args[0]) > 3) return message.reply("you have only 3 armies, please follow the syntax of `.move <armyindex> <x> <y>`");
    const u: user = await getUser(message.author.id);

    let w: war | null = await findWarByUser(u._id);
    if (!w) return message.reply("you are not fighting in any active battles.");
    //if (!(w.p1.ready && w.p2.ready)) return message.reply("not everyone is ready yet!");

    const p1 = u._id === w.p1._id;
    const a = p1 ? w.p1 : w.p2;
    const curr = a.armies[parseInt(args[0]) - 1];
    let x = parseInt(args[1]) - 1,
        y = parseInt(args[2]) - 1;

    if(x > 15 || x < 0 || y > 15 || y < 0) return message.reply("you can't position your army outside of the field!");
    if(curr.moved) return message.reply("you already moved that army this round!");

    if (!curr.field)
        return message.reply("you haven't deployed that army yet!");
    else {
        if(Math.abs(curr.field![0] - x) > 2 || Math.abs(curr.field![1] - y) > 2) return message.reply("you can't move your army that far!");
        await moveArmy(w._id, p1, parseInt(args[0]) - 1, [x, y]);
    }

    showField(w._id, message);
}