declare var require: (path: string) => any;

import * as Discord from "discord.js";
import * as config from "./static/config.json";
import { PythonShell } from "python-shell";
const DBL = require("dblapi.js");
import "./utils/utils";
import { allianceHelpMenu, miscHelpMenu, helpMenu, generalHelpMenu, modHelpMenu, guideEmbed } from "./commands/help";
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
    connected
} from "./utils/databasehandler";
import { statsEmbed } from "./commands/stats";
import { user, configDB, giveaway } from "./utils/interfaces";
import { bet } from "./commands/bet";
import { loancalc, loan, payback } from "./commands/loans";
import { leaderboard } from "./commands/leaderboard";
import { buy } from "./commands/buy";
import { kill } from "./commands/populations";
import { send, deposit } from "./commands/send";
import { work, crime } from "./commands/work";
import { Sleep } from "./utils/utils";
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
import { payoutLoop, populationWorkLoop, payout, alliancePayout, mineReset } from "./commands/payouts";
import { startWar, mobilize, ready, cancelWar, armies, setPosition, showFieldM, move, attack, warGuide, troopStats } from "./commands/wars";
import { mine, digmine } from "./commands/mine";

const express = require('express');
const app = express();
app.use(express.static('public'));
var server = require('http').createServer(app);

const client = new Discord.Client();

app.get('/', (request: any, response: any) => {
    response.sendFile(__dirname + "/index.html")
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

    dbl.webhook.on('vote', async (vote: { user: string }) => {
        let user: user = await getUser(vote.user);
        updateValueForUser(user._id, "votingStreak", 1, (Date.now() / 1000 - user.lastVoted) <= 86400 ? "$inc" : "$set");
        updateValueForUser(user._id, "lastVoted", Math.floor(Date.now() / 1000));
        user = await getUser(vote.user);
        updateValueForUser(user._id, "money", user.votingStreak * 15000, "$inc");
    });
}


console.log("Application has started");

client.on("ready", async () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`.help | v2 Blood and Steel out now!`);

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
    const [tdiff1, tdiff2, tdiff3] = [
        Math.floor(Date.now() / 1000) - c.lastPayout, 
        Math.floor(Date.now() / 1000) - c.lastPopulationWorkPayout,
        Math.floor((Date.now() - c.lastMineReset) / 1000)
    ];
    setTimeout(() => payoutLoop(client), ((14400 - tdiff1) * 1000));
    setTimeout(() => populationWorkLoop(client), ((39600 - tdiff2) * 1000));
    setTimeout(() => mineReset(client), ((604800 - tdiff3) * 1000))
    const giveaways: giveaway[] = await getGiveaways();
    for (const g of giveaways) {
        giveawayCheck(g._id, client);
    }
});


client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`.help | ${client.users.size} users on ${client.guilds.size} servers`);

    if (connected)
        addServer({
            _id: guild.id,
            name: guild.name,
            prefix: "."
        });
});


client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`.help | ${client.users.size} users on ${client.guilds.size} servers`);

    if (connected) deleteServer(guild.id);
});


