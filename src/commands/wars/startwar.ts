import { user, war } from "../../utils/interfaces";
import { Message, Attachment } from "discord.js";
import * as config from "../../static/config.json";
import { addWar, findWarByUser } from "../../utils/databasehandler";
import { PythonShell } from "python-shell";
import { Sleep } from "../../utils/utils";

export async function startWar(message: Message, author: user, opponent: user) {

    if (await findWarByUser(author._id)) return message.reply("you can't participate in more than one war at the same time!");
    if (await findWarByUser(opponent._id)) return message.channel.send(`<@${opponent._id}>, you can't participate in more than one war at the same time!`);

    const newWar: war = {
        _id: message.id,
        p1: {
            _id: author._id,
            tag: author.tag,
            ready: false,
            resources: {
                food: {
                    begin: author.resources.food,
                    consumed: 0
                },
                money: {
                    begin: author.money,
                    consumed: 0
                },
                steel: {
                    begin: author.resources.steel,
                    consumed: 0
                },
                oil: {
                    begin: author.resources.oil,
                    consumed: 0
                },
                population: {
                    begin: author.resources.population,
                    consumed: 0
                }
            },
            armies: []
        },
        p2: {
            _id: opponent._id,
            tag: opponent.tag,
            ready: false,
            resources: {
                food: {
                    begin: opponent.resources.food,
                    consumed: 0
                },
                money: {
                    begin: opponent.money,
                    consumed: 0
                },
                steel: {
                    begin: opponent.resources.steel,
                    consumed: 0
                },
                oil: {
                    begin: opponent.resources.oil,
                    consumed: 0
                },
                population: {
                    begin: opponent.resources.population,
                    consumed: 0
                }
            },
            armies: []
        },
        field: Array(15).fill(Array(15).fill(0))
    };

    message.channel.send({
        embed: {
            color: parseInt(config.properties.embedColor),
            title: "Duel between " + newWar.p1.tag + " (player 1) and " + newWar.p2.tag + " (player 2).",
            description: "Please mobilize your armies now and get ready for the fight!\n\n" +
                "**Important:** Prepare yourself for long lasting wars: Keep an eye on your resources! " +
                "If you run out of food (or other resources) during the war, your troops will perform 50% worse!" 
        }
    });

    await addWar(newWar);

    var imgurl: string = "-1";
    const pyshell = new PythonShell('dist/war.py', { mode: "text" });

    var sendString = JSON.stringify(newWar.field);

    pyshell.send(sendString);

    pyshell.on('message', async answer => {
        imgurl = `imageplotting/${answer.toString()}.png`;

        const file = new Attachment(imgurl);

        message.channel.send("This is your battle field:").then(() => message.channel.send({
            files: [file]
        }));

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