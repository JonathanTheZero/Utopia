declare var require: (path: string) => any;

import * as Discord from "discord.js";

import * as config from "./static/config.json";
import { PythonShell } from "python-shell";
const DBL = require("dblapi.js");
import "./utils/utils";
import { allianceHelpMenu, miscHelpMenu, helpMenu, generalHelpMenu, modHelpMenu, guideEmbed, marketHelp, clsHelp, contractHelp } from "./commands/help";
import { createUser, createAlliance } from "./commands/create";
import {
    addUsers,
    getUser,
    connectToDB,
    addAlliance,
    updateValueForUser,
    deleteUser,
    getAllUsers,
    getConfig,
    getGiveaways,
    addCR,
    getServers,
    updateServer,
    getServer,
    updatePrefix,
    addServer,
    deleteServer,
    connected,
    addToUSB,
    editConfig
} from "./utils/databasehandler";
import { statsEmbed, time } from "./commands/stats";
import { user, configDB, giveaway } from "./utils/interfaces";
import { bet } from "./commands/bet";
import { loancalc, loan, payback } from "./commands/loans";
import { leaderboard } from "./commands/leaderboard";
import { buy } from "./commands/buy";
import { kill } from "./commands/populations";
import { send, deposit } from "./commands/send";
import { work, crime } from "./commands/work";
import { Sleep, delayReminder } from "./utils/utils";
import { storeEmbed } from "./commands/store";
import { startGiveaway, giveawayCheck } from "./commands/giveaways";
import { set, add, ban, purge, kick } from "./commands/moderation";
import {
    joinAlliance,
    leaveAlliance,
    promote,
    demote,
    toggleStatus,
    upgradeAlliance,
    invite,
    fire,
    allianceMembers,
    settax,
    allianceOverview,
    renameAlliance,
} from "./commands/alliances";
import { payoutLoop, populationWorkLoop, payout, alliancePayout, weeklyReset, dailyPayout } from "./commands/payouts";
import { startWar, mobilize, ready, cancelWar, armies, setPosition, showFieldM, move, attack, warGuide, troopStats } from "./commands/wars";
import { mine, digmine, mineStats } from "./commands/mine";
import { makeOffer, activeOffers, buyOffer, myOffers, deleteOffer, offer } from "./commands/trade";
import { propose, viewContract, acceptedContract } from "./commands/trade/contracts"
import { createCLS, clsOverview, sendToCls, deleteCLS, singleStateOverview, setFocus, upgradeCLS, withdraw, renameCls } from "./commands/client-states";

const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
//@ts-ignore
var _server = http.createServer(app);
const client = new Discord.Client();

app.get('/', (_request: any, response: any) => {
    response.sendFile(__dirname + "/index.html");
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});

setInterval(() => http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`), 280000);

if (config.dbl) {
    const dbl = new DBL(config.dbl.token, {
        webhookServer: listener,
        webhookAuth: config.dbl.auth
    }, client);

    dbl.webhook.on('ready', (hook: { hostname: any; port: any; path: any; }) => console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`));

    dbl.webhook.on('vote', async (vote: { user: string }) => {
        let user: user = await getUser(vote.user);
        updateValueForUser(user._id, "votingStreak", 1, (Date.now() / 1000 - user.lastVoted) <= 86400 ? "$inc" : "$set");
        updateValueForUser(user._id, "lastVoted", Math.floor(Date.now() / 1000));
        user = await getUser(vote.user);
        updateValueForUser(user._id, "money", user.votingStreak * 15000, "$inc");
        updateValueForUser(user._id, "income", user.votingStreak * 15000, "$inc");
        addToUSB(-(user.votingStreak * 20000));
    });
}

console.log("Application has started");

