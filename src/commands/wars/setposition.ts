import { Message, Attachment } from "discord.js";
import { user, war } from "../../utils/interfaces";
import { getUser, findWarByUser, moveArmy, getWar, updateField } from "../../utils/databasehandler";
import { PythonShell } from "python-shell";
import { Sleep } from "../../utils/utils";
import { showField } from "./showfield";

export async function setPosition(message: Message, args: string[]) {
    if (!args[2]) return message.reply("please follow the syntax of `.setposition <armyindex> <x> <y>`");
    if (parseInt(args[0]) > 3) return message.reply("you have only 3 armies, please follow the syntax of `.setposition <armyindex> <x> <y>`");
    const u: user = await getUser(message.author.id);

    let w: war | null = await findWarByUser(u._id);
    if (!w) return message.reply("you are not fighting in any active battles.");
    if (!(w.p1.ready && w.p2.ready)) return message.reply("not everyone is ready yet!");

    const p1 = u._id === w.p1._id;
    const a = p1 ? w.p1 : w.p2;
    const curr = a.armies[parseInt(args[0]) - 1].field;
    let x = parseInt(args[1]) - 1,
        y = parseInt(args[2]) - 1; //actually those are swapped but this is due to the base image and me being lazy

    if(w.field[x][y]) return message.reply("this field is already used!");

    if (x > 15 || x < 0 || y > 15 || y < 0) return message.reply("you can't position your army outside of the field!");

    if (curr)
        return message.reply("you already deployed this army!");
    else {
        if (p1) {
            if (x > 7) return message.reply("you can only deploy your armies on your half of the field")
        }
        else {
            if (x < 8) return message.reply("you can only deploy your armies on your half of the field");
        }
        await moveArmy(w._id, p1, parseInt(args[0]) - 1, [x, y]);
    }

    showField(w._id, message);
}