client.on("message", async message => {
    const prefix = (await getServer(message.guild.id)).prefix;
    if (message.content.indexOf(prefix) !== 0 || message.author.bot) return;

    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g);
    if (!args || args.length === 0) return;
    const command: string | undefined = args?.shift()?.toLowerCase();

    addCR(); //increase commands run count by one

    if (command === "ping") {
        const m = await message.channel.send("Ping?") as Discord.Message;
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    else if (command === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(null);
        message.channel.send(sayMessage);
    }

    else if (command === "kick" || command === "yeet") kick(message, args);

    else if (command === "ban") ban(message, args);

    else if (command === "purge" || command === "clear") purge(message, args);

    else if (command === "vote") {
        let u: user = await getUser(message.author.id);
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
        if (await getUser(message.author.id)) return message.reply("error, you already have an account!");
        addUsers([data]);
        message.reply("You succesfully created an acoount");
    }

    else if (["loancalc", "lc"].includes(command as string))
        loancalc(message, args, await getUser(message.author.id));

    else if (command === "loan") loan(message, args, await getUser(message.author.id));

    else if (command === "payback") payback(message, args, await getUser(message.author.id));

    else if (command === "me" || command === "stats") {
        statsEmbed(message, args, client);
    }

    else if (command === "createalliance") {
        if (!args[0]) return message.reply("please specify a name for your alliance");
        let user: user = await getUser(message.author.id);
        if (!user)
            return message.reply("you haven't created an account yet, please use the `create` command.");
        else if (user.alliance != null)
            return message.reply("you can't create your own alliance, because you already joined one. Leave your alliance with `.leavealliance` first.");

        await addAlliance(createAlliance(args.join(" "), message));
        updateValueForUser(message.author.id, "alliance", args.join(" "));
        updateValueForUser(message.author.id, "allianceRank", "L");
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
        let user: user = await getUser(message.author.id);
        let member: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (typeof args[0] === 'undefined') return message.reply("please supply a username with `.promote <mention/ID>`.");
        if (member._id == message.author.id) return message.reply("you can't promote yourself!");
        if (user.allianceRank != "L") return message.reply("only the leader can promote members.");
        return message.reply(await promote(user, member));
    }

    else if (command === "demote") {
        let user: user = await getUser(message.author.id);
        let member: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (member._id == message.author.id) return message.reply("you can't demote yourself!");
        if (typeof args[0] === 'undefined') return message.reply("please supply a username with `.demote <mention/ID>`.");
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
            return message.reply(await upgradeAlliance(user.alliance as string));
        return message.reply("Only the Leader and the Co-Leaders can upgrade the alliance status");
    }

    else if (command === "invite") {
        let user: user = await getUser(message.author.id);
        let member: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (typeof args[0] === 'undefined')
            return message.reply("please supply a username with `.invite <mention/ID>`. If you are looking on how to invite me to your server, use `.invitelink`");
        if (user._id === member._id) return message.reply("you can't invite yourself!");
        if (user.allianceRank != "M") return message.reply(await invite(user.alliance as string, member));
        return message.reply("only the leader and the co-leaders can send out invites.");
    }

    else if (command === "fire") {
        let user: user = await getUser(message.author.id);
        let member: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!user) return message.reply("you haven't created an account yet, please use the `create` command.");
        if (typeof args[0] === 'undefined') return message.reply("please supply a username with `.invite <mention/ID>`.");
        if (user.allianceRank != "L") return message.reply("only the leader can fire members.");
        return message.reply(await fire(user.alliance as string, user, member));
    }

    else if (command === "renamealliance" || command === "rename") {
        let user = await getUser(message.author.id);
        if (!user)
            return message.reply("you haven't created an account yet, please use the `create` command.");
        else if (user.allianceRank == "M") {
            return message.reply("only Co-Leaders and the Leader can use this command!");
        }
        else if (user.alliance == null) {
            return message.reply("you haven't joined an alliance yet!");
        }
        return renameAlliance(message, args);
    }

    else if (command === "alliance")
        allianceOverview(message, args, client);

    else if (command === "alliancemembers")
        allianceMembers(message, args, client);

    else if (command === "guide") {
        message.channel.send({
            embed: guideEmbed
        });
    }
    
    else if(command === "warguide")
        message.channel.send({
            embed: warGuide
        });
    
    else if(command === "troopstats")
        message.channel.send({
            embed: troopStats
        });

    else if (command === "shop" || command === "store") {
        var store: any;
        if (args[0] == "population" || args[0] == "p") {
            store = await storeEmbed!(message, "p", args);
        }
        else if (["alliance", "alliances", "a"].includes(args[0])) {
            store = await storeEmbed!(message, "a", args);
        }
        else if (["battle", "battles", "b"].includes(args[0])) {
            store = await storeEmbed!(message, "b", args)
        }
        else if (["pf", "personal"].includes(args[0])) {
            store = await storeEmbed!(message, "pf", args);
        }
        else {
            store = await storeEmbed!(message, "s", args);
        }
        if (store) message.channel.send({ embed: store });
    }

    else if (["patreon", "donate", "paypal"].includes(command as string)) {
        //message.reply("support the bot on Patreon here: https://www.patreon.com/utopiabot\nOr support on PayPal: https://paypal.me/JonathanTheZero");
        return message.channel.send({
            embed: {
                color: 0x2ADF30,
                title: "Support the bot",
                thumbnail: {
                    url: message.author.avatarURL,
                },
                description: "Either on [Patreon](https://www.patreon.com/utopiabot) or on [PayPal](https://paypal.me/JonathanTheZero)\n\n" +
                    "100% of the income will used to keep the bot running and pay other fees. (Also note that there are no special patreon ranks)",
                footer: config.properties.footer,
                timestamp: new Date()
            }
        });
    }

    else if (command === "autoping") {
        let user: user = await getUser(message.author.id);
        if (!user)
            return message.reply("you haven't created an account yet, please use the `create` command.");
        message.reply((user.autoping) ? "you successfully disabled autopings." : "you succesfully enabled autopings.");
        updateValueForUser(user._id, "autoping", !user.autoping);
    }

    else if (command === "payoutdms") {
        let user: user = await getUser(message.author.id);
        if (!user)
            return message.reply("you haven't created an account yet, please use the `create` command.");
        message.reply(user.payoutDMs ? "you successfully disabled payout DMs." : "you succesfully enabled payout DMS.");
        updateValueForUser(user._id, "payoutDMs", !user.payoutDMs);
    }

    else if (command === "work")
        work(message, client);

    else if (command === "crime")
        crime(message, client);

    else if (command === "statistics") {
        const conf: configDB = await getConfig();
        message.channel.send({
            embed: {
                title: "Utopia statistics",
                color: parseInt(config.properties.embedColor),
                fields: [
                    {
                        name: "Servers:",
                        value: `Currently I am active on ${client.guilds.size} servers`
                    },
                    {
                        name: "Users:",
                        value: `Currently I have ${client.users.size} users.`
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

        let user: user = await getUser(message.author.id);
        if (typeof args[0] !== "undefined")
            user = await getUser(message.mentions?.users?.first()?.id || args[0]);

        var sendString = (user.upgrades.pf.nf + user.upgrades.pf.sf + user.upgrades.pf.sef + user.upgrades.pf.if) + "#" +
            user.upgrades.population.length + "#" +
            user.resources.population + "#" +
            client.users.get(user._id)?.username;

        console.log(sendString);
        pyshell.send(sendString);

        pyshell.on('message', async answer => {
            console.log(answer);
            imgurl = `imageplotting/${answer.toString()}.png`;

            const file = new Discord.Attachment(imgurl);

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

    else if (command === "settax")
        settax(message, args);

    //.start-giveaway <amount> <currency> <winners> <ending>
    else if (command === "start-giveaway")
        startGiveaway(message, args, client);

    else if (command === "set-prefix") {
        if (!message.member.hasPermission(["ADMINISTRATOR"], false, true, true)) return message.reply("only server admins can change the prefix!");
        if (!args[0]) return message.reply("please follow the syntax of `.set-prefix <new prefix>`");
        updatePrefix(message.guild.id, args[0]).then(() => message.reply("the prefix has been updated successfully"));
    }

    else if (command === "start-war" || command === "startwar") {
        if (!args[0]) return message.reply("please follow the syntax of `.start-war <mention/ID>`");
        const u: user = await getUser(message.author.id);
        const o: user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        if (!u) return message.reply("you haven't created an account yet, please use `.create` to create one.");
        if (!o) return message.reply("this user hasn't created an account yet.");
        startWar(message, u, o);
    }

    else if (command === "mobilize")
        mobilize(message, args);

    else if (command === "ready")
        ready(message);

    else if (command === "cancel-war" || command === "cancelwar")
        cancelWar(message);

    else if (command === "armies")
        armies(message);

    else if (command === "set-position" || command === "setposition")
        setPosition(message, args);

    else if(["showfield", "field"].includes(command as string))
        showFieldM(message);

    else if(command === "move")
        move(message, args);
    
    else if(command === "attack")
        attack(message, args);

    else if(command === "mine")
        mine(message, args);
    
    else if(command === "digmine")
        digmine(message, args);

});

client.login(config.token);