client.on("ready", async () => {
    console.log(`Bot has started, with ${client.users.size.commafy()} users, in ${client.channels.size.commafy()} channels of ${client.guilds.size.commafy()} guilds.`);
    client.user.setActivity(`.help | v2.2 Confederations out now!`);
    await connectToDB();
    getServers().then(server => {
        if (server.length < client.guilds.array().length)
            client.guilds.array().forEach(async (el) => {
                updateServer({
                    _id: el.id,
                    name: el.name,
                    prefix: (await getServer(el.id))?.prefix || "."
                }, true);
            });
    });
    let c: configDB = await getConfig();
    const tdiff = [
        Math.floor(Date.now() / 1000) - c.lastPayout,
        Math.floor(Date.now() / 1000) - c.lastPopulationWorkPayout,
        Math.floor((Date.now() - c.lastMineReset) / 1000),
        Math.floor(Date.now() / 1000) - c.lastDailyReset
    ];
    setTimeout(() => payoutLoop(client), ((14400 - tdiff[0]) * 1000));
    setTimeout(() => populationWorkLoop(client), ((39600 - tdiff[1]) * 1000));
    setTimeout(() => weeklyReset(client), ((604800 - tdiff[2]) * 1000));
    setTimeout(() => dailyPayout(client), ((86400 - tdiff[3]) * 1000));
    const giveaways: giveaway[] = await getGiveaways();
    for (const g of giveaways) giveawayCheck(g._id, client);
    const users: user[] = await getAllUsers();
    for (const u of users) {
        if (!u.autoping || !u.lastMessage?.channelID || !u.lastMessage?.messageID || u.lastMessage.alreadyPinged) continue;
        const msg = await (<Discord.TextChannel>client.channels.get(u.lastMessage.channelID)).fetchMessage(u.lastMessage.messageID)!;
        const workTime = (1800 - (Math.floor(Date.now() / 1000) - u.lastWorked)) * 1000,
            crimeTime = (14400 - (Math.floor(Date.now() / 1000) - u.lastCrime)) * 1000,
            mineTime = (3600 - (Math.floor(Date.now() / 1000) - u.lastMine)) * 1000,
            digTime = (14400 - (Math.floor(Date.now() / 1000) - u.lastDig)) * 1000;

        if (workTime > -57600000) delayReminder(msg, workTime, "Reminder: Work again.");
        if (crimeTime > -57600000) delayReminder(msg, crimeTime, "Reminder: Commit a crime.");
        if (mineTime > -57600000) delayReminder(msg, mineTime, "Reminder: Mine again.");
        if (digTime > -57600000) delayReminder(msg, digTime, "Reminder: Dig a mine.");
        updateValueForUser(u._id, "lastMessage", { messageID: u.lastMessage.messageID, channelID: u.lastMessage.channelID, alreadyPinged: true });
    }
});


client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`.help | ${client.users.size} users on ${client.guilds.size} servers`);
    if (connected) addServer({
        _id: guild.id,
        name: guild.name,
        prefix: "."
    });
});

