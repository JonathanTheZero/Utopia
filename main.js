//Ok
const Discord = require('discord.js');
const DBL = require("dblapi.js");
const config = require("./config.json");
const fs = require("fs");
require("./alliances.js")();
require("./utils.js")();
const battle = require("./battles.js");
const express = require('express');
const client = new Discord.Client();
const app = express();
app.use(express.static('public'));
var server = require('http').createServer(app);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
/*
const dbl = new DBL(config.dbl.token, { webhookServer: listener, webhookAuth: config.dbl.auth}, client);
dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

dbl.webhook.on('vote', vote => {
  let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
  for(let i = 0; i < parsedData.length;i++){
    if(parsedData[i].id == vote.user){
      parsedData[i].money += 15000;
      break;
    }
  }
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
});
*/

//loading the settings
console.log("My prefix is", config.prefix)

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`.help | ${client.users.size} users on ${client.guilds.size} servers`);
  var tdiff = [(Math.floor(Date.now() / 1000) - config.lastPayout), (Math.floor(Date.now() / 1000) - config.lastPopulationWorkPayout)];
  setTimeout(payoutLoop, ((14400 - tdiff[0]) * 1000));
  setTimeout(populationWorkLoop, ((39600 - tdiff[1]) * 1000));
  let gas = JSON.parse(fs.readFileSync("giveaways.json"));
  for(let i = 0; i < gas.length; i++){
    giveawayCheck(i);
  }
  /*let  
  let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
  for(let i = 0; i < parsedData.length;i++){
    parsedData[i].upgrades.battle.iA = 0;
    parsedData[i].upgrades.battle.iD = 0;
    parsedData[i].upgrades.battle.cA = 0;
    parsedData[i].upgrades.battle.cD = 0;
    parsedData[i].upgrades.battle.aA = 0;
    parsedData[i].upgrades.battle.aD = 0;
    parsedData[i].battleToken = 0;
    parsedData[i].tokenUsed = false;
    parsedData[i].duelsWon = 0;
  }
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  /*
    let  
  let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
  for(let i = 0; i < parsedData.length;i++){
    parsedData[i].resources.population = Math.floor(parsedData[i].resources.population);
    console.log(parsedData[i].tag);
  }
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));*/
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
  if(message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;
  else {
    try {
      var bsRaw = fs.readFileSync("public/botstats.json");
      var bs = JSON.parse(bsRaw);
      bs.commandsRun++;
      bs.activeServers = client.guilds.size.commafy();
      bs.users = client.users.size.commafy();
      fs.writeFileSync("public/botstats.json", JSON.stringify(bs, null, 2));
    }
    catch {}
  }
  var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  else if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  else if(command === "kick" || command === "yeet") {
    /*if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");*/
    
    if (!message.member.hasPermission(['KICK_MEMBERS'], false, true, true)) {
      return message.reply("this command can only be used by Members who have Kick permissions");
    } 
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention/ID a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  else if(command === "ban") {
    /*if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");*/
    
    if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'], false, true, true)) {
      return message.reply("this command can only be used by Members who have Kick and Ban permissions");
    }


    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention/ID a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    if(!message.member.hasPermission(['MANAGE_MESSAGES'], false, true, true)){
      return message.reply("sorry, this command requires the manage message permission.")
    }
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10) + 1;
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 1 || deleteCount > 100)
      return message.reply("Please provide a number between 1 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  else if(command === "create"){
    createUser(message);
  }

  else if(command === "vote"){
    message.channel.send("Vote every 12h in order to get 15,000 money for free! \n" + "https://top.gg/bot/619909215997394955/vote")
  }

  else if(command == "bet" || command == "coinflip"){
    var parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      return message.reply("you haven't created an account yet, please use the `create` command.");
    }
    if(args[0] == "a" && parsedData[index].money == 0) return message.reply("you don't have any money left!");
    else if((isNaN(args[0]) && args[0] != "a" && (args[0] != ("h") || args[0] != ("h")) && (args[0] != ("q") || args[0] != ("quarter"))) && typeof args[0] === "undefined" && args[0] < 1){
      return message.reply("please enter a valid amount using `.bet <amount>` or `.bet a` to bet all your money.");
    }
    var won = (Math.random() > 0.5);
    
    var money = (args[0] == "a") ? parsedData[index].money : parseInt(args[0]);
    
    if (args[0] == "half" || args[0] == "h"){
      money = Math.floor((parsedData[index].money)/2);
    }
    
    //To allow the user to bet a quarter of their money rounded up
    else if (args[0] == "quarter" || args[0] == "q"){
        money = Math.floor((parsedData[index].money)*0.25);
    }

    if(money > parsedData[index].money){
      message.reply("you can't bet more money than you own!");
      return;
    }
    if(won){
      parsedData[index].money += money;
      message.reply("congratulations! You won " + money.commafy() + " coins!");
    }
    else {
      parsedData[index].money -= money;
      message.reply("you lost " + money.commafy() + " coins. Try again next time!");
    }
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  else if(command == "leaderboard" || command == "lb"){
    var lbEmbed;
    if(args[0] == "p" || args[0] == "population"){
      try {
        lbEmbed = (typeof args[1] === "undefined") ? generateLeaderboardEmbed("p", 1, message) : generateLeaderboardEmbed("p", args[1], message);
        if(args[1] > Math.floor(getLeaderboardList("p").length / 10) + 1|| isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
      }
      catch {
        return  message.reply("that isn't a valid page number!")
      }
    }

    
    else if (args[0] == "f" || args[0] == "food"){
      try{
        lbEmbed = (typeof args[1] === "undefined") ? generateLeaderboardEmbed("f", 1, message) : generateLeaderboardEmbed("f", 1, message);
        if(args[1] > Math.floor(getLeaderboardList("f").length / 10) + 1 ||  isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
      }
      catch {
        return message.reply("that isn't a valid page number!")
      }
    }
    else if(args[0] == "alliances" || args[0] == "alliance" || args[0] == "a"){
      try {
        lbEmbed = (typeof args[1] === "undefined") ? generateLeaderboardEmbed("a", 1, message) : generateLeaderboardEmbed("a", args[1], message);
        if(args[1] > Math.floor(getLeaderboardList("a").length / 10) + 1|| isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
      }
      catch {
        return message.reply("that isn't a valid page number!")
      }
    }
    else if(["wins", "duels", "w"].includes(args[0])){
      try {
        lbEmbed = (typeof args[1] === "undefined") ? generateLeaderboardEmbed("w", 1, message) : generateLeaderboardEmbed("w", args[1], message);
        if(args[1] > Math.floor(getLeaderboardList("w").length / 10) + 1|| isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
      }
      catch {
        return message.reply("that isn't a valid page number!")
      }
    }
    else {
      if(!isNaN(args[0])){
        try {
          lbEmbed = generateLeaderboardEmbed("m", args[0], message);
          if(args[0] > Math.floor(getLeaderboardList("m").length / 10) + 1) return message.reply("this isn't a valid page number!");
        }
        catch {
          return message.reply("that isn't a valid page number!")
        }
      }
      else {
        try {
          lbEmbed = (typeof args[1] === "undefined") ? generateLeaderboardEmbed("m", 1, message) : generateLeaderboardEmbed("m", args[1], message);
          if(args[1] > Math.floor(getLeaderboardList("m").length / 10) + 1 || isNaN(args[1]) && typeof args[1] !== "undefined") return message.reply("this isn't a valid page number!");
        }
        catch {
          return message.reply("that isn't a valid page number!")
        }
      }
    }
    message.channel.send({ embed: lbEmbed });
  }

  else if(command === "invitelink"){
    message.reply("".concat("Add me to your server using this link: ", config.properties.inviteLink));
  }

  else if(command == "buy"){
    var parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      return message.reply("you haven't created an account yet, please use the `create` command.");
    }
    for(var i = 0; i < args.length; i++){
      args[i] = args[i].toLowerCase();
    }
    if(args[0] == "uk"|| (args[0] == "invade") && args[1] == "the" && args[2] == "uk"){
      return message.reply(buyItem("UK", index, 100000));
    }
    else if(args[0] == "equipment"|| (args[0] == "advanced") && args[1] == "equipment"){
      return message.reply(buyItem("AE", index, 250000));
    }
    else if(args[0] == "russia"|| (args[0] == "invade") && args[1] == "russia"){
      return message.reply(buyItem("RU", index, 500000));
    }
    else if(args[0] == "city"|| (args[0] == "expand") && args[1] == "your" && args[2] == "city" || args[0] == "expanded" && args[1] == "city"){
      return message.reply(buyItem("EC", index, 1000000));
    }
    else if(args[0] == "globalization"){
      return message.reply(buyItem("GL", index, 2500000));
    }
    else if(args[0] == "soldiers"|| (args[0] == "recruit") && args[1] == "more" && args[2] == "soldiers"){
      return message.reply(buyItem("MS", index, 10000000));
    }
    else if(args[0] == "us"|| (args[0] == "invade") && args[1] == "the" && args[2] == "us"){
      return message.reply(buyItem("US", index, 5000000));
    }
    else if(args[0] == "food" || args[0] == "a" && args[1] == "pack" && args[2] == "of" && args[3] == "food"){
      let amount;
      if(typeof args[1] != "undefined" && !isNaN(parseInt(args[1]))) amount = parseInt(args[1]);
      if(typeof args[1] != "undefined" && !isNaN(parseInt(args[4]))) amount = parseInt(args[4]);
      if(isNaN(amount) || typeof amount == "undefined") amount = 1;
      if(parsedData[index].money >= amount * 20000){
        parsedData[index].money -= amount * 20000;
        parsedData[index].resources.food += amount * 50000;
        fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
        return message.reply(`you successfully bought ${(amount*50000).commafy()} food for your population.`);
      }
      return message.reply("you don't have enough money.");
    }
    else if(args[0] == "arable" && args[1] == "farming"){
      return message.reply(buyItemAlliance("AF", index, 100000, 1));
    }
    else if(args[0] == "pastoral" && args[1] == "farming"){
      return message.reply(buyItemAlliance("PF", index, 1750000, 2));
    }
    else if(args[0] == "mixed" && args[1] == "farming"){
      return message.reply(buyItemAlliance("MF", index, 7500000, 3));
    }
    else if(args[0] == "better" && args[1] == "armors"){
      return message.reply(buyBattleUpgrade(index, 0, 2, 0, 1, 0, 0, 4));
    }
    else if(args[0] == "harder" && args[1] == "steel"){
      return message.reply(buyBattleUpgrade(index, 1, 1, 1, 1, 1, 1, 10));
    }
    else if(args[0] == "arabic" && args[1] == "horses"){
      return message.reply(buyBattleUpgrade(index, 0, 0, 2, 2, 0, 0, 6));
    }
    else if(args[0] == "heavy" && args[1] == "artillery"){
      return message.reply(buyBattleUpgrade(index, 0, 0, 0, 0, 2, 2, 8));
    }
    else if(args[0] == "better" && args[1] == "army" && args[2] == "management"){
      return message.reply(buyBattleUpgrade(index, 1, 1, 0, 0, 1, 0, 6));
    }
  }

  else if(command == "use"){

  }

  else if(command === "me" || command === "stats"){
    var user;
    var url;
    if(typeof args[0] === "undefined"){
      user = searchUser(message);
      url = `${message.author.displayAvatarURL}`;
    }
    else {
      try{
        user = searchUserByID(message.mentions.users.first().id);
        url = `${message.mentions.users.first().displayAvatarURL}`;
      }
      catch {
        user = searchUserByID(args[0]);
        url = client.users.get(user.id.toString()).displayAvatarURL;
      }
    }
    var alliance = user.alliance;

    if(alliance == null){
      alliance = (typeof args[0] === "undefined") ? "You haven't joined an alliance yet." :  user.tag + ` hasn't joined an alliance yet.`;
    }
    if(user.allianceRank == "M"){
      alliance = "".concat("Member of ", alliance);
    }
    else if(user.allianceRank == "C"){
      alliance = "".concat("Co-leader of ", alliance);
    }
    else if(user.allianceRank == "L"){
      alliance = "".concat("Leader of ", alliance);
    }
    var upgrades = (typeof args[0] === "undefined") ? "You haven't purchased any upgrades yet." : `${user.tag} hasn't purchased any upgrades yet.`;
    if(user.upgrades.population.length != 0){
      upgrades = "\u200b";
      if(user.upgrades.population.includes("UK")) upgrades += "UK"
      if(user.upgrades.population.includes("AE")) upgrades += ", Equipment"
      if(user.upgrades.population.includes("RU")) upgrades += ", Russia"
      if(user.upgrades.population.includes("EC")) upgrades += ", Expanded City"
      if(user.upgrades.population.includes("GL")) upgrades += ", Globalization"
      if(user.upgrades.population.includes("MS")) upgrades += ", More Soldiers"
      if(user.upgrades.population.includes("US")) upgrades += ", US"
    }
    if(user.resources.food == null) user.resources.food = 0;
    const bu = user.upgrades.battle
    const meEmbed = {
      color: parseInt(config.properties.embedColor),
      title: `Data for ` + ((typeof args[0] === "undefined") ? `${message.author.tag}` : `${user.tag}`),
      thumbnail: {
        url: url,
      },
      fields: [
        {
          name: 'Money:',
          value: user.money.commafy(),
          inline: true,
        },
        {
          name: 'Food:',
          value: user.resources.food.commafy(),
          inline: true,
        },
        {
          name: "Population:",
          value: user.resources.population.commafy(),
        },
        {
          name: "Battle token:",
          value: user.battleToken.commafy(),
          inline: true
        },
        {
          name: "Duels won:",
          value: user.duelsWon.commafy(),
          inline: true,
        },
        {
          name: 'Alliance:',
          value: alliance,
        },
        {
          name: "Upgrades:",
          value: upgrades,
        },
        {
          name: "Battle bonuses:",
          value: `+${bu.iA} Att/+${bu.iD} Def for Infantry\n` +
          `+${bu.cA} Att/+${bu.cD} Def for Cavallry\n` +
          `+${bu.aA} Att/+${bu.aD} Def for Artillery\n`
        }
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    }; 
    message.channel.send({ embed: meEmbed });
  }

  else if(command == "inventory" || command == "inv"){
    var user = searchUser(message);
    const inventoryEmbed = {
      color: parseInt(config.properties.embedColor),
      title: `Your inventory`,
      thumbnail: {
        url: `${message.author.displayAvatarURL}`,
      },
      fields: [
        {
          name: "Your items (shortenings)",
          value: ((user.inventory.length == 0) ? "You don't have any items in your inventory" : user.inventory.join(", ")),
        }
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    };
    message.channel.send({ embed: inventoryEmbed });
  }

  else if(command == "server"){
    message.reply("join the official Utopia server for special giveaways, support, bug reporting and more here: "+ config.serverInvite);
  }

  else if(command == "payout"){
    var user;
    if(typeof args[0] === "undefined"){
      user = searchUser(message);
    }
    else {
      try{
        user = searchUserByID(message.mentions.users.first().id);
      }
      catch {
        user = searchUserByID(args[0]);
      }
    }
    var userPop = 0;
    if(user.upgrades.population.length != 0){
      if(user.upgrades.population.includes("UK")) userPop += 5000;
      if(user.upgrades.population.includes("AE")) userPop += 10000;      
      if(user.upgrades.population.includes("RU")) userPop += 15000;
      if(user.upgrades.population.includes("EC")) userPop += 25000;
      if(user.upgrades.population.includes("GL")) userPop += 50000;
      if(user.upgrades.population.includes("MS")) userPop += 200000;
      if(user.upgrades.population.includes("US")) userPop += 750000;
    }

    var userFood = 0;
    if(user.alliance != null){
      let alliance = getAllianceByName(user.alliance);
      if(user.allianceRank == "L"){
        userFood = alliance.upgrades.af * 15000 + Math.floor(((alliance.upgrades.af * 120000)/(alliance.members.length + alliance.coLeaders.length + 1))) +
          alliance.upgrades.pf * 100000 + Math.floor(((alliance.upgrades.pf * 800000)/(alliance.members.length + alliance.coLeaders.length + 1))) +
          alliance.upgrades.mf * 500000 + Math.floor(((alliance.upgrades.mf * 4000000)/(alliance.members.length + alliance.coLeaders.length + 1)));
      }
      else if(user.allianceRank == "C"){
        userFood = alliance.upgrades.af * 7500 + Math.floor(((alliance.upgrades.af * 120000)/(alliance.members.length + alliance.coLeaders.length + 1))) +
          alliance.upgrades.mf * 250000 + Math.floor(((alliance.upgrades.mf * 4000000)/(alliance.members.length + alliance.coLeaders.length + 1))) +
          alliance.upgrades.pf * 50000 + Math.floor(((alliance.upgrades.pf * 800000)/(alliance.members.length + alliance.coLeaders.length + 1)));
      }
      else if(user.allianceRank == "M"){
        userFood = Math.floor(((alliance.upgrades.af * 120000)/(alliance.members.length + alliance.coLeaders.length + 1))) +
          Math.floor(((alliance.upgrades.mf * 4000000)/(alliance.members.length + alliance.coLeaders.length + 1))) +
          Math.floor(((alliance.upgrades.pf * 800000)/(alliance.members.length + alliance.coLeaders.length + 1)));
      }
    }

    message.channel.send({
      embed: {
        color: parseInt(config.properties.embedColor),
        title: `Next payout stats for ${user.tag}`,
        fields: [
          {
            name: "Population:",
            value: userPop.commafy(),
            inline: true
          },
          {
            name: "Money",
            value: `Between ${Math.floor(user.resources.population / 15).commafy()} and ${Math.floor(user.resources.population / 8).commafy()}`,
            inline: true
          },
          {
            name: "Food:",
            value: userFood.commafy(),
            inline: true
          }
        ],
        footer: config.properties.footer,
        timestamp: new Date()
      }
    });
  }

  else if(command == "kill"){
    if(typeof args[0] === "undefined" || (args[0].isNaN() && args[0] != "a") || parseInt(args[0]) < 0) 
      return message.reply("please specify the amount follow the syntax of `.kill <amount>`.");
    let parsedData = JSON.parse(fs.readFileSync("userdata.json"));
    let index = -1;
    for(let i = 0; i < parsedData.length;i++){
      if(parsedData[i].id == message.author.id){
        index = i;
        break;
      }
    }
    if(index == -1)
      return message.reply("you haven't created an account yet, please use the `.create` command first.");
    const a = (args[0] == "a") ? parsedData[index].resources.population : parseInt(args[0]);
    if(a > parsedData[index].resources.population)
      return message.reply("you can't kill more population than you own!");
    parsedData[index].resources.population -= a;
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
    return message.reply(`you succesfully killed ${a.commafy()} people.`);
  }

  else if(command == "start-giveaway"){
    //.start-giveaway <amount> <currency> <winners> <ending>
    if(!config.botAdmins.includes(parseInt(message.author.id))) return message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
    let gas = JSON.parse(fs.readFileSync("giveaways.json"));
    const endstr = args.slice(3).join(" ");
    if(args.length < 4 || parseInt(args[3]) < 1 || parseInt(args[0]) < 1) return message.reply("please follow the syntax `.start-giveaway <amount> <currency> <winners> <ending>`");

    var currency;
    if(args[1].startsWith("p") || args[1].startsWith("P"))
      currency = "Population";
    else if(args[1].startsWith("f") || args[1].startsWith("F"))
      currency = "Food";
    else if(args[1].startsWith("m") || args[1].startsWith("M"))
      currency = "Money";
    else
      return message.reply("the only valid currencies are food, population and money!");
    
    var ending;
    var addTime = -1;
    if(endstr.match(/[in]?[ ]?\d{1,}[ ]?m/ig)){//x minutes
      addTime = parseInt(endstr.match(/\d+/g).map(Number)[0]) * 60 * 1000;
      ending = new Date(Date.now() + addTime);
    }
    else if(endstr.match(/[in]?[ ]?\d{1,}[ ]?h/ig)){//x hours
      addTime = parseInt(endstr.match(/\d+/g).map(Number)[0]) * 3600 * 1000;
      ending = new Date(Date.now() + addTime);
    }
    else if(endstr.match(/[in]?[ ]?\d{1,}[ ]?d/ig)){//x days
      addTime = parseInt(endstr.match(/\d+/g).map(Number)[0]) * 24 * 3600 * 1000;
      ending = new Date(Date.now() + addTime);
    }
    if(addTime == -1)
      return message.reply("please specifiy a valid time.")
    if(addTime > 172800000) 
      return message.reply("You can't start a giveaway that lasts longer than two days!");
    var giveaway;
    await message.channel.send({
      embed: {
        color: parseInt(config.properties.embedColor),
        title: `Giveaway for ${args[0].commafy()}x${currency}`,
        description: "React to the message to participate in the giveaway",
        footer: {
          text: `${config.properties.footer.text}  •  Ends at: `,
          icon_url: config.properties.footer.icon_url
        },
        timestamp: new Date(ending)
      }
    }).then(sent => {
      giveaway = {
        channelid: message.channel.id,
        messageid: message.id,
        winners: parseInt(args[2]),
        startedAt: Date.now(),
        endingISO: ending,
        priceAm: args[0],
        priceCur: args[1],
        endingAt: new Date(ending).getTime(),
        embedId: sent.id,
        users: [] 
      }
    });
    gas.push(giveaway);
    fs.writeFileSync("giveaways.json", JSON.stringify(gas, null, 2));
    let msg = await message.channel.fetchMessage(giveaway.embedId);
    msg.react("🎉");
    giveawayCheck(gas.indexOf(giveaway));
  }

  else if(command === "add"){
    if(!config.botAdmins.includes(parseInt(message.author.id))) return message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
    if(typeof args[0] === "undefined" || typeof args[1] === "undefined" || typeof args[2] === "undefined") return message.reply("please supply valid parameters following the syntax `.add <type> <mention/ID> <amount>`.");
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.mentions.users.first().id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1) return message.reply("this user hasn't created an account yet.");
    var m = ["money", "m"];
    var f = ["food", "f"];
    var p = ["population", "p"]
    const a = parseInt(args[2])
    if(a == null) return message.reply("this isn't a valid amount.");
    if(m.includes(args[0])){
      parsedData[index].money += a;
      message.reply("Succesfully added " + a.commafy() + " " + `money to ${message.mentions.users.first()} balance.`);
    }
    else if(f.includes(args[0])){
      parsedData[index].resources.food += a;
      message.reply("Succesfully added " + a.commafy() + " " + `food to ${message.mentions.users.first()} balance.`);
    }
    else if(p.includes(args[0])){
      parsedData[index].resources.population += a;
      message.reply("Succesfully added " + a.commafy() + " " + `population to ${message.mentions.users.first()} balance.`);
    }
   
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  else if(command === "send"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    var auInd = -1;
    let user;
    try{
      user = searchUserByID(message.mentions.users.first().id);
    }
    catch {
      user = searchUserByID(args[0]);
    }
    for(var i = 0; i < parsedData.length; i++){
      if(user.id == parsedData[i].id) index = i;
      if(message.author.id == parsedData[i].id) auInd = i;
    }
    
    var a = (args[1] == "a") ? parsedData[index].money : parseInt(args[1]);
    if(typeof args[1] === "undefined" || isNaN(a))return message.reply("please supply valid parameters following the syntax `.send <mention/ID> <amount>`.");
    if(auInd == -1) return message.reply("you haven't created an account yet, please use `.create` to create one.");
    if(index == -1) return message.reply("this user hasn't created an account yet.");
    if(index == auInd) return message.reply("you can't send money to yourself!");
    if(parsedData[auInd].alliance == null) return message.reply("you haven't joined an alliance yet!");
    if(parsedData[auInd].alliance != parsedData[index].alliance) return message.reply("you can only send money to users in your alliance.");
    if(a == null || a < 1) return message.reply("this isn't a valid amount.");
    if(parsedData[auInd].money < a) return message.reply("you can't send more money than you own!");
    if(args[1] == "a"){
      parsedData[index].money += parsedData[auInd].money;
      parsedData[auInd].money = 0;
    }
    else {
      parsedData[index].money += a;
      parsedData[auInd].money -= a;
    }
    message.reply("Succesfully sent " + a.commafy() + " " + `money to ${user.tag}.`);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  else if(command === "deposit"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
     
    let  parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
    var alInd = -1;
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedData[index].alliance == parsedDataAlliances[i].name){
        alInd = i;
        break;
      }
    }
    var a = (args[0] == "a") ? parsedData[index].money : parseInt(args[0]);
    if(typeof args[0] === "undefined" || isNaN(a))return message.reply("please supply valid parameters following the syntax `.deposit <amount>`.");
    if(index == -1) return message.reply("you haven't created an account yet, please use `.create` to create one.");
    if(parsedData[index].alliance == null) return message.reply("you haven't joined an alliance yet!");
    if(a == null || a < 1) return message.reply("this isn't a valid amount.");
    if(parsedData[index].money < a) return message.reply("you can't send more money than you own!");
    if(args[1] == "a"){
      parsedDataAlliances[alInd].money += parsedData[index].money;
      parsedData[index].money = 0;
    }
    else {
      parsedDataAlliances[alInd].money += a;
      parsedData[index].money -= a;
    }
    message.reply("Succesfully sent " + a.commafy() + " " + `money to your alliance.`);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
    fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
  }
  else if(command == "donatep"){
    parsedData = JSON.parse(fs.readFileSync('userdata.json'));
     
    parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
    var alInd = -1;
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedData[index].alliance == parsedDataAlliances[i].name){
        alInd = i;
        break;
      }
    }
    var a = (args[0] == "a") ? parsedData[index].resources.population : parseInt(args[0]);
    if(typeof args[0] === "undefined" || isNaN(a))return message.reply("please supply valid parameters following the syntax `.donate <amount>`.");
    if(index == -1) return message.reply("you haven't created an account yet, please use `.create` to create one.");
    if(parsedData[index].alliance == null) return message.reply("you haven't joined an alliance yet!");
    if(a == null || a < 1) return message.reply("this isn't a valid amount.");
    if(parsedData[index].resources.population < a) return message.reply("you can't send more people than you have!");
    if(args[0] == "a"){
      parsedDataAlliances[alInd].population += parsedData[index].resources.population;
      parsedData[index].resources.population = 0;
    }
    else {
      parsedDataAlliances[alInd].population += a;
      parsedData[index].resources.population -= a;
    }
    message.reply("Succesfully sent " + a.commafy() + " " + `people to your alliance.`);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
    fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
  }
  else if(command === "joinalliance" || command === "join"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      message.reply("you haven't created an account yet, please use the `create` command.");
      return;
    }
    else if(parsedData[i].alliance != null){
      message.reply("you can't join another alliance, because you already joined one. Leave your alliance with `.leavealliance` first.")
      return;
    }
    if(parsedData[index].alliance == null){
      const allianceName = args.join(" ");
      message.reply(joinAliiance(message, allianceName, index));
    }
  }

  else if(command == "createalliance"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      message.reply("you haven't created an account yet, please use the `create` command.");
      return;
    }
    else if(parsedData[i].alliance != null){
      message.reply("you can't create your own alliance, because you already joined one. Leave your alliance with `.leavealliance` first.")
      return;
    }
    if(parsedData[index].alliance == null){
      const allianceName = args.join(" ");
      message.reply(createAliiance(message, allianceName, index));
    }
  }

  else if(command == "leavealliance" || command == "leave"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1)
      return message.reply("you haven't created an account yet, please use the `create` command.");
    else if(parsedData[i].alliance != null){
      return message.reply(leaveAlliance(message));
    }
    if(parsedData[index].alliance == null)
      return message.reply("you are not part of any alliance.");
  }

  else if(command == "renamealliance" || command == "rename"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1)
      return message.reply("you haven't created an account yet, please use the `create` command.");
    else if(parsedData[index].allianceRank == "M"){
      return message.reply("only Co-Leaders and the Leader can use this command!");
    }
    else if(parsedData[index].alliance == null){
      return message.reply("you haven't joined an alliance yet!");
    }
    if(parsedData[index].alliance != null){
      const allianceName = args.join(" ");
      return message.reply(renameAlliance(message, allianceName, index));
    }
  }

  else if(command === "promote"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    let member;
    try{
      member = searchUserByID(message.mentions.users.first().id);
    }
    catch {
      member = searchUserByID(args[0]);
    }
    if(index == -1) return message.reply("you haven't created an account yet, please use the `create` command.");
    if(typeof args[0] === 'undefined') return message.reply("please supply a username with `.promote <mention/ID>`.");
    if(member.id == message.author.id) return message.reply("you can't promote yourself!");
    if(parsedData[index].allianceRank != "L") return message.reply("only the leader can promote members.");
    else {
      message.reply(promote(message, index, member));
    }
  }

  else if(command === "demote"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    let member;
    try{
      member = searchUserByID(message.mentions.users.first().id);
    }
    catch {
      member = searchUserByID(args[0]);
    }
    if(index == -1) return message.reply("you haven't created an account yet, please use the `create` command.");
    if(member.id == message.author.id) return message.reply("you can't demote yourself!");
    if(typeof args[0] === 'undefined') return message.reply("please supply a username with `.demote <mention/ID>`.");
    if(parsedData[index].allianceRank != "L") return message.reply("only the leader can demote members.");
    else {
      message.reply(demote(message, index, member));
    }
  }

  else if(command === "setprivate"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1) return message.reply("you haven't created an account yet, please use the `create` command.");
    if(parsedData[index].allianceRank == null) return message.reply("you haven't joined an alliance yet.");
    if(parsedData[index].allianceRank != "M") return message.reply(setAllianceStatus(false, index));
    else {
      message.reply("Only the Leader and the Co-Leaders can set the alliance status");
    }
  }

  else if(command === "setpublic"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1) return message.reply("you haven't created an account yet, please use the `create` command.");
    if(parsedData[index].allianceRank == null) return message.reply("you haven't joined an alliance yet.");
    if(parsedData[index].allianceRank != "M") return message.reply(setAllianceStatus(true, index));
    else {
      message.reply("Only the Leader and the Co-Leaders can set the alliance status");
    }
  }

  else if(command === "settax"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1) return message.reply("you haven't created an account yet, please use the `create` command.");
    if(parsedData[index].allianceRank == null) return message.reply("you haven't joined an alliance yet.");
    if(typeof args[0] === "undefined" || parseInt(args[0]) > 90 || parseInt(args[0]) < 0 || isNaN(parseInt(args[0]))) return message.reply("please provide a valid number following `.settax <0-90>`.")
    if(parsedData[index].allianceRank != "M") return message.reply(setAllianceTax(index, parseInt(args[0])));
    else {
      message.reply("Only the Leader and the Co-Leaders can set the alliance status");
    }
  }

  else if(command === "upgradealliance" || command == "upalliance"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      message.reply("you haven't created an account yet, please use the `create` command.");
      return;
    }
    if(parsedData[index].allianceRank != "M"){
      message.reply(upgradeAlliance(index));
      return;
    }
    else {
      message.reply("Only the Leader and the Co-Leaders can upgrade the alliance status");
    }
  }

  else if(command === "invite"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    let member;
    try{
      member = searchUserByID(message.mentions.users.first().id);
    }
    catch {
      member = searchUserByID(args[0]);
    }
    if(index == -1) return message.reply("you haven't created an account yet, please use the `create` command.");
    if(typeof args[0] === 'undefined') return message.reply("please supply a username with `.invite <mention/ID>`.");
    if(parsedData[index].allianceRank != "M") return message.reply(inviteToAlliance(message, index, member));
    else {
      message.reply("only the leader and the co-leaders can send out invites.");
    }
  }
  
  else if(command === "fire"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    let member;
    try{
      member = searchUserByID(message.mentions.users.first().id);
    }
    catch {
      member = searchUserByID(args[0]);
    }
    if(index == -1) return message.reply("you haven't created an account yet, please use the `create` command.");
    if(typeof args[0] === 'undefined') return message.reply("please supply a username with `.fire <mention/ID>`.");
    if(parsedData[index].allianceRank != "L") return message.reply("only the leader can fire members.");
    return message.reply(fire(message, index, member));
  }

  else if(command == "alliance"){
    let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
    var user;
    var url;
    if(typeof args[0] === "undefined"){
      user = searchUser(message);
      url = `${message.author.displayAvatarURL}`;
    }
    else {
      try{
        user = searchUserByID(message.mentions.users.first().id);
        url = `${message.mentions.users.first().displayAvatarURL}`;
      }
      catch {
        user = searchUserByID(args[0]);
        url = client.users.get(user.id.toString()).displayAvatarURL;
      }
    }
    var alliance = user.alliance;
    if(alliance == null){
      if(typeof args[0] === "undefined"){
        message.reply("you haven't joined an alliance yet.");
        return;
      }
      else{
        return message.reply(user.tag + " hasn't joined an alliance yet");
      }
    }

    var ind = -1;
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedDataAlliances[i].name == user.alliance){
        ind = i;
        break;
      }
    }
    var coLeaders = "This alliance doesn't have any Co-Leaders";
    const cl = parsedDataAlliances[ind].coLeaders;
    if(cl.length == 1){
      coLeaders = "The Co-Leader of this alliance is <@" + cl[0] + ">";
    }
    else if(cl.length == 2){
      coLeaders = "The Co-Leaders of this alliance are <@" + cl[0] + "> and <@" + cl[1] + ">";
    }
    const u = parsedDataAlliances[ind].upgrades;
    const priv = ((parsedDataAlliances[ind].public) ? "This alliance is public" : "This alliance is private")
    const allianceEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Data for ", alliance),
      thumbnail: {
        url: url,
      },
      fields: [
        {
          name: 'Leader:',
          value: "".concat("<@",parsedDataAlliances[ind].leader.id,">"),
          inline: true,
        },
        {
          name: "Level",
          value: "This alliance is level " + parsedDataAlliances[ind].level,
          inline: true,
        },
        {
          name: 'Co-Leaders:',
          value: coLeaders,
        },
        {
          name: "Membercount:",
          value: parsedDataAlliances[ind].members.length + parsedDataAlliances[ind].coLeaders.length + 1,
          inline: true,
        },
        {
          name: "Money:",
          value: "The balance of this alliance is " + parsedDataAlliances[ind].money.commafy(),
          inline: true,
        },
        {
          name: "Army:",
          value: "Manpower of this alliance is " + parsedDataAlliances[ind].population.commafy(),
          inline: true,
        },
        {
          name: "Privacy settings:",
          value: priv,
          inline: true
        },
        {
          name: "Taxrate:",
          value: parsedDataAlliances[ind].tax + "%",
          inline: true,
        },
        {
          name: 'Upgrades:',
          value: "This alliance owns: " + u.af + "x Arable Farming, " + u.pf + "x Pastoral Farming, " + u.mf + "x Mixed Farming",
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true
        }
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    }; 
    message.channel.send({ embed: allianceEmbed });
  }

  else if(command == "alliancemembers"){
    let  parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
    var user;
    var url;
    if(typeof args[0] === "undefined"){
      user = searchUser(message);
      url = `${message.author.displayAvatarURL}`;
    }
    else {
      try{
        user = searchUserByID(message.mentions.users.first().id);
        url = `${message.mentions.users.first().displayAvatarURL}`;
      }
      catch {
        user = searchUserByID(args[0]);
        url = client.users.get(user.id.toString()).displayAvatarURL;
      }
    }
    var alliance = user.alliance;
    if(alliance == null){
      if(typeof args[0] === "undefined"){
        message.reply("you haven't joined an alliance yet.");
        return;
      }
      else{
        message.reply(user.tag + ` hasn't joined an alliance yet.`);
        return;
      }
    }

    var ind = -1;
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedDataAlliances[i].name == user.alliance){
        ind = i;
        break;
      }
    }
    var coLeaders = "This alliance doesn't have any Co-Leaders";
    const cl = parsedDataAlliances[ind].coLeaders;
    if(cl.length == 1){
      coLeaders = "<@" + cl[0] + ">";
    }
    else if(cl.length == 2){
      coLeaders = " <@" + cl[0] + "> and <@" + cl[1] + ">";
    }
    var members = "This alliance doesn't have any members";
    if(parsedDataAlliances[ind].members.length > 0){
      members = ""
      for(let i = 0; i < parsedDataAlliances[ind].members.length;i++){
        members += "<@" + parsedDataAlliances[ind].members[i] +">\n";
      }
    }
    var invs = "This alliance doesn't have any active invites";
    if(parsedDataAlliances[ind].invitedUsers.length > 0){
      invs = ""
      for(let i = 0; i < parsedDataAlliances[ind].invitedUsers.length;i++){
        invs += "<@" + parsedDataAlliances[ind].invitedUsers[i] +">\n";
      }
    }
    const u = parsedDataAlliances[ind].upgrades;
    const allianceEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Data for ", alliance),
      thumbnail: {
        url: url,
      },
      fields: [
        {
          name: 'Leader:',
          value: "".concat("<@",parsedDataAlliances[ind].leader.id,">"),
          inline: true,
        },
        {
          name: 'Co-Leaders:',
          value: coLeaders,
          inline: true,
        },
        {
          name: "Members:",
          value: members,
        },
        {
          name: "Invited users:",
          value: invs
        }
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    }; 
    message.channel.send({ embed: allianceEmbed });
  }

  else if(command === "help"){
    var helpEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "Welcome to the help menu. Please choose a category",
      thumbnail: {
        url: message.author.displayAvatarURL,
      },
      fields: [
        {
          name: 'General help:',
          value: "type `.help general` to view the help menu for the general commands",
        },
        {
          name: 'Alliance help:',
          value: "type `.help alliance` to view the alliance help menu",
        },
        {
          name: "Battle help",
          value: "type `.help battle` to view the battle help menu",
        },
        {
          name: "Miscellaneous help:",
          value: "type `.help misc` to view the help menu for everything else",
        },
        {
          name: "Moderation help:",
          value: "type `.help mod` to view the help menu for everything else",
        }
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    }; 
    if(["general", "g"].includes(args[0])){
      helpEmbed.fields[2].name = "`.work`";
      helpEmbed.fields[2].value = "You gain up to 10,000 coins from working. You can work every 30 minutes.";
      helpEmbed.fields[0].name = "`.create`"
      helpEmbed.fields[0].value ="Create an account and start to conquer the world!"
      helpEmbed.fields[1].name = "`.me` or `.stats [mention/ID/ID]`"
      helpEmbed.fields[1].value = "View your stats or these of other players."
      helpEmbed.fields[3].value = "You can commit a crime every 4 hours. You have a 5% chance to increase your networth by 50,000 coins or up to 5% (whichever is higher), but be careful: you can also lose up to 2% of your current networth.",
      helpEmbed.fields[3].name = "`.crime`";
      helpEmbed.fields.pop();
      field4 = {
        name: "`.lb` or `.leaderboard [type] [page]`",
        value: "View the global leaderboard. Allowed types are 'allaince', 'wins', 'money' and 'population'.",
      }
      field5 = {
        name: "`.shop` or `.store [category]`",
        value: "View the shop (you'll find further information there).",
      }
      field6 = {
        name: "`.buy <item>`",
        value: "Buy an item from the shop."
      },
      field7 = {
        name: "`.use <item>`",
        value: "Use on of your purchased items."
      }
      field8 = {
        name: "`.inventory` or `.inv`",
        value: "View the items you purchased but haven't used yet."
      }
      field9 = {
        name: "`.kill <amount>`",
        value: "Kill a specific amount of your population."
      }
      field10 = {
        name: "`.alliance [mention/ID]`",
        value: "View the stats of your alliance or of the alliance of another user."
      }
      field11 = {
        name: "`.bet <amount>` or `.coinflip <amount>`",
        value: "You either gain the amount you bet or you lose it. (Note: use `.bet a` to bet all your money or `.bet h` to bet half of your money)"
      }
      field12 = {
        name: "`.payout [mention]`",
        value: "See how many ressources you or another user will receive during the next payout"
      }
      helpEmbed.title = "General help";
      helpEmbed.fields.push(field4, field5, field6, field7, field8, field9, field10, field11, field12);
    }
    else if(["alliance", "alliances", "a"].includes(args[0])){
      helpEmbed.fields[2].name = "`.createalliance <name>`";
      helpEmbed.fields[2].value = "Create your own alliance. (Price: 250,000)";
      helpEmbed.fields[0].name = "`.leavealliance`";
      helpEmbed.fields[0].value ="Leave your current alliance";
      helpEmbed.fields[1].name = "`.joinalliance <name>`";
      helpEmbed.fields[1].value = "Join an alliance";
      helpEmbed.fields.pop();
      helpEmbed.fields.pop();
      field3 = {
        name: "`.promote <mention/ID>` (Leader only)",
        value: "Promote a member or Co-Leader of your alliance (there is a maximum of two co-leaders)",
      }
      field4 = {
        name: "`.demote <mention/ID>` (Leader only)",
        value: "Demote a member of your alliance.",
      }
      field5 = {
        name: "`.fire <mention/ID>` (Leader only)",
        value: "Fire a member of your alliance.",
      }
      field6 = {
        name: "`.renamealliance <new name>` (Leader and Co-Leaders only)",
        value: "Rename your alliance."
      }
      field7 = {
        name: "`.setpublic` and `.setprivate` (Leader and Co-Leaders only)",
        value: "Change the setting of your alliance. Public: Everyone can join, Private: Only invited users can join."
      },
      field8 = {
        name: "`.invite <mention/ID>` (Leader and Co-Leaders only)",
        value: "Invite a member to your alliance."
      }
      field9 = {
        name: "`.upgradealliance` (Leader and Co-Leaders only)",
        value: "Level up your alliance in order to buy more upgrades. A level two alliance can own every farm two times for example. The current maximum is level 4."
      }
      field10 = {
        name: "`.alliance [mention/ID]`",
        value: "View the stats of your alliance or of the alliance of another user."
      }
      field11 = {
        name: "`.send <mention/ID> <amount>`",
        value: "Send a specific amount of money to one of your alliance members."
      }
      field12 = {
        name: "`.alliancemembers [mention/ID]`",
        value: "See a detailed list of all members and invited users from your alliance or the alliance of another user"
      }
      field13 = {
        name: "`.deposit <amount>`",
        value: "Deposit a specific amount of money in the bank of your alliance"
      }
      field14 = {
        name: "`.settax <value between 0 and 90>` (Leader and Co-Leaders only)",
        value: "Set the taxrate of your alliance. The tax only applies to the work and crime commands."
      }
      helpEmbed.title = "Alliance help";
      helpEmbed.fields.push(field3, field4, field5, field6, field7, field8, field9, field10, field11, field12, field13, field14);
    }
    else if(args[0] == "misc"){
      helpEmbed.fields[0].name = "`.autoping`";
      helpEmbed.fields[0].value ="Enable/Disable autopings when you can work or commit a crime again. (Enabled by default)";
      helpEmbed.fields[1].name = "`.payoutdms`";
      helpEmbed.fields[1].value = "Enable/Disable DMs when the payouts are given out. (Disabled by default)";
      helpEmbed.fields[2].name = "`.invitelink`";
      helpEmbed.fields[2].value = "Grab an invite link to add me to your server!";
      helpEmbed.fields[3].name = "`.patreon`";
      helpEmbed.fields[3].value = "Support the bot on Patreon!";
      helpEmbed.fields.pop();
      field3 = {
        name: "`.server`",
        value: "Join the official Utopia server!"
      }
      field4 = {
        name: "`.vote`",
        value: "You can vote every 12h for Utopia on top.gg to get 15k money for free!"
      },
      field5 = {
        name: "`.statistics`",
        value: "View some statistics about the bot"
      }
      helpEmbed.title = "Miscellaneous help";
      helpEmbed.fields.push(field3, field4, field5);
    }
    else if(args[0] == "mod"){
      helpEmbed.fields[0].name = "`.ban <mention/ID>`";
      helpEmbed.fields[0].value ="Bans a user from the server.";
      helpEmbed.fields[1].name = "`.yeet <mention/ID>` or `.kick <mention/ID>`";
      helpEmbed.fields[1].value = "Kicks a user from the server";
      helpEmbed.fields[2].name = "`.purge <amount>`";
      helpEmbed.fields[2].value = "Delete a specific amount of messages (up to 100 at the same time).";
      helpEmbed.fields.pop();
      helpEmbed.title = "Moderation help"
      helpEmbed.description = "The bot role needs to be ranked above the roles of the other users in order for these commands to work.";
    }
    else if(["battle", "battles", "b"].includes(args[0])){
      helpEmbed = battle.battleHelpEmbed;
    }
    message.channel.send({ embed: helpEmbed });
  }

  else if(command === "store" || command == "shop"){
    var storeEmbed = null;
    a = ["alliance", "alliances", "a"]
    if(args[0] == "population" || args[0] == "p"){
      storeEmbed = createStoreEmbed(message, "p", args);
    }
    else if(a.includes(args[0])){
      storeEmbed = createStoreEmbed(message, "a", args);
    }
    else if(["battle", "battles", "b"].includes(args[0])){
      storeEmbed = createStoreEmbed(message, "b", args)
    }
    else {
      storeEmbed = createStoreEmbed(message, "s", args);
    }
    if(storeEmbed != null) message.channel.send({ embed: storeEmbed });
  }

  else if(command == "autoping"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      message.reply("you haven't created an account yet, please use the `create` command.");
      return;
    }
    parsedData[index].autoping = !parsedData[index].autoping;
    var s = (!parsedData[index].autoping) ? "you successfully disabled autopings." : "you succesfully enabled autopings.";
    message.reply(s);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  else if(command == "payoutdms"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      message.reply("you haven't created an account yet, please use the `create` command.");
      return;
    }
    parsedData[index].payoutDMs = !parsedData[index].payoutDMs;
    var s = (!parsedData[index].payoutDMs) ? "you successfully disabled payout DMs." : "you succesfully enabled payout DMS.";
    message.reply(s);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  else if(["patreon", "donate", "paypal"].includes(command)){
    return message.reply("support the bot on Patreon here: https://www.patreon.com/utopiabot\nOr support on PayPal: https://paypal.me/JonathanTheZero");
  }

  else if(command === "work"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    let  parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
    var alInd = -1;
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedData[index].alliance == parsedDataAlliances[i].name){
        alInd = i;
        break;
      }
    }
    const oldTag = parsedData[index].tag;
    try{
      parsedData[index].tag = client.users.get(parsedData[index].id.toString()).tag;
    }
    catch {
      parsedData[index].tag = oldTag;
    }
    if(index == -1){
      message.reply("you haven't created an account yet, please use the `.create` command.");
      return;
    }
    if(Math.floor(Date.now() / 1000) - parsedData[index].lastWorked < 1800){
      message.reply("You can work again in " + new Date((1800 - (Math.floor(Date.now() / 1000) - parsedData[index].lastWorked)) * 1000).toISOString().substr(11, 8));
    }
    else {
      var produced = Math.floor(Math.random() * 10000);
      if(alInd == -1){
        parsedData[index].money += produced;
        message.reply("You successfully worked and gained " + produced.commafy() + " coins. Your new balance is " + parsedData[index].money.commafy() + " coins.");
      }
      else {
        var taxed = Math.floor((parsedDataAlliances[alInd].tax / 100) * produced);
        produced -= taxed;
        parsedDataAlliances[alInd].money += taxed;
        parsedData[index].money += produced;
        message.reply("You successfully worked and gained " + produced.commafy() + " coins. Your new balance is " + parsedData[index].money.commafy() + " coins. " + taxed.commafy() + " coins were sent to your alliance.");
      }
      parsedData[index].lastWorked = Math.floor(Date.now() / 1000);
      fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
      fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
      if(parsedData[index].autoping) reminder(message, 1800000, "I'll remind you in 30 minutes that you can work again.", "Reminder: Work again");
    }
  }

  else if(command === "crime"){
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
     
    let  parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
    var alInd = -1;
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedData[index].alliance == parsedDataAlliances[i].name){
        alInd = i;
        break;
      }
    }
    if(index == -1) 
      return message.reply("you haven't created an account yet, please use the `.create` command.");
    if(Math.floor(Date.now() / 1000) - parsedData[index].lastCrime < 14400) 
      return message.reply("You can commit a crime again in " + new Date((14400 - (Math.floor(Date.now() / 1000) - parsedData[index].lastCrime)) * 1000).toISOString().substr(11, 8));
    else {
      let oldBalance = parseInt(parsedData[index].money);
      var produced;
      if(Math.floor(Math.random() * 99) < 7){
        var p = Math.floor(oldBalance * Math.random() * 0.03);
        produced = (p > 50000) ? p : 50000;
      }
      else {
        produced = Math.floor(-1 * (oldBalance * Math.random() * 0.02));
      }
      parsedData[index].lastCrime = Math.floor(Date.now() / 1000);
      if(alInd == -1){
        parsedData[index].money += produced;
        if(produced > 1){
          message.reply("You successfully commited a crime and gained " + produced.commafy() + " coins. Your new balance is " + parsedData[index].money.commafy() + " coins.");
        }
        else{
          message.reply("You were unsuccesful and lost " + produced.commafy() + " coins. Your new balance is " + parsedData[index].money.commafy() + " coins.");
        }
      }
      else {
        if(produced > 1){
          var taxed = Math.floor((parsedDataAlliances[alInd].tax / 100) * produced);
          produced -= taxed;
          parsedDataAlliances[alInd].money += taxed;
          parsedData[index].money += produced;
          message.reply("You successfully commited a crime and gained " + produced.commafy() + " coins. Your new balance is " + parsedData[index].money.commafy() + " coins. " + taxed.commafy() + " coins were sent to your alliance.");
        }
        else{
          parsedData[index].money += produced
          message.reply("You were unsuccesful and lost " + produced.commafy() + " coins. Your new balance is " + parsedData[index].money.commafy() + " coins.");
        }
      }
      if(parsedData[index].autoping) reminder(message, 14400000, "I'll remind you in 4h to commit a crime again.", "Reminder: Commit a crime.");
    } 
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }
  
  else if(command == "startbattle" || command == "startduel" || command == "duel"){
    if(typeof args[0] === "undefined")return message.reply("please supply valid parameters following the syntax `.startbattle <mention/ID>`.");
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    var auInd = -1;
    let rawdataBattle = fs.readFileSync('activebattles.json');
    let battleData = JSON.parse(rawdataBattle);
    for(let i = 0; i < battleData.length;i++){
      if(message.author.id == battleData[i].p1.id || message.author.id == battleData[i].p2.id){
        return message.reply("you are already fighting in an active duel!")
      }
    }
    for(var i = 0; i < parsedData.length; i++){
      if(message.mentions.users.first().id == parsedData[i].id) index = i;
      if(message.author.id == parsedData[i].id) auInd = i;
    }
    if(auInd == -1) return message.reply("you haven't created an account yet, please use `.create` to create one.");
    if(index == -1) return message.reply("this user hasn't created an account yet.");
    if(index == auInd) return message.reply("you can't battle yourself!");
    battle.startbattle(auInd, index, message.channel.id);
  }

  else if(command === "cancelduel" || command == "cancelbattle"){
    let battleData = JSON.parse(fs.readFileSync('activebattles.json'));
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var dInd = -1;
    for(let i = 0; i < battleData.length;i++){
      if(message.author.id == battleData[i].p1.id || message.author.id == battleData[i].p2.id){
        dInd = i;
        break;
      }
    }
    if(dInd == -1) return message.reply("there is no active duel you could cancel.");
    message.reply("the running duel between <@" + battleData[dInd].p1.id + "> and <@" + battleData[dInd].p2.id + "> has been cancelled.");
    for(let i = 0;i < parsedData.length;i++){
      if(battleData[dInd].p1.id == parsedData[i].id){
        parsedData[i].resources.food += battleData[dInd].p1.resources.food;
        parsedData[i].resources.population += (battleData[dInd].p1.troops.inf + battleData[dInd].p1.troops.cav + battleData[dInd].p1.troops.art)*1000;
        parsedData[i].money += battleData[dInd].p1.costs;
      }
      if(battleData[dInd].p2.id == parsedData[i].id){
        parsedData[i].resources.food += battleData[dInd].p2.resources.food;
        parsedData[i].resources.population += (battleData[dInd].p2.troops.inf + battleData[dInd].p2.troops.cav + battleData[dInd].p2.troops.art)*1000;
        parsedData[i].money += battleData[dInd].p1.costs;
      }  
    }
    battleData.splice(dInd, 1);
    fs.writeFileSync("activebattles.json", JSON.stringify(battleData, null, 2));
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  else if(command == "dividetroops" || command == "divtroops"){
    let rawdataBattle = fs.readFileSync('activebattles.json');
    let battleData = JSON.parse(rawdataBattle);
    var dInd = -1;
    var p1;
    for(let i = 0; i < battleData.length;i++){
      if(message.author.id == battleData[i].p1.id){
        p1 = true;
        dInd = i;
        break;
      }
      if(message.author.id == battleData[i].p2.id){
        p1 = false;
        dInd = i;
        break;
      }
    }
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    var index = -1;
    for(let i = 0;i<parsedData.length;i++){
      if(parsedData[i].id == message.author.id){
        index = i;
        break;
      }
    }
    if(index == -1) return message.reply("you haven't created an account yet, please use `.create` first.");
    if(dInd == -1) return message.reply("you're not fighting in any active duel.");
    const inf = parseInt(args[0]);
    const cav = parseInt(args[1]);
    const art = parseInt(args[2]);
    if(isNaN(inf) || isNaN(cav) || isNaN(art) || inf < 0 || cav < 0 || art < 0 || typeof args[2] === "undefined") return message.reply("please provde valid parameters following `.dividetroops <infantry> <cavalry> <artillery>`");
    const tot = (inf + cav + art) * 1000;
    var player = (p1) ? battleData[dInd].p1 : battleData[dInd].p2;
    if(player.ready) 
      return message.reply("error, you already locked your decision.");
    if(tot > player.resources.population) 
      return message.reply("you tried to use " + tot.commafy() + " troops but you only own " + player.resources.population.commafy() + " population.");
    player.troops.inf = inf;
    player.troops.cav = cav;
    player.troops.art = art;
    let consump = inf * 20 + cav * 300 + art * 500;
    parsedData[index].money += player.costs;
    let cost = inf * 50 + cav * 100 + art * 1000;
    if(cost > parsedData[index].money) 
      return message.reply(`choosing this troops would cost you ${cost.commafy()} but you only own ${parsedData[index].money.commafy()}`);
    parsedData[index].resources.population -= tot;
    parsedData[index].money -= cost;
    player.costs = cost;
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
    fs.writeFileSync("activebattles.json", JSON.stringify(battleData, null, 2));
    message.reply(`succesfully set ${(inf*1000).commafy()} Infantry, ${(cav*1000).commafy()} Cavalry and ${(art*1000).commafy()} Artillery. Run this command with different parameters again if you want to change your division or use \`.ready\` to lock it.\n` + 
      `Your Troops will consume approximately ${consump.commafy()} food per round and cost you ${cost.commafy()}`);
  }

  else if(command == "troopinfo"){
    message.channel.send({embed: battle.troopInfoEmbed});
  }

  else if(command == "ready"){
    let battleData = JSON.parse(fs.readFileSync('activebattles.json'));
    var dInd = -1;
    var p1;
    for(let i = 0; i < battleData.length;i++){
      if(message.author.id == battleData[i].p1.id){
        p1 = true;
        dInd = i;
        break;
      }
      if(message.author.id == battleData[i].p2.id){
        p1 = false;
        dInd = i;
        break;
      }
    }
    if(dInd == -1) return message.reply("you're not fighting in any battle.");
    if(p1 && battleData[dInd].p1.ready || !p1 && battleData[dInd].p2.ready) return message.channel.send("You already confirmed that you're ready.");
    if(p1){
      battleData[dInd].p1.ready = true;
      fs.writeFileSync("activebattles.json", JSON.stringify(battleData, null, 2));
      if(battleData[dInd].p2.ready) battle.battleMatch(dInd);
      else {
        message.channel.send("Waiting for your opponent... \nPlease return to the previous channel, where the battle was started");
      }
    }
    else if(!p1){
      battleData[dInd].p2.ready = true;
      fs.writeFileSync("activebattles.json", JSON.stringify(battleData, null, 2));
      if(battleData[dInd].p1.ready) battle.battleMatch(dInd);
      else {
        message.channel.send("Waiting for your opponent... \nPlease return to the previous channel, where the battle was started");
      }
    }
    else {
      return message.reply("an error occured.");
    }
    client.channels.get(battleData[dInd].channelID).send(`${message.author.tag} is ready.`);
  }

  else if(command == "statistics"){
    let otherData = JSON.parse(fs.readFileSync('userdata.json'));
    fs.readFile("public/botstats.json", (err, data) =>{
      data = JSON.parse(data);
      if (err) throw err;
      message.channel.send({
        embed: {
          title: "Utopia statistics",
          color: parseInt(config.properties.embedColor),
          fields: [{
              name: "Servers:",
              value: `Currently I am active on ${data.activeServers} servers`
            },
            {
              name: "Users:",
              value: `Currently I have ${data.users} users.`
            },
            {
              name: "Commands run:",
              value: `I already executed ${data.commandsRun.commafy()} commands.`
            },
            {
              name: "Registered accounts:",
              value: `${otherData.length.commafy()} users already created an account!`
          }],
          footer: config.properties.footer,
          timestamp: new Date()
        }
      });
    });
  }
});


