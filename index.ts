import * as Discord from "discord.js";
import * as config from "./config.json";
const DBL = require("dblapi.js");
import { allianceHelpMenu, miscHelpMenu, helpMenu, generalHelpMenu, modHelpMenu } from "./modules/help";
import { createUser, createAlliance } from "./modules/create";
import { addUsers, getUser, start, addAlliance } from "./utils/databasehandler";
import { statsEmbed } from "./modules/stats";

const express = require('express');
const app = express();
app.use(express.static('public'));
var server = require('http').createServer(app);


const client = new Discord.Client();

app.get('/', (request: any, response: { sendFile: (arg0: string) => void; }) => {
    response.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});

if (config.dbl) {
    const dbl = new DBL(config.dbl.token, {
        webhookServer: listener,
        webhookAuth: config.dbl.auth
    }, client);
    dbl.webhook.on('ready', (hook: { hostname: any; port: any; path: any; }) => console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`));
    dbl.webhook.on('vote', (vote: any) => {

    });
}



console.log("My prefix is", config.prefix);

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    client.user.setActivity(`.help | Now with voting streaks!`);

    start();
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`.help | ${client.users.size} users on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`.help | ${client.users.size} users on ${client.guilds.size} servers`);
});

client.on("message", async message => {
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

    var args: string[] = message.content.slice(config.prefix.length).trim().split(/ +/g);
    if (!args || args.length === 0) return;
    const command: string | undefined = args?.shift()?.toLowerCase();

    if (command === "ping") {
        const m = await message.channel.send("Ping?") as Discord.Message;
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    else if (command === "help") {
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
        else {
            message.channel.send({ embed: helpMenu });
        }
    }

    else if (command === "create") {
        let data = createUser(message);
        addUsers([data]);
        message.reply("You succesfully created an acoount");
    }

    else if(command === "createalliance"){
        if(!args[0]) return message.reply("please specify a name for your alliance");
        await addAlliance(createAlliance(args[0], message));
        message.reply("You are now the leader of " + args[0]);
        
    }
});

client.login(config.token);