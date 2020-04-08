import * as Discord from "discord.js";
import { token, prefix } from "./config.json";
import { Sleep } from "./utils/utils";
import { allianceHelpMenu, miscHelpMenu, helpMenu, generalHelpMenu, modHelpMenu } from "./modules/help";
import { test } from "./utils/databasehandler";
import { testUser } from "./utils/interfaces";


const client = new Discord.Client();


console.log("My prefix is", prefix);


client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    client.user.setActivity(`.help | Now with voting streaks!`);
});


client.on("message", async message => {
    if (message.content.indexOf(prefix) !== 0 || message.author.bot) return;

    var args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
    if (!args || args.length === 0) return;
    const command: string | undefined = args?.shift()?.toLowerCase();


    if (command === "help") {
        if (["general", "g"].includes(args[0])) {
            message.channel.send({ embed: generalHelpMenu });
        }
        else if (["alliance", "alliances", "a"].includes(args[0])) {
            message.channel.send({ embed: allianceHelpMenu });
        }
        else if (args[0] == "misc") {
            message.channel.send({ embed: miscHelpMenu });
        }
        else if (args[0] == "mod") {
            message.channel.send({ embed: modHelpMenu });
        }
        /*else if(["battle", "battles", "b"].includes(args[0])){
          message.channel.send({ embed: battle.battleHelpEmbed });
        }*/
        else {
            message.channel.send({ embed: helpMenu });
        }
    }

    else if (command === "create") {
        let obj: testUser = {
            _id: message.author.id,
            tag: message.author.tag
        };
        await test(obj);
        message.channel.send("Created account for " + JSON.stringify(obj));
    }
});

client.login(token);

async function reminder(message: Discord.Message, duration: number, preText: string, postText: string): Promise<void> {
    message.channel.send(preText);
    await Sleep(duration);
    message.reply(postText);
}