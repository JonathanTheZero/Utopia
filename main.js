const Discord = require('discord.js');
const editJsonFile = require("edit-json-file")
const config = require("./config.json");
const fs = require("fs");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//loading the settings
console.log("My prefix is", config.prefix)

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.users.size} users on ${client.guilds.size} servers`);
  payoutLoop();
});


//join or leaving servers

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.users.size} users on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.users.size} users on ${client.guilds.size} servers`);
});


//answering messages/DMs
client.on("message", async message => {
  // ignore bots
  if(message.author.bot) return;
  
  //ignoring messages that don't start with the prefix
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick" || command === "yeet" || command == "YEET") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
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
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  if(command === "create"){
    createUser(message);
  }

  if(command == "leaderboard" || command == "lb"){
    
    if(args[0] == "2"){
      generateLeaderboardEmbed(2);
    }
    message.channel.send({ embed: generateLeaderboardEmbed(1) });
  }

  if(command == "buy"){
    let rawdataUser = fs.readFileSync('userdata.json');
    var parsedData = JSON.parse(rawdataUser);
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      message.reply("you haven't created an account yet, please use the `create` command.")
    }
    if(args[0] == "UK"|| (args[0] == "Invade") && args[1] == "the" && args[2] == "UK"){
      for(var i = 0; i < parsedData[index].inventory.length; i++){
        if(parsedData[index].inventory[i] == "UK"){
          message.reply("you already bought that item!");
          return;
        }
      }
      if(parsedData[index].money >= 100000){
        parsedData[index].money -= 100000;
        item = "UK";
        parsedData[index].inventory.push(item);
        message.reply("you successfully invaded the UK.");
      }
    }
    else if(args[0] == "Equipement"|| (args[0] == "Advanced") && args[1] == "Equipement"){
      for(var i = 0; i < parsedData[index].inventory.length; i++){
        if(parsedData[index].inventory[i] == "AE"){
          message.reply("you already bought that item!");
          return;
        }
      }
      if(parsedData[index].money >= 250000){
        parsedData[index].money -= 250000;
        item = "AE";
        parsedData[index].inventory.push(item);
        message.reply("you successfully bought Advanced Equipement.");
      }
    }
    else if(args[0] == "Russia"|| (args[0] == "Invade") && args[1] == "Russia"){
      for(var i = 0; i < parsedData[index].inventory.length; i++){
        if(parsedData[index].inventory[i] == "RU"){
          message.reply("you already bought that item!");
          return;
        }
      }
      if(parsedData[index].money >= 500000){
        parsedData[index].money -= 500000;
        item = "RU";
        parsedData[index].inventory.push(item);
        message.reply("you successfully invaded Russia.");
      }
    }
    else if(args[0] == "City"|| (args[0] == "Expand") && args[1] == "your" && args[2] == "City"){
      for(var i = 0; i < parsedData[index].inventory.length; i++){
        if(parsedData[index].inventory[i] == "EC"){
          message.reply("you already bought that item!");
          return;
        }
      }
      if(parsedData[index].money >= 1000000){
        parsedData[index].money -= 1000000;
        item = "EC";
        parsedData[index].inventory.push(item);
        message.reply("you successfully expandecd your city.");
      }
    }
    else if(args[0] == "Soldiers"|| (args[0] == "Recruit") && args[1] == "more" && args[2] == "Soldiers"){
      for(var i = 0; i < parsedData[index].inventory.length; i++){
        if(parsedData[index].inventory[i] == "MS"){
          message.reply("you already bought that item!");
          return;
        }
      }
      if(parsedData[index].money >= 10000000){
        parsedData[index].money -= 10000000;
        item = "MS";
        parsedData[index].inventory.push(item);
        message.reply("you successfully recruited more soldiers.");
      }
    }
    else if(args[0] == "US"|| (args[0] == "Invade") && args[1] == "the" && args[2] == "US"){
      for(var i = 0; i < parsedData[index].inventory.length; i++){
        if(parsedData[index].inventory[i] == "US"){
          message.reply("you already bought that item!");
          return;
        }
      }
      if(parsedData[index].money >= 50000000){
        parsedData[index].money -= 50000000;
        item = "US";
        parsedData[index].inventory.push(item);
        message.reply("you successfully expandecd your city.");
      }
    }
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  if(command == "use"){
    let rawdataUser = fs.readFileSync('userdata.json');
    var parsedData = JSON.parse(rawdataUser);
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      message.reply("you haven't created an account yet, please use the `create` command.")
    }
    if(args[0] == "UK"|| (args[0] == "Invade") && args[1] == "the" && args[2] == "UK"){
      for(var i = 0; i < parsedData[index].inventory.length; i++){
        if(parsedData[index].inventory[i] == "UK"){
          message.reply("you succesfully used your item!");
          parsedData[index].inventory.slice(i, 1);
          parsedData[index].upgrades.UK = true;
          if(guild.roles.find("name", "UK")){
            //TBA
          }
          return;
        }
      }
      message.reply("you don't own that item.")
    }
    else if(args[0] == "Equipement"|| (args[0] == "Advanced") && args[1] == "Equipement"){
    }
    else if(args[0] == "Russia"|| (args[0] == "Invade") && args[1] == "Russia"){
    }
    else if(args[0] == "City"|| (args[0] == "Expand") && args[1] == "your" && args[2] == "City"){
    }
    else if(args[0] == "Soldiers"|| (args[0] == "Recruit") && args[1] == "more" && args[2] == "Soldiers"){
    }
    else if(args[0] == "US"|| (args[0] == "Invade") && args[1] == "the" && args[2] == "US"){
    }
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  if(command === "me" || command === "stats"){
    var user = searchUser(message);
    var alliance = user.alliance;
    if(alliance == null){
      alliance = "You haven't joined an alliance yet."
    }
    const meEmbed = {
      color: 0x2222ee,
      title: `Data for ${message.author.tag}`,
      thumbnail: {
        url: `${message.author.avatarURL}`,
      },
      fields: [
        {
          name: 'Money:',
          value: user.money.commafy(),
          inline: true,
        },
        {
          name: 'Food:',
          value: user.ressources.food.commafy(),
          inline: true,
        },
        {
          name: 'Alliance',
          value: alliance,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Developed by Zero#0659',
        icon_url: "https://cdn.discordapp.com/avatars/393137628083388430/859a09db38539b817b67db345274f653.webp?size=512",
      },
    }; 
    message.channel.send({ embed: meEmbed });
  }

  if(command === "help"){
    message.reply("*TBA*");
  }

  if(command === "store"){
    var storeEmbed = null;
    if(args[0] == "population" || args[0] == "p"){
      storeEmbed = createStoreEmbed(message, "p");
    }
    else {
      storeEmbed = createStoreEmbed(message, "s");
    }
    if(storeEmbed != null) message.channel.send({ embed: storeEmbed });
  }

  if(command == "disableping"){
    let rawdataUser = fs.readFileSync('userdata.json');
    let parsedData = JSON.parse(rawdataUser);
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        parsedData[i].autoping = false;
        message.reply("you successfully disabled autopings.")
        break;
      }
    }
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  if(command === "work"){
    let rawdataUser = fs.readFileSync('userdata.json');
    let parsedData = JSON.parse(rawdataUser);
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        if(Math.floor(Date.now() / 1000) - parsedData[i].lastWorked < 1800){
          message.reply("".concat("You can work again in ", new Date((1800 - (Math.floor(Date.now() / 1000) - parsedData[i].lastWorked)) * 1000).toISOString().substr(11, 8)));
        }
        else {
          let oldBalance = parseInt(parsedData[i].money);
          var produced = Math.floor(Math.random() * 10000);
          var newBalance = oldBalance + produced;
          parsedData[i].money = newBalance;
          parsedData[i].lastWorked = Math.floor(Date.now() / 1000);
          fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
          message.reply("".concat("You successfully worked and gained ", produced, " coins. Your new balance is ", newBalance, " coins."));
          if(parsedData[i].autoping == true){
            reminder(message, "w");
          }
          break;
        }
      }
    }
  }

  if(command === "crime"){
    let rawdataUser = fs.readFileSync('userdata.json');
    let parsedData = JSON.parse(rawdataUser);
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        if(Math.floor(Date.now() / 1000) - parsedData[i].lastCrime < 14400){
          message.reply("".concat("You can commit a crime again in ", new Date((14400 - (Math.floor(Date.now() / 1000) - parsedData[i].lastCrime)) * 1000).toISOString().substr(11, 8)));
        }
        else {
          let oldBalance = parseInt(parsedData[i].money);
          var produced;
          if(Math.floor(Math.random() * 99) < 5){
            produced = 50000;
          }
          else {
            produced = Math.floor(-1 * (20000 * Math.random() * 0.02));
          }
          var newBalance = oldBalance + produced;
          parsedData[i].money = newBalance;
          parsedData[i].lastCrime = Math.floor(Date.now() / 1000);
          fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
          if(produced > 1){
            message.reply("".concat("You successfully worked and gained ", produced, " coins. Your new balance is ", newBalance, " coins."));
          }
          else{
            message.reply("".concat("You were unsuccesful and lost ", produced, " coins. Your new balance is ", newBalance, " coins."));
          }
          if(parsedData[i].autoping == true){
            reminder(message, "c");
          }
          break;
        }
      }
    }    
  }
  

});


