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
        icon_url: `${message.author.avatarURL}`,
      },
    }; 
    message.channel.send({ embed: meEmbed });
  }

  if(command === "help"){
    message.reply("*TBA*");
  }

  if(command === "store"){
    storeEmbed = createStoreEmbed(message);
    message.channel.send({ embed: storeEmbed });
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
          message.reply("".concat("You can work again in ", new Date(Math.floor(Date.now() / 1000) * 1000).toISOString().substr(11, 8)));
        }
        else {
          let oldBalance = parseInt(parsedData[i].money);
          var produced = Math.floor(Math.random() * 10000);
          var newBalance = oldBalance + produced;
          parsedData[i].money = newBalance;
          parsedData[i].lastWorked = true;
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
        food: 1000
      },
      upgrades: {
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

function createStoreEmbed(message){
  var user = searchUser(message);
  const newEmbed = {
    color: 0x2222EE,
    title: 'Store',
    description: 'These items are currently avialable in the store!',
    thumbnail: {
      url: `${message.author.avatarURL}`,
    },
    fields: [
      {
        name: 'Your balance',
        value: user.money.commafy(),
      },
      {
        name: 'Access to VIP giveaways',
        value: "Price: 50,000",
        inline: true,
      },
      {
        name: 'Invade the UK (+5000/every 4 hours)',
        value: 'Price: 100,000',
        inline: true,
      },
      {
        name: 'Inline field title',
        value: 'Some value here',
        inline: true,
      },
    ],
    image: {
      url: 'https://i.imgur.com/wSTFkRM.png',
    },
    timestamp: new Date(),
    footer: {
      text: 'Developed by Zero#0659',
      icon_url: `${message.author.avatarURL}`,
    },
  };
  return newEmbed;
}