client.login(config.token);

function createUser(msg){
  let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
  try{
    for(var i = 0; i < parsedData.length; i++){
      if(msg.author.id == parsedData[i].id) return msg.reply("you already have an registered account!");
    }
  }
  catch {}
  let data = {
      tag: msg.author.tag,
      id: msg.author.id,
      money: 1000,
      lastWorked: 0,
      lastCrime: 0,
      autoping: true,
      payoutDMs: false,
      alliance: null,
      allianceRank: null,
      resources: {
        food: 10000,
        population: 1000
      },
      upgrades: {
        population: [],
        misc: [],
        battle: {
          iA: 0,
          iD: 0,
          cA: 0,
          cD: 0,
          aA: 0,
          aD: 0,
        }
      },
      inventory: [],
      duelsWon: 0,
      battleToken: 0,
      tokenUsed: false
  }
  parsedData.push(data);
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
  msg.reply("your account has been succesfully created.");
}

async function reminder(message, duration, preText, postText){
  message.channel.send(preText);
  await Sleep(duration);
  message.reply(postText);
}

function createStoreEmbed(message, type, args){
  /* p = population
  *  s = store (default)
  *  a = alliance
  *  b = battles
  */ 
  if(type == "p"){
    var user = searchUser(message);
    const newEmbed = {
      color: parseInt(config.properties.embedColor),
      title: 'Population store',
      description: 'These items are currently available in the population store!',
      thumbnail: {
        url: `${message.author.displayAvatarURL}`,
      },
      fields: [
        {
          name: 'Your balance',
          value: user.money.commafy(),
        },
        {
          name: '\u200b',
			    value: '\u200b'
        },
        {
          name: 'Invade the UK',
          value: '+5k population every 4h\nPrice: 100,000',
          inline: true,
        },
        {
          name: 'Advanced Equipment',
          value: '+10k population every 4h\nPrice: 250,000',
          inline: true,
        },
        {
          name: 'Invade Russia',
          value: '+15k population every 4h\nPrice: 500,000',
          inline: true,
        },
        {
          name: 'Expand your City',
          value: '+25k population every 4h\nPrice: 1,000,000',
          inline: true,
        },
        {
          name: 'Globalization',
          value: '+50k population every 4h\nPrice: 2,500,000',
          inline: true
        },
        {
          name: 'Recruit more Soldiers',
          value: '+200k population every 4h\nPrice: 10,000,000',
          inline: true,
        },
        {
          name: 'Invade the US',
          value: '+750k population every 4h\nPrice: 50,000,000',
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    };
    return newEmbed;
  }
  else if(type == "a"){
    var user = searchUser(message);
    var alliance = user.alliance;

    if(alliance == null){
      alliance = (typeof args[0] === "undefined") ? "You haven't joined an alliance yet." : `${message.mentions.users.first()} hasn't joined an alliance yet.`;
    }
    if(user.allianceRank == "M"){
      alliance = "".concat("Member of ", alliance);
    }
    else if(user.allianceRank == "C"){
      alliance = "".concat("Co-leader of ", alliance);
    }
    else if(user.allianceRank == "L"){
      alliance = "".concat("Leader of ", alliance);
    }
    alMoney = (alliance == null) ? "You haven't joined an alliance yet" : getAllianceByName(user.alliance).money.commafy();
    const newEmbed = {
      color: parseInt(config.properties.embedColor),
      title: 'Alliance store',
      description: 'These items are currently available in the alliance store! \n' +  
                "Note: only the leader and the Co-Leaders can buy alliance upgrades and they are used immediately. " +
                "The Leader gets 10% of the alliance income, the Co-Leaders 5% each. The rest is split among the members.",
      thumbnail: {
        url: `${message.author.displayAvatarURL}`,
      },
      fields: [
        {
          name: 'The balance of your alliance:',
          value: alMoney,
          inline: true,
        },
        {
          name: "Your alliance, your rank:",
          value: alliance,
          inline: true,
        },
        {
          name: '\u200b',
			    value: '\u200b'
        },
        {
          name: 'Arable farming',
          value: '+150k food for the alliance every 4h \nPrice: 100,000',
          inline: true,
        },
        {
          name: "Pastoral farming",
          value: "+1M food for the alliance every 4h \nPrice: 1,750,000",
          inline: true,
        },
        {
          name: "Mixed farming",
          value: "+5M food for the alliance every 4h \nPrice: 7,500,000",
          inline: true,
        }
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    };
    return newEmbed;
  }
  else if(type == "b"){
    var user = searchUser(message);
    const newEmbed = {
      color: parseInt(config.properties.embedColor),
      title: 'Store',
      description: 'Welcome to the battle store! Here you can buy Upgrades for you troops to use in a battle!\nItems are used immidiately and can be purchased **multiple** times.' ,
      thumbnail: {
        url: `${message.author.displayAvatarURL}`,
      },
      fields: [
        {
          name: "Your battle tokens:",
          value: user.battleToken,
        },
        {
          name: "Better armors",
          value: "+2 Def for your Infantry and +1 Def for your Cavalry\nPrice: 4 Battle tokens"
        },
        {
          name: "Harder Steel",
          value: "+1 on all Att and Def\nPrice: 10 Battle tokens"
        },
        {
          name: "Arabic horses",
          value: "+2 on Att and Def for Cavalry\nPrice: 6 Battle tokens"
        },
        {
          name: "Heavy Artillery",
          value: "+2 on Att and Def for Artillery\nPrice: 8 Battle tokens"
        },
        {
          name: "Better army management",
          value: "+1 on Infantry Att and Def, +1 on Artillery Att\nPrice: 6 Battle tokens"
        }
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    };
    return newEmbed;
  }
  else if(type == "s"){
    var user = searchUser(message);
    return {
      color: parseInt(config.properties.embedColor),
      title: 'Store',
      description: 'Welcome to the store! \n' +
                    "Note: All items can only be purchased **once**.",
      thumbnail: {
        url: `${message.author.displayAvatarURL}`,
      },
      fields: [
        {
          name: 'Population store',
          value: "Type `.store population` to view the population store",
        },
        {
          name: 'Alliance store',
          value: "Type `.store alliance` to view the alliance store", 
        },
        {
          name: "Battle store",
          value: "Type `.store battle` to view the battle store",
        },
        {
          name: 'A pack of food',
          value: 'Contains 50k food (added to your account immediately) \nPrice: 20,000',
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    }
  }
}

function payoutLoop(){
  let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
  let parsedConfigData = JSON.parse(fs.readFileSync("config.json"));
  let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
  var payoutChannel = client.channels.get(parsedConfigData.payoutChannel);
  //while(true){
    /*var tdiff = Math.floor(Date.now() / 1000) - parsedConfigData.lastPopulationWorkPayout;
    if(tdiff < 100){
      Sleep((100 - tdiff) * 1000);
    }
    parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    rawdataAlliances = fs.readFileSync('alliances.json');
     parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));*/
    //payoutChannel.send("Processing started...");
    let l = parsedData.length;
    for(var i = 0; i < l; i++){
      if(parsedData[i].upgrades.population.includes("UK"))
        parsedData[i].resources.population += 5000;
      if(parsedData[i].upgrades.population.includes("AE"))
        parsedData[i].resources.population += 10000;
      if(parsedData[i].upgrades.population.includes("RU"))
        parsedData[i].resources.population += 15000;
      if(parsedData[i].upgrades.population.includes("EC")) 
        parsedData[i].resources.population += 25000;
      if(parsedData[i].upgrades.population.includes("GL")) 
        parsedData[i].resources.population += 50000
      if(parsedData[i].upgrades.population.includes("MS"))
        parsedData[i].resources.population += 200000;
      if(parsedData[i].upgrades.population.includes("US"))
        parsedData[i].resources.population += 750000;
      if(parsedData[i].payoutDMs){
        try{
          client.users.get(parsedData[i].id.toString()).send("You have succesfully gained population from your upgrades!");
        }
        catch(e){
          console.log(e +"\n" + parsedData[i].tag);
        }
      }
      if(parsedData[i].resources.food == null) parsedData[i].resources.food = 0;
    } 
    /*payoutChannel.send("You have succesfully gained population from your upgrades!");
    payoutChannel.send("Processing started...");*/
    payoutChannel.send({
      embed: {
        color: 0x00FF00,
        title: "You have succesfully gained population from your upgrades!",
        timestamp: new Date()
      }
    });
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedDataAlliances[i].upgrades.af > 0){
        for(var j = 0; j < parsedData.length; j++){
          if(parsedData[j].alliance == parsedDataAlliances[i].name){
            if(parsedData[j].id == parsedDataAlliances[i].leader.id){
              parsedData[j].resources.food += parsedDataAlliances[i].upgrades.af * 15000 + Math.floor(((parsedDataAlliances[i].upgrades.af * 120000)/(parsedDataAlliances[i].members.length + parsedDataAlliances[i].coLeaders.length + 1)));
            }
            else if(parsedDataAlliances[i].members.length == 0){
              if(parsedDataAlliances[i].coLeaders.includes(parsedData[j].id)){
                parsedData[j].resources.food += parsedDataAlliances[i].upgrades.af * 7500 + Math.floor(((parsedDataAlliances[i].upgrades.af * 120000)/(parsedDataAlliances[i].members.length + parsedDataAlliances[i].coLeaders.length + 1)));
              }
              if(parsedDataAlliances[i].members.includes(parsedData[j].id)){
                parsedData[j].resources.food += Math.floor(((parsedDataAlliances[i].upgrades.af * 120000)/(parsedDataAlliances[i].members.length + parsedDataAlliances[i].coLeaders.length + 1)));
              }
            }
          }
        }
      }
      if(parsedDataAlliances[i].upgrades.pf > 0){
        for(var j = 0; j < parsedData.length; j++){
          if(parsedData[j].alliance == parsedDataAlliances[i].name){
            if(parsedData[j].id == parsedDataAlliances[i].leader.id){
              parsedData[j].resources.food += parsedDataAlliances[i].upgrades.pf * 100000 + Math.floor(((parsedDataAlliances[i].upgrades.pf * 800000)/(parsedDataAlliances[i].members.length + parsedDataAlliances[i].coLeaders.length + 1)));
            }
          else if(parsedDataAlliances[i].members.length == 0){
              if(parsedDataAlliances[i].coLeaders.includes(parsedData[j].id)){
                parsedData[j].resources.food += parsedDataAlliances[i].upgrades.pf * 50000 + Math.floor(((parsedDataAlliances[i].upgrades.pf * 800000)/(parsedDataAlliances[i].members.length + parsedDataAlliances[i].coLeaders.length + 1)));
              }
              if(parsedDataAlliances[i].members.includes(parsedData[j].id)){
                parsedData[j].resources.food += Math.floor(((parsedDataAlliances[i].upgrades.pf * 800000)/(parsedDataAlliances[i].members.length + parsedDataAlliances[i].coLeaders.length + 1)));
              }
            }
          }
        }
      }
      if(parsedDataAlliances[i].upgrades.mf > 0){
        for(var j = 0; j < parsedData.length; j++){
          if(parsedData[j].alliance == parsedDataAlliances[i].name){
            if(parsedData[j].id == parsedDataAlliances[i].leader.id){
              parsedData[j].resources.food += parsedDataAlliances[i].upgrades.mf * 500000 + Math.floor(((parsedDataAlliances[i].upgrades.mf * 4000000)/(parsedDataAlliances[i].members.length + parsedDataAlliances[i].coLeaders.length + 1)));
            }
            else if(parsedDataAlliances[i].members.length == 0){
              if(parsedDataAlliances[i].coLeaders.includes(parsedData[j].id)){
                parsedData[j].resources.food += parsedDataAlliances[i].upgrades.mf * 250000 + Math.floor(((parsedDataAlliances[i].upgrades.mf * 4000000)/(parsedDataAlliances[i].members.length + parsedDataAlliances[i].coLeaders.length + 1)));
              }
              if(parsedDataAlliances[i].members.includes(parsedData[j].id)){
                parsedData[j].resources.food += Math.floor(((parsedDataAlliances[i].upgrades.mf * 4000000)/(parsedDataAlliances[i].members.length + parsedDataAlliances[i].coLeaders.length + 1)));
              }
            }
          }
        }
      }
    }
    //payoutChannel.send("You have succesfully gained food from your alliance upgrades!");
    payoutChannel.send({
      embed: {
        color: 0x00FF00,
        title: "You have succesfully gained food from your alliance upgrades!",
        timestamp: new Date()
      }
    });
    parsedConfigData.lastPayout = Math.floor(Date.now() / 1000);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
    fs.writeFileSync("config.json", JSON.stringify(parsedConfigData, null, 2))
    fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
    //await Sleep(14400000);
    setTimeout(payoutLoop, (1000 * 14400));
  }
//}

async function populationWorkLoop(){
  let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
  let parsedConfigData = JSON.parse(fs.readFileSync("config.json"));
  var payoutChannel = client.channels.get(parsedConfigData.payoutChannel);
  //while(true){
    /*var tdiff = Math.floor(Date.now() / 1000) - parsedConfigData.lastPopulationWorkPayout;
    if(tdiff < 43200){
      Sleep((43200 - tdiff) * 1000);
    }*/
    parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    let l = parsedData.length;
    for(let i = 0; i < l; i++){
      pop = parsedData[i].resources.population;
      const consumption = Math.floor(pop * (2 + getBaseLog(10, getBaseLog(10, getBaseLog(3, pop)))));
      if(consumption > parsedData[i].resources.food){
        try {
          client.users.get(parsedData[i].id.toString()).send("**Alert**: Your population will die within in the next hour if you don't buy more food!");
        }
        catch (e){
          console.log(e + `\n${parsedData[i].tag}`);
        }
      }
    }
    await Sleep(3600000);
    
    parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    //payoutChannel.send("Processing started...");
    l = parsedData.length;
    for(var i = 0; i < l; i++){
      pop = parsedData[i].resources.population;
      parsedData[i].money += Math.floor(pop / rangeInt(8, 15));
      const consumption = Math.floor(pop * (2 + getBaseLog(10, getBaseLog(10, getBaseLog(3, pop)))));
      if(consumption > parsedData[i].resources.food){
        const diff = consumption - parsedData[i].resources.food;
        parsedData[i].resources.food = 0;
        try {
          client.users.get(parsedData[i].id.toString()).send("**Alert**: You don't have any food left, your population is dying!");
        }
        catch {}
        if(diff > pop){
          parsedData[i].resources.population = 0;
          try{
            client.users.get(parsedData[i].id.toString()).send("**Alert**: All of your population died");
          }
          catch {}
        }
        else {
          parsedData[i].resources.population -= diff;
        }
      }
      else {
        parsedData[i].resources.food -= consumption;
      }
      if(parsedData[i].payoutDMs){
        try {
          client.users.get(parsedData[i].id.toString()).send("You have succesfully gained money through the work of your population!\nYour battle token cooldown has been reset!");
        }
        catch {}
      }
      //console.log("Factor: " + (2 + getBaseLog(10, getBaseLog(10, getBaseLog(3, pop)))) + "(" + parsedData[i].tag + ")");
      parsedData[i].tokenUsed = false;
      if(parsedData[i].resources.food == null) parsedData[i].resources.food = 0;
    } 
    //payoutChannel.send("You have succesfully gained money through the work of your population!\nYour battle token cooldown has been reset!");
    payoutChannel.send({
      embed: {
        color: 0x00FF00,
        title: "You have succesfully gained money through the work of your population!\nYour battle token cooldown has been reset!",
        timestamp: new Date()
      }
    });
    parsedConfigData.lastPopulationWorkPayout = Math.floor(Date.now() / 1000);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
    fs.writeFileSync("config.json", JSON.stringify(parsedConfigData, null, 2))
    //await Sleep(43200000);
    setTimeout(populationWorkLoop, 39600000); //11h
  }
//}

function getLeaderboardList(type){
  let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
  let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
  if(type == "p"){
    return parsedData.sort((a, b) => parseFloat(b.resources.population) - parseFloat(a.resources.population));
  }
  else if (type == "f"){
    return parsedData.sort((a, b) => parseFloat(b.resources.food) - parseFloat(a.resources.food));
  }
  else if(type == "a"){
    return parsedDataAlliances.sort((a, b) => parseFloat(b.money) - parseFloat(a.money));
  }
  else if(type == "w"){
    return parsedData.sort((a,b) => parseFloat(b.duelsWon) - parseFloat(a.duelsWon));
  }
  else {
    return parsedData.sort((a, b) => parseFloat(b.money) - parseFloat(a.money));
  }
}

function generateLeaderboardEmbed(type, page, message){
  var p = page - 1;
  var lbEmbed;
  if(type == "p"){
    var lb = getLeaderboardList("p");
    var index = lb.findIndex(function(item, i){
      return item.id == message.author.id;
    });
    lbEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Leaderboard sorted by population, page ", page, " of ", Math.floor(lb.length / 10) + 1),
      description: `Your rank: \`#${index+1}\``,
      fields: leaderBoardEmbedFields(p, lb, "p"),
      timestamp: new Date(),
      footer: config.properties.footer,
    };
  }
  else if(type == "f"){
    var lb = getLeaderboardList("f");
    var index = lb.findIndex(function(item, i){
      return item.id == message.author.id;
    });
    lbEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Leaderboard sorted by food, page ", page, " of ", Math.floor(lb.length / 10) + 1),
      description: `Your rank: \`#${index+1}\``,
      fields: leaderBoardEmbedFields(p, lb, "f"),
      timestamp: new Date(),
      footer: config.properties.footer,
    }
  }

  else if(type == "a"){
    var lb = getLeaderboardList("a");
    lbEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Leaderboard sorted by money, page ", page, " of ", Math.floor(lb.length / 10) + 1),
      fields: leaderBoardEmbedFields(p, lb, "a"),
      timestamp: new Date(),
      footer: config.properties.footer,
    };
  }
  else if(type == "w"){
    var lb = getLeaderboardList("w");
    var index = lb.findIndex(function(item, i){
      return item.id == message.author.id;
    });
    lbEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Leaderboard sorted by wins, page ", page, " of ", Math.floor(lb.length / 10) + 1),
      description: `Your rank: \`#${index+1}\``,
      fields: leaderBoardEmbedFields(p, lb, "w"),
      timestamp: new Date(),
      footer: config.properties.footer,
    };
  }
  else {
    var lb = getLeaderboardList("m");
    var index = lb.findIndex(function(item, i){
      return item.id == message.author.id;
    });
    lbEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Leaderboard sorted by money, page ", page, " of ", Math.floor(lb.length / 10) + 1),
      description: `Your rank: \`#${index+1}\``,
      fields: leaderBoardEmbedFields(p, lb, "m"),
      timestamp: new Date(),
      footer: config.properties.footer,
    };
  }
  return lbEmbed;
}