client.login(config.token);

function createUser(msg){
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  try{
    for(var i = 0; i < parsedData.length; i++){
      if(msg.author.id == parsedData[i].id){
        msg.reply("you already have an registered account!");
        return;
      }
    }
  }
  catch {

  }
  
  let data = {
      name: msg.author.username,
      tag: msg.author.tag,
      id: msg.author.id,
      money: 1000,
      lastWorked: 0,
      lastCrime: 0,
      autoping: true,
      alliance: null,
      ressources: {
        food: 1000,
        population: 1000
      },
      upgrades: {
        population: {
          VIP: false,
          UK: false,
          AE: false,
          RU: false,
          EC: false,
          MS: false,
          US: false
        }
      },
      inventory: {

      }
  }
  
  parsedData.push(data);
  
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
  msg.reply("your account has been succesfully created.");
  console.log(data)
}

async function reminder(msg, type){
  var rawdataUser = fs.readFileSync('userdata.json');
  var parsedData = JSON.parse(rawdataUser);
  if(type == "w"){
    msg.channel.send("I'll remind you in 30 minutes that you can work again.");
    await Sleep(1800000);
    msg.reply("Reminder: Work again");
    for(var i = 0; i < parsedData.length; i++){
      if(msg.author.id == parsedData[i].id){
        parsedData[i].lastWorked = Math.floor(Date.now() / 1000);
        break;
      }
    }
  }
  else if(type == "c"){
    msg.channel.send("I'll remind you in 4h to commit a crime again.");
    await Sleep(14400000);
    msg.reply("Reminder: Commit a crime.");
    for(var i = 0; i < parsedData.length; i++){
      if(message.author.id == parsedData[i].id){
        parsedData[i].lastCrime = Math.floor(Date.now() / 1000);
        break;
      }
    }
  }
  else {
    console.log("Error, no valid parameter for the reminder function.");
  }
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
}

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function searchUser(msg){
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  for(var i = 0; i < parsedData.length; i++){
    if(msg.author.id == parsedData[i].id){
      return parsedData[i];
    }
  }
}

