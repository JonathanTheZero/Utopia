import { PythonShell } from "python-shell";
import { updateField, findWarByUser } from "../../utils/databasehandler";
import { Message, MessageAttachment } from "discord.js";
import { Sleep } from "../../utils/utils";
import { war } from "../../utils/interfaces";

export async function showField(_id: string, message: Message) {
    var imgurl: string = "-1";
    const pyshell = new PythonShell('war.py', { mode: "text" });
    var sendString = JSON.stringify(await updateField(_id));
    pyshell.send(sendString);
    pyshell.on('message', async answer => {
        imgurl = `${answer.toString()}.png`;

        const file = new MessageAttachment(imgurl);

        message.channel.send({ files: [file] });

        await Sleep(5000);

        const del = new PythonShell('deleteImage.py', { mode: "text" });
        del.send(imgurl);
        del.end(err => { if (err) throw err });
    });

    pyshell.end(err => { if (err) throw err });
}

export async function showFieldM(message: Message) {
    const w: war | null = (await findWarByUser(message.author.id));
    if(!w) return message.reply("you don't participate in any active wars.")
    showField(w!._id, message);
}