function leaderBoardEmbedFields(p, lb, type){
  var h = ((lb.length - p * 10) > 10) ? 10 : lb.length - p * 10;
  var fields = [];
  if(type == "p"){
    for(var i = 0; i < h; i++){
      field = {
        name: "`#" + ((i + 1) + (p * 10)) + "` - " + lb[i + p * 10].tag,
        value: lb[i + p * 10].resources.population.commafy() + " population"
      }
      fields.push(field);
    }
  }
  else if(type == "a"){
    for(var i = 0; i < h; i++){
      field = {
        name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p *10].name,
        value: lb[i + p * 10].money.commafy() + " coins",
      }
      fields.push(field);
    }
  }
  else if(type == "f"){
    for(var i = 0; i < h; i++){
      field = {
        name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p *10].tag,
        value: lb[i + p * 10].resources.food.commafy() + " food",
      }
      fields.push(field);
    }
  }
  else if(type == "w"){
    for(var i = 0; i < h; i++){
      field = {
        name: "`#" + ((i + 1) + (p * 10)) + "` " + lb[i + p *10].tag,
        value: lb[i + p * 10].duelsWon.commafy() + " wins",
      }
      fields.push(field);
    }
  }
  else {
    for(var i = 0; i < h; i++){
      field = {
        name: "`#" + ((i + 1) + (p * 10)) + "` - " + lb[i + p * 10].tag,
        value: lb[i + p * 10].money.commafy() + " coins"
      }
      fields.push(field);
    }
  }
  return fields;
}