Number.prototype.commafy = function () {
  return String(this).commafy();
};

String.prototype.commafy = function () {
  return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
      return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
  });
};

function createStoreEmbed(message, type){
  /* p = populations
  *  s = store (defualt)
  *
  */
  if(type == "p"){
    var user = searchUser(message);
    const newEmbed = {
      color: 0x2222EE,
      title: 'Population store',
      description: 'These items are currently avialable in the population store!',
      thumbnail: {
        url: `${message.author.avatarURL}`,
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
          value: '+5000 population every 4h \n Price: 100,000',
          inline: true,
        },
        {
          name: 'Advanced Equipement',
          value: '+5000 population every 4h \n Price: 250,000',
          inline: true,
        },
        {
          name: 'Invade Russia',
          value: '+10,000 population every 4h \n Price: 500,000',
          inline: true,
        },
        {
          name: 'Expand your City',
          value: '+25,000 population every 4h \n Price: 1,000,000',
          inline: true,
        },
        {
          name: 'Recruit more Soldiers',
          value: '+500,000 population every 4h \u200b \u200b \n Price: 10,000,000',
          inline: true,
        },
        {
          name: 'Invade the US',
          value: '+2,000,000 population every 4h \n Price: 50,000,000',
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Developed by Zero#0659',
        icon_url: "https://cdn.discordapp.com/avatars/393137628083388430/859a09db38539b817b67db345274f653.webp?size=512",
      },
    };
    return newEmbed;
  }
  else if(type == "s"){
    var user = searchUser(message);
    const newEmbed = {
      color: 0x2222EE,
      title: 'Store',
      description: 'Welcome to the store!',
      thumbnail: {
        url: `${message.author.avatarURL}`,
      },
      fields: [
        {
          name: 'Population store',
          value: "".concat('Type `', config.prefix, "store population` to view the population store"),
        },
        {
          name: 'Food store',
          value: 'Some value here',
          inline: true,
        },
        {
          name: 'Inline field title',
          value: 'Some value here',
          inline: true,
        },
        {
          name: 'Inline field title',
          value: 'Some value here',
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Developed by Zero#0659',
        icon_url: "https://cdn.discordapp.com/avatars/393137628083388430/859a09db38539b817b67db345274f653.webp?size=512",
      },
    };
    return newEmbed;
  }
}

async function payoutLoop(){
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  let rawdataConfig = fs.readFileSync("config.json");
  let parsedConfigData = JSON.parse(rawdataConfig);
  var payoutChannel = client.channels.get(parsedConfigData.payoutChannel);
  while(true){
    if(Math.floor(Date.now() / 1000) - parsedConfigData.lastPayout < 14400){
      await Sleep((Math.floor(Date.now() / 1000) - parsedConfigData.lastPayout) * 1000);
    }
    payoutChannel.send("Payouts are being processed....");
    for(var i = 0; i < parsedData.length; i++){
      if(parsedData[i].upgrades.population.UK){
        parsedData[i].money += 5000;
      }
      if(parsedData[i].upgrades.population.Advanced){
        parsedData[i].money += 5000;
      }
      if(parsedData[i].upgrades.population.Russia){
        parsedData[i].money += 10000;
      }
      if(parsedData[i].upgrades.population.Expanded){
        parsedData[i].money += 25000;
      }
      if(parsedData[i].upgrades.population.Soldiers){
        parsedData[i].money += 500000;
      }
      if(parsedData[i].upgrades.population.US){
        parsedData[i].money += 2000000;
      }
    } 
    payoutChannel.send("Payouts have been given out!");
    parsedConfigData.lastPayout = Math.floor(Date.now() / 1000);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
    fs.writeFileSync("config.json", JSON.stringify(parsedConfigData, null, 2))
    await Sleep(14400000);
  }
}

function getLeaderboardList(){
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  sortedData = parsedData.sort((a, b) => parseFloat(b.money) - parseFloat(a.money));
  return sortedData;
}

function generateLeaderboardEmbed(page){
  p = page - 1;
  var lb = getLeaderboardList();
  const lbEmbed = {
    color: 0x2222EE,
    title: "".concat("Leaderboard page ", page),
    fields: leaderBoardEmbedFields(p, lb),
    timestamp: new Date(),
    footer: {
      text: 'Developed by Zero#0659',
      icon_url: "https://cdn.discordapp.com/avatars/393137628083388430/859a09db38539b817b67db345274f653.webp?size=512",
    },
  };
  return lbEmbed;
}

function leaderBoardEmbedFields(p, lb){
  var h = ((lb.length - p * 10) > 10) ? 10 : lb.length - p * 10;
  var fields = [];
  for(var i = p * 10; i < h; i++){
    field = {
      name: "#".concat(i + 1),
      value: "".concat(lb[i + p * 10].tag, " - ", lb[i + p * 10].money.commafy(), " coins")
    }
    fields.push(field);
  }
  return fields;
}

/*
 {
        name: "#1",
        value: "".concat(lb[0 + p * 10].tag, " - ", lb[0 + p * 10].money.commafy(), " coins"),
      },
      {
        name: "#2",
        value: "".concat(lb[1 + p * 10].tag, " - ", lb[1 + p * 10].money.commafy(), " coins"),
      },
      {
        name: "#3",
        value: "".concat(lb[2 + p * 10].tag, " - ", lb[2 + p * 10].money.commafy(), " coins"),
      },
*/