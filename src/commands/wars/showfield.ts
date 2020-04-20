import { PythonShell } from "python-shell";
import { updateField, findWarByUser } from "../../utils/databasehandler";
import { Attachment, Message } from "discord.js";
import { Sleep } from "../../utils/utils";
import { war } from "../../utils/interfaces";

export async function showField(_id: string, message: Message) {
    var imgurl: string = "-1";
    const pyshell = new PythonShell('dist/war.py', { mode: "text" });
    var sendString = JSON.stringify(await updateField(_id));
    pyshell.send(sendString);
    pyshell.on('message', async answer => {
        imgurl = `imageplotting/${answer.toString()}.png`;

        const file = new Attachment(imgurl);

        message.channel.send({ files: [file] });

        await Sleep(5000);

        const del = new PythonShell('dist/deleteImage.py', { mode: "text" });
        del.send(imgurl);
        del.end((err, code, signal) => { if (err) throw err });
    });

    pyshell.end((err, code, signal) => { if (err) throw err });
}

export async function showFieldM(message: Message) {
    const w: war | null = (await findWarByUser(message.author.id));
    if(!w) return message.reply("you don't participate in any active wars.")
    showField(w!._id, message);
}