function buyItem(item, index, price){
  var parsedData = JSON.parse(fs.readFileSync('userdata.json'));

  if(parsedData[index].upgrades.population.includes(item) || parsedData[index].upgrades.misc.includes(item))
    return "you already own that item!";

  if(parsedData[index].money >= price){
    parsedData[index].money -= price;
    populationUpgrades = ["UK", "AE", "RU", "EC", "GL", "MS", "US"];
    if(populationUpgrades.includes(item)){
      parsedData[index].upgrades.population.push(item);
    }
    else {
      parsedData[index].upgrades.misc.push(item);
    }
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
    switch(item){
      case "UK":
        return "you succesfully invaded the UK.";
      case "AE":
        return "you succesfully used the Advanced Equipment.";
      case "RU":
        return "you succesfully invaded Russia.";
      case "EC":
        return "you succesfully expanded your city.";
      case "GL":
        return "you succesfully discovered globalization."
      case "MS":
        return "you succesfully recruited more soldiers.";
      case "US":
        return "you succesfully invaded the US";
      default:
        return "Error!";
    }
  }
  return "You don't have enough money to buy that item.";
}

function buyBattleUpgrade(index, iA, iD, cA, cD, aA, aD, price){
  var parsedData = JSON.parse(fs.readFileSync('userdata.json'));
  if(price > parsedData[index].battleToken) return `this items costs ${price} Battle tokens! You only own ${parsedData[index].battleToken}`;
  b = parsedData[index].upgrades.battle;
  b.iA += iA;
  b.iD += iD;
  b.cA += cA;
  b.cD += cD;
  b.aA += aA;
  b.aD += aD;
  parsedData[index].battleToken -= price;
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  return "you succesfully bought the upgrade!";
}

