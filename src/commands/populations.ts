import { Message } from "discord.js";
import { getUser, updateValueForUser} from "../utils/databasehandler";
import { user } from "../utils/interfaces";
import "../utils/utils";
//@ts-ignore  -> no *.d.ts
import randomeName from "node-random-name";
import { getRandomRange } from "../utils/utils";
import * as config from "../static/config.json";

export async function kill(message: Message, args: string[]) {
    if (typeof args[0] === "undefined" || (args[0].isNaN() && args[0] != "a") || parseInt(args[0]) < 0 || ["Infinity", "-Infinity"].includes(args[0]))
        return message.reply("please specify the amount follow the syntax of `.kill <amount>`.");

    let user: user = await getUser(message.author.id);
    if (!user)
        return message.reply("you haven't created an account yet, please use the `.create` command first.");

    const a = (args[0] === "a") ? user.resources.population : parseInt(args[0].replace(/[,]/g, ''));
    if (a > user.resources.population)
        return message.reply("you can't kill more population than you own!");


    if (a <= 100 && a > 0) {
        //let fields = 

        let e = {
            title: "Killed",
            description: "This is who you killed",
            fields: await nameGen(a),
            color:config.properties.embedColor
        }

        message.channel.send({ embed: e })
    }


    updateValueForUser(message.author.id, "population", -1 * a, "$inc");
    return message.reply(`you succesfully killed ${a.commafy()} people.`);
}


async function nameGen(num: number) {
    // {
    //     name: "",
    //     value: ""
    // }

    let fields = []
    let names = await randnames(num)

    for (let i = 0; i < num; i++) {
        let randomGender: "male" | "female" = Math.random() > 0.5 ? "male" : "female";

        let e: string;

        if (randomGender === "male") {
            e = "he"
        }

        else {
            e = "she"
        }
        let yes = true

        // if (i % 3){
        //     yes = false
        // }

        //{ gender: randomGender }

        fields.push({
            name: names[i],
            value: `${e} was ${Math.floor(getRandomRange(10, 100))}`,
            inline: yes,
        })
    }

    return fields;
}

async function randnames(num: number): Promise<Array<string>>{

    let names:string[] = []

    while(names.length < num){
        let n = randomeName()

        if(names.includes(n)){
            n = randomeName()
        }

        else if(!names.includes(n)){
            names.push(n)
        }
    }

    return names;
}