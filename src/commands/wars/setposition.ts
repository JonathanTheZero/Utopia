import { Message, Attachment } from "discord.js";
import { user, war } from "../../utils/interfaces";
import { getUser, findWarByUser, moveArmy, getWar, updateField } from "../../utils/databasehandler";
import { PythonShell } from "python-shell";
import { Sleep } from "../../utils/utils";

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
        y = parseInt(args[2]) - 1;

    if (curr) {
        if (curr[0] - x > 2 || curr[1] - y > 2) return message.reply("you can't move your armies so far!")
        await moveArmy(w._id, p1, parseInt(args[0]) - 1, [x, y]);
    }
    else {
        if (p1) {
            if (x > 8) return message.reply("you can only deploy your armies on your half of the field")
        }
        else {
            if (x < 7) return message.reply("you can only deploy your armies on your half of the field");
        }
        await moveArmy(w._id, p1, parseInt(args[0]) - 1, [x, y]);
    }

    await Sleep(2000);

    w = await getWar(w._id);

    var imgurl: string = "-1";
    const pyshell = new PythonShell('dist/war.py', { mode: "text" });

    var sendString = JSON.stringify(await updateField(w._id));

    pyshell.send(sendString);

    pyshell.on('message', async answer => {
        console.log(answer);
        imgurl = `imageplotting/${answer.toString()}.png`;

        const file = new Attachment(imgurl);

        message.channel.send({
            files: [file]
        });


        await Sleep(5000);

        const del = new PythonShell('dist/deleteImage.py', { mode: "text" });
        del.send(imgurl);
        del.end((err, code, signal) => {
            if (err) throw err;
        });
    });

    pyshell.end((err, code, signal) => {
        if (err) throw err;
    });
}