"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const config = __importStar(require("./config.json"));
const DBL = require("dblapi.js");
const help_1 = require("./modules/help");
const create_1 = require("./modules/create");
const databasehandler_1 = require("./utils/databasehandler");
const stats_1 = require("./modules/stats");
const express = require('express');
const app = express();
app.use(express.static('public'));
var server = require('http').createServer(app);
const client = new Discord.Client();
app.get('/', (request, response) => {
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
    dbl.webhook.on('ready', (hook) => console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`));
    dbl.webhook.on('vote', (vote) => {
    });
}
console.log("My prefix is", config.prefix);
client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`.help | Now with voting streaks!`);
    databasehandler_1.start();
});
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`.help | ${client.users.size} users on ${client.guilds.size} servers`);
});
client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`.help | ${client.users.size} users on ${client.guilds.size} servers`);
});
client.on("message", async (message) => {
    var _a;
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot)
        return;
    var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    if (!args || args.length === 0)
        return;
    const command = (_a = args === null || args === void 0 ? void 0 : args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    else if (command === "help") {
        if (["general", "g"].includes(args[0])) {
            message.channel.send({ embed: help_1.generalHelpMenu });
        }
        else if (["alliance", "alliances", "a"].includes(args[0])) {
            message.channel.send({ embed: help_1.allianceHelpMenu });
        }
        else if (args[0] == "misc") {
            message.channel.send({ embed: help_1.miscHelpMenu });
        }
        else if (args[0] == "mod") {
            message.channel.send({ embed: help_1.modHelpMenu });
        }
        /*else if(["battle", "battles", "b"].includes(args[0])){
          message.channel.send({ embed: battle.battleHelpEmbed });
        }*/
        else {
            message.channel.send({ embed: help_1.helpMenu });
        }
    }
    else if (command === "create") {
        let data = create_1.createUser(message);
        databasehandler_1.addUsers([data]);
        message.reply("You succesfully created an acoount");
    }
    else if (command === "me" || command === "stats") {
        await stats_1.statsEmbed(message, args, client);
    }
    else if (command === "test") {
        databasehandler_1.addMoney(message.author.id, 10000);
    }
});
client.login(config.token);