async function giveawayCheck(index){
  var gas = JSON.parse(fs.readFileSync("giveaways.json"));
  var giveaway = gas[index];
  const channel = client.channels.get(giveaway.channelid);
  var voteCollection;

  await Sleep(giveaway.endingAt - Date.now());

  let message =  await channel.fetchMessage(giveaway.embedId).then(msg => {
    voteCollection = msg.reactions;
  });

  giveaway.users = await voteCollection.first().users.array();
  giveaway.users.shift();
  console.log(giveaway.users);
  let x = await giveaway.users.getRandom(giveaway.winners);
  console.log(x);
  var winnerMentions = `<@${x[0].id}>`;
  for(let i = 1; i < x.length; i++){
    winnerMentions += `<@${x[i].id}>`;
  }
  channel.send({
    embed: {
      color: parseInt(config.properties.embedColor),
      title: "Giveaway ended",
      description: `Congratulations ${winnerMentions}, you won the ${giveaway.priceAm.commafy()} ${giveaway.priceCur}`,
      footer: config.properties.footer,
      timestamp: new Date()
    }
  });

  var parsedData = JSON.parse(fs.readFileSync("userdata.json"));
  for(let i = 0; i < x.length; i++){
    for(let j = 0; j < parsedData.length; j++){
      if(parsedData[j].id == x[i].id){
        if(giveaway.priceCur == "food"){
          parsedData[j].resources.food += parseInt(giveaway.priceAm);
        }
        else if(giveaway.priceCur == "population"){
          parsedData[j].resources.population += parseInt(giveaway.priceAm);
        }
        if(giveaway.priceCur == "money"){
          parsedData[j].money += parseInt(giveaway.priceAm);
        }
      }
    }
  }
  console.log(giveaway);
  gas.splice(index, 1);
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  fs.writeFileSync("giveaways.json", JSON.stringify(gas, null, 2));
}