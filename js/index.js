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
const help_1 = require("./commands/help");
const create_1 = require("./commands/create");
const databasehandler_1 = require("./utils/databasehandler");
const stats_1 = require("./commands/stats");
const yeet_1 = require("./commands/moderation/yeet");
const ban_1 = require("./commands/moderation/ban");
const purge_1 = require("./commands/moderation/purge");
require("./utils/utils");
const bet_1 = require("./commands/bet");
const loans_1 = require("./commands/loans");
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
    databasehandler_1.connectToDB();
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
    else if (command === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(null);
        message.channel.send(sayMessage);
    }
    else if (command === "kick" || command === "yeet")
        yeet_1.kick(message, args);
    else if (command === "ban")
        ban_1.ban(message, args);
    else if (command === "purge" || command === "clear")
        purge_1.purge(message, args);
    else if (command === "vote") {
        let u = await databasehandler_1.getUser(message.author.id);
        message.channel.send({
            embed: {
                color: parseInt(config.properties.embedColor),
                title: `Your voting streak: ${u.votingStreak}`,
                description: "As a reward for voting you will get your streak mulitplied with 15000 as money!\n" +
                    "You can increase your voting streak every 12h." +
                    "If you don't vote for more than 24h, you will lose your streak.\n\n" +
                    `Click [here](https://top.gg/bot/619909215997394955/vote) to vote\n` +
                    `You can vote again ${(u.lastVoted === 0 || Date.now() - u.lastVoted * 1000 > 43200000) ? "**now**" : "in" + new Date((43200 - (Math.floor(Date.now() / 1000) - u.lastVoted)) * 1000).toISOString().substr(11, 8)}`
            }
        });
    }
    else if (command === "bet" || command === "coinflip")
        bet_1.bet(message, args);
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
        else {
            message.channel.send({ embed: help_1.helpMenu });
        }
    }
    else if (command === "create") {
        let data = create_1.createUser(message);
        databasehandler_1.addUsers([data]);
        message.reply("You succesfully created an acoount");
    }
    else if (["loancalc", "lc"].includes(command))
        loans_1.loancalc(message, args, await databasehandler_1.getUser(message.author.id));
    else if (command === "me" || command === "stats") {
        message.channel.send({
            embed: await stats_1.statsEmbed(message, args, client)
        });
    }
    else if (command === "createalliance") {
        if (!args[0])
            return message.reply("please specify a name for your alliance");
        await databasehandler_1.addAlliance(create_1.createAlliance(args[0], message));
        message.reply("You are now the leader of " + args[0]);
        //TODO
    }
});
client.login(config.token);