//client.on("debug", console.log);

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild?.name} (id: ${guild?.id})`);
    client.user.setActivity(`.help | ${client.users.size} users on ${client.guilds.size} servers`);
    if (connected) deleteServer(guild?.id);
});


client.on("message", async message => {
    const prefix = (await getServer(message.guild?.id))?.prefix;
    if (!prefix) return;
    if (message.content.indexOf(prefix) !== 0 || message.author.bot) return;

    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g);
    if (!args || args.length === 0) return;
    const command: string | undefined = args?.shift()?.toLowerCase();
    if (!command) return;

    addCR(); //increase commands run count by one

    if (command === "ping") {
        const m: Discord.Message = await message.channel.send("Ping?") as Discord.Message;
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    else if (command === "say") {
        const sayMessage = args.join(" ");
        if (sayMessage.match(/@everyone/) && !config.botAdmins.includes(message.author.id)) return message.reply("no.");
        message.delete().catch(console.log);
        message.channel.send(sayMessage);
    }

    else if (command === "kick" || command === "yeet") kick(message, args);

    else if (command === "ban") ban(message, args);

    else if (command === "purge" || command === "clear") purge(message, args);

    else if (command === "updatemessage" || command === "upmsg") {
        if (!config.botAdmins.includes(message.author.id)) return message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
        editConfig("upmsg", args.join(" "));
        message.reply(`Added update message of ${args.join(" ")}`);
    }

    else if (command === "sendupmsg") {
        if (!config.botAdmins.includes(message.author.id)) return message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
        let c: configDB = await getConfig(), output = c.upmsg, u: user[] = await getAllUsers();
        let channel = <Discord.TextChannel>client.channels.get("630470737664409630"); //Change this to the announcement channel id

        if (["everyone", "e", "Everyone", "E"].includes(args[0])) channel.send(`@everyone ${output}`);

        else if (["help", "h", "Help", "H"].includes(args[0])) message.reply("Please either `.sendupmsg everyone` to ping everyone or `.sendupmsg` to not ping everyone");

        else channel.send(`${output}`);

        const lister: string[] = [];
        client.guilds.get("621044091056029696")?.members.forEach(member => lister.push(member.id)!);

        for (let i = 0; i < u.length; i++)
            if (!lister.includes(u[i]._id)) client.users.get(u[i]._id)!.send(output);
    }

    else if (command === "testmsg"){
        if (!config.botAdmins.includes(message.author.id)) return message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
        let c: configDB = await getConfig();
        const users = await getAllUsers();
        for(const u of users){
            client.users.get(u._id)?.send(c.upmsg).catch(console.log);
        }
    }

    else if (command === "vote") {
        let u: user = await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id);
        message.channel.send({
            embed: {
                color: parseInt(config.properties.embedColor),
                title: `Your voting streak: ${u.votingStreak}`,
                description: "As a reward for voting you will get your streak mulitplied with 15000 as money!\n" +
                    "You can increase your voting streak every 12h." +
                    "If you don't vote for more than 24h, you will lose your streak.\n\n" +
                    `Click [here](https://top.gg/bot/619909215997394955/vote) to vote\n` +
                    `You can vote again ${(u.lastVoted === 0 || Date.now() - u.lastVoted * 1000 > 43200000) ? "**now**" : "in " + new Date((43200 - (Math.floor(Date.now() / 1000) - u.lastVoted)) * 1000).toISOString().substr(11, 8)}`
            }
        });
    }

    else if (command === "bet" || command === "coinflip") bet(message, args);

    else if (command === "help") {
        if (["general", "g"].includes(args[0]))
            return message.channel.send({ embed: generalHelpMenu });
        else if (["alliance", "alliances", "a"].includes(args[0]))
            return message.channel.send({ embed: allianceHelpMenu });
        else if (args[0] == "misc")
            return message.channel.send({ embed: miscHelpMenu });
        else if (args[0] == "mod")
            return message.channel.send({ embed: modHelpMenu });
        else if (["market", "m"].includes(args[0]))
            return message.channel.send({ embed: marketHelp });
        else if (["contracts", "contract", "cts"].includes(args[0]))
            return message.channel.send({embed: contractHelp});
        else if (["clientstate", "clientstates", "c"].includes(args[0]))
            return message.channel.send({ embed: clsHelp });
        return message.channel.send({ embed: helpMenu });
    }

    else if (command === "create" || command === "start") {
        let data = createUser(message);
        if (await getUser(message.author.id)) return message.reply("error, you already have an account!");
        await addUsers([data]);
        message.reply(
            "you succesfully created an account!\n" +
            "You can find info on all commands in the help menu: `.help`.\n" +
            "If you prefer a broader introduction, use `.guide`."
        );
    }

    else if (["loancalc", "lc"].includes(command))
        loancalc(message, args, await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id));

    else if (command === "loan") loan(message, args, await getUser(message.author.id));

    else if (command === "payback") payback(message, args, await getUser(message.author.id));

    else if (command === "me" || command === "stats")
        statsEmbed(message, args, client);

    else if (command === "time" || command === "timestats") time(message, args, client);

    else if (command === "createalliance") {
        if (!args[0]) return message.reply("please specify a name for your alliance");
        let user: user = await getUser(message.author.id);
        if (!user)
            return message.reply("you haven't created an account yet, please use the `create` command.");
        else if (user.alliance != null)
            return message.reply("you can't create your own alliance, because you already joined one. Leave your alliance with `.leavealliance` first.");
        if (user.money < 250000)
            return message.reply("It costs 250,000 money to create an alliance, you don't have so much!");

        await addAlliance(createAlliance(args.join(" "), message));
        updateValueForUser(message.author.id, "alliance", args.join(" "));
        updateValueForUser(message.author.id, "allianceRank", "L");
        updateValueForUser(message.author.id, "money", -250000, "$inc");
        return message.reply("You are now the leader of " + args.join(" "));
    }

    else if (command === "joinalliance" || command === "join") joinAlliance(message, args);

    else if (command === "leavealliance" || command === "leave") leaveAlliance(message, args);

    else if (command === "lb" || command === "leaderboard")
        leaderboard(message, args);

    else if (command === "invitelink")
        return message.reply("Add me to your server using this link: " + config.properties.inviteLink);

    else if (command === "server")
        return message.reply("join the official Utopia server for special giveaways, support, bug reporting and more here: " + config.serverInvite);

    else if (command === "buy")
        buy(message, args);

    else if (command === "payout")
        payout(message, args);

    else if (command === "alliancepayout")
        alliancePayout(message, args);

    else if (command === "kill")
        kill(message, args);

    else if (command === "add")
        add(message, args);

    else if (command === "set")
        set(message, args);

    else if (command === "send")
        send(message, args);

    else if (command === "deposit")
        deposit(message, args);

    else if (command === "delete") {
        const user: user = await getUser(message.author.id);
        if (user.alliance != null) return message.reply("You are still member of an alliance, please leave it before deleting your account");
        deleteUser(message.author.id);
        return message.reply("you have successfully deleted your account!");
    }

    else if (command === "promote") {
        if (!args[0]) return message.reply("please supply a username with `.promote <mention/ID>`.");
        let user: user = await getUser(message.author.id);
        let member: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (member._id == message.author.id) return message.reply("you can't promote yourself!");
        if (user.allianceRank != "L") return message.reply("only the leader can promote members.");
        return message.reply(await promote(user, member));
    }

    else if (command === "demote") {
        if (!args[0]) return message.reply("please supply a username with `.demote <mention/ID>`.");
        let user: user = await getUser(message.author.id);
        let member: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (member._id == message.author.id) return message.reply("you can't demote yourself!");
        if (user.allianceRank != "L") return message.reply("only the leader can demote members.");
        return message.reply(await demote(user, member));
    }

    else if (command === "setprivate") {
        let user: user = await getUser(message.author.id);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (!user.allianceRank) return message.reply("you haven't joined an alliance yet.");
        if (user.allianceRank != "M") return message.reply(await toggleStatus(user, false));
        return message.reply("Only the Leader and the Co-Leaders can set the alliance status");
    }

    else if (command === "setpublic") {
        let user: user = await getUser(message.author.id);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (!user.allianceRank) return message.reply("you haven't joined an alliance yet.");
        if (user.allianceRank != "M") return message.reply(await toggleStatus(user, true));
        return message.reply("Only the Leader and the Co-Leaders can set the alliance status");
    }

    else if (command === "upgradealliance" || command === "upalliance") {
        let user: user = await getUser(message.author.id);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (user.allianceRank != "M")
            return message.reply(await upgradeAlliance(user.alliance!));
        return message.reply("Only the Leader and the Co-Leaders can upgrade the alliance status");
    }

    else if (command === "invite") {
        if (!args[0]) return message.reply("please supply a username with `.invite <mention/ID>`. If you are looking on how to invite me to your server, use `.invitelink`");
        let user: user = await getUser(message.author.id);
        let member: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (!member) return message.reply("this user hasn't created an account yet.");
        if (user._id === member._id) return message.reply("you can't invite yourself!");
        if (user.allianceRank != "M") return message.reply(await invite(user.alliance as string, member));
        return message.reply("only the leader and the co-leaders can send out invites.");
    }

    else if (command === "fire") {
        let user: user = await getUser(message.author.id);
        let member: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (!member) return message.reply("this user hasn't created an account yet.");
        if (!args[0]) return message.reply("please supply a username with `.fire <mention/ID>`.");
        if (user.allianceRank != "L") return message.reply("only the leader can fire members.");
        return message.reply(await fire(user.alliance as string, user, member));
    }

    else if (command === "renamealliance" || command === "rename") {
        let user = await getUser(message.author.id);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (user.allianceRank == "M") return message.reply("only Co-Leaders and the Leader can use this command!");
        else if (user.alliance == null) return message.reply("you haven't joined an alliance yet!");
        return renameAlliance(message, args);
    }

    else if (command === "alliance")
        return allianceOverview(message, args, client);

    else if (command === "alliancemembers")
        return allianceMembers(message, args, client);

    else if (command === "guide")
        return message.channel.send({
            embed: guideEmbed
        });

    else if (command === "warguide")
        return message.channel.send({
            embed: warGuide
        });

    else if (command === "troopstats")
        return message.channel.send({
            embed: troopStats
        });

    else if (command === "shop" || command === "store") {
        if (args[0] == "population" || args[0] == "p") return message.channel.send({ embed: await storeEmbed!(message, "p") });
        else if (["alliance", "alliances", "a"].includes(args[0])) return message.channel.send({ embed: await storeEmbed!(message, "a") });
        else if (["pf", "personal"].includes(args[0])) return message.channel.send({ embed: await storeEmbed!(message, "pf") });
        else if (args[0]?.[0] === "c") return message.channel.send({ embed: await storeEmbed(message, "c") });

        return message.channel.send({ embed: await storeEmbed!(message, "s") });
    }

    else if (["patreon", "donate", "paypal"].includes(command)) {
        //message.reply("support the bot on Patreon here: https://www.patreon.com/utopiabot\nOr support on PayPal: https://paypal.me/JonathanTheZero");
        return message.channel.send({
            embed: {
                color: 0x2ADF30,
                title: "Support the bot",
                thumbnail: {
                    url: message.author.avatarURL,
                },
                /*description: "Either on [Patreon](https://www.patreon.com/utopiabot) or on [PayPal](https://paypal.me/JonathanTheZero)\n\n" +
                    "100% of the income will used to keep the bot running and pay other fees. (Also note that there are no special patreon ranks)",*/
                description: "PayPal and Patreon are inactive at the moment but will come back later",
                footer: config.properties.footer,
                timestamp: new Date()
            }
        });
    }

    else if (command === "autoping") {
        let user: user = await getUser(message.author.id);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        message.reply(user.autoping ? "you successfully disabled autopings." : "you succesfully enabled autopings.");
        updateValueForUser(user._id, "autoping", !user.autoping);
    }

    else if (command === "payoutdms") {
        let user: user = await getUser(message.author.id);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        message.reply(user.payoutDMs ? "you successfully disabled payout DMs." : "you succesfully enabled payout DMS.");
        updateValueForUser(user._id, "payoutDMs", !user.payoutDMs);
    }

    else if (command === "taxdms") {
        let user: user = await getUser(message.author.id);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        message.reply(user.taxDMs ? "you successfully disabled tax DMs." : "you succesfully enabled tax payout DMS.");
        updateValueForUser(user._id, "taxDMs", !user.taxDMs);
    }

    else if (command === "work")
        work(message, client);

    else if (command === "crime")
        crime(message);

    else if (command === "statistics") {
        const conf: configDB = await getConfig();
        return message.channel.send({
            embed: {
                title: "Utopia statistics",
                color: parseInt(config.properties.embedColor),
                fields: [
                    {
                        name: "Servers:",
                        value: `Currently I am active on ${client.guilds.size.commafy()} servers`
                    },
                    {
                        name: "Users:",
                        value: `Currently I have ${client.users.size.commafy()} users.`
                    },
                    {
                        name: "Commands run:",
                        value: `I already executed ${conf.commandsRun.commafy()} commands.`
                    },
                    {
                        name: "Registered accounts:",
                        value: `${(await getAllUsers()).length} users already created an account!`
                    }
                ],
                footer: config.properties.footer,
                timestamp: new Date()
            }
        });
    }

    else if (command === "utopia") {
        var imgurl: string = "-1";
        const pyshell = new PythonShell('dist/plotImage.py', { mode: "text" });
        const user = await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id);
        if (!user)
            return message.reply(args[0] ? "this user hasn't created an account yet." : "You haven't created an account yet, please use `.create` first.");

        var sendString: string = (user.upgrades.pf.nf + user.upgrades.pf.sf + user.upgrades.pf.sef + user.upgrades.pf.if) + "#" +
            user.upgrades.population.length + "#" +
            user.resources.population + "#" +
            client.users.get(user._id)?.username;

        pyshell.send(sendString);

        pyshell.on('message', async answer => {
            imgurl = `imageplotting/${answer.toString()}.png`;

            message.channel.send({ files: [new Discord.Attachment(imgurl)] });

            await Sleep(5000);
            new PythonShell('dist/deleteImage.py', { mode: "text" })
                .send(imgurl)
                .end(err => { if (err) throw err });
        });

        pyshell.end(err => { if (err) throw err });
    }

    else if (command === "settax")
        settax(message, args);

    //.start-giveaway <amount> <currency> <winners> <ending>
    else if (command === "start-giveaway")
        startGiveaway(message, args, client);

    else if (["set-prefix", "setprefix", "prefix"].includes(command)) {
        if (!message.member.hasPermission(["ADMINISTRATOR", "MANAGE_GUILD"], false, true, true))
            return message.reply("you need manage server permissions to change the prefix!");
        if (!args[0]) return message.reply("please follow the syntax of `.set-prefix <new prefix>`");
        updatePrefix(message.guild.id, args[0]).then(() => message.reply("the prefix has been updated successfully"));
    }

    else if (command === "start-war" || command === "startwar") {
        if (!args[0]) return message.reply("please follow the syntax of `.start-war <mention/ID>`");
        const u: user = await getUser(message.author.id);
        const o: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!u) return message.reply("you haven't created an account yet, please use `.create` to create one.");
        if (!o) return message.reply("this user hasn't created an account yet.");
        if(o._id === u._id) return message.reply("you can't start a war against yourself.");
        startWar(message, u, o);
    }

    else if (command === "mobilize") mobilize(message, args);

    else if (command === "ready") ready(message);

    else if (command === "cancel-war" || command === "cancelwar") cancelWar(message);

    else if (command === "armies") armies(message);

    else if (command === "set-position" || command === "setposition") setPosition(message, args);

    else if (["showfield", "field"].includes(command)) showFieldM(message);

    else if (command === "move") move(message, args);

    else if (command === "attack") attack(message, args);

    else if (command === "mine") mine(message, args);

    else if (command === "digmine" || command === "detroitbecomedwarf")
        digmine(message);

    else if (command === "minestats")
        mineStats(message, args);

    else if (["make-offer", "makeoffer"].includes(command))
        makeOffer(message, args);

    else if (command === "offer") offer(message, args);

    else if (command === "propose")
        propose(message, args, client)

    else if (command === "viewcontract" || command === "view-contract")
        viewContract(message, args, client)

    else if (command === "accept") 
        acceptedContract(message, args, client);

    else if (command === "market")
        activeOffers(message, args);

    else if (command === "buy-offer" || command === "buyoffer")
        buyOffer(message, args, client);

    else if (["my-offers", "myoffers"].includes(command))
        myOffers(message, args);

    else if (["cancel-offer", "canceloffer", "deleteoffer", "delete-offer"].includes(command))
        deleteOffer(message, args);

    else if (command === "usb" || command === "central-bank")
        return message.channel.send({
            embed: {
                title: "Utopian Super Bank",
                description: "At the moment, the bank still holds " + (await getConfig()).centralBalance.commafy()
            }
        });

    else if (command === "taxes" || command === "income") {
        const u = await getUser(message.mentions?.users?.first()?.id || args[0] || message.author.id);
        return message.channel.send({
            embed: {
                title: "Tax classes for " + u.tag,
                color: parseInt(config.properties.embedColor),
                description: "Weekly income: " + u.income.commafy(),
                fields: [
                    {
                        name: "Class 1" + (u.income < 100000 ? " (Your class)" : ""),
                        value: "Income smaller than 100,000, 2% tax",
                    },
                    {
                        name: "Class 2" + (u.income > 100000 && u.income < 1000000 ? " (Your class)" : ""),
                        value: "Income smaller than 1,000,000, 5% tax",
                    },
                    {
                        name: "Class 3" + (u.income < 10000000 && u.income > 1000000 ? " (Your class)" : ""),
                        value: "Income smaller than 10,000,000, 10% tax",
                    },
                    {
                        name: "Class 4" + (u.income > 10000000 && u.income < 100000000 ? " (Your class)" : ""),
                        value: "Income smaller than 100,000,000, 20% tax",
                    },
                    {
                        name: "Class 5" + (u.income < 500000000 && u.income > 100000000 ? " (Your class)" : ""),
                        value: "Income smaller than 500,000,000, 35% tax",
                    },
                    {
                        name: "Class 6" + (u.income > 500000000 && u.income < 1000000000 ? " (Your class)" : ""),
                        value: "Income smaller than 1,000,000,000, 50% tax",
                    },
                    {
                        name: "Class 7" + (u.income > 1000000000 ? " (Your class)" : ""),
                        value: "Bigger than 1,000,000,000, 60% tax"
                    },
                ],
                timestamp: new Date(),
                footer: config.properties.footer,
            },
        });
    }

    else if (["create-cls", "createcls"].includes(command)) createCLS(message, args);

    else if (command === "cls-overview" || command === "clientstates" || command === "client-states") clsOverview(message, args);

    else if (command === "send-to-cls") sendToCls(message, args);

    else if (command === "delete-cls" || command === "deletecls") deleteCLS(message, args);

    else if (command === "clientstate" || command === "client-state") singleStateOverview(message, args);

    else if (["setfocus", "set-focus"].includes(command)) setFocus(message, args);

    else if (["buycls", "buy-cls", "cls-upgrade"].includes(command)) upgradeCLS(message, args);

    else if(["rename-cls", "renamecls"].includes(command)) renameCls(message, args);

    else if (command === "withdraw") withdraw(message, args);
});

client.login(config.token);