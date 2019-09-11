const Discord = require('discord.js');
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
  populationWorkLoop();
});


//join or leaving servers

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.users.size} users on ${client.guilds.size} servers`);
  
  
  const roleUKexists = (guild.roles.find(role => role.name === "UK") == null) ? false : true;
  const roleAEexists = (guild.roles.find(role => role.name === "Advanced Equipement") == null) ? false : true;
  const roleRUexists = (guild.roles.find(role => role.name === "Russia") == null) ? false : true;
  const roleECexists = (guild.roles.find(role => role.name === "Expanded City") == null) ? false : true;
  const roleMSexists = (guild.roles.find(role => role.name === "More Soldiers") == null) ? false : true;
  const roleUSexists = (guild.roles.find(role => role.name === "US") == null) ? false : true;
  const roleVIPSexists = (guild.roles.find(role => role.name === "VIP") == null) ? false : true;
  
 if(!roleUKexists) {
  guild.createRole({name: 'UK',})
    .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
    .catch(console.error)
  }
  if(!roleAEexists) {
    guild.createRole({name: 'Advanced Equipement',})
      .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
      .catch(console.error)
  }
  if(!roleRUexists) {
    guild.createRole({name: 'Russia',})
      .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
      .catch(console.error)
  }
  if(!roleECexists) {
    guild.createRole({name: 'Expanded City',})
      .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
      .catch(console.error)
  }
  if(!roleMSexists) {
    guild.createRole({name: 'More Soldiers',})
      .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
      .catch(console.error)
  }
  if(!roleUSexists) {
    guild.createRole({name: 'US',})
      .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
      .catch(console.error)
  }
  if(!roleVIPSexists) {
    guild.createRole({name: 'VIP',})
      .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
      .catch(console.error)
  }
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
    var lbEmbed;
    if(args[0] == "p" || args[0] == "population"){
      try {
        lbEmbed = (typeof args[1] === "undefined") ? generateLeaderboardEmbed("p", 1) : generateLeaderboardEmbed("p", args[1]);
      }
      catch {
        message.reply("that isn't a valid page numbers!")
      }
    }
    else {
      try {
        lbEmbed = (typeof args[1] === "undefined") ? generateLeaderboardEmbed("m", 1) : generateLeaderboardEmbed("m", args[1]);
      }
      catch {
        message.reply("that isn't a valid page number!")
      }
    }
    
    message.channel.send({ embed: lbEmbed });
  }

  if(command === "invite"){
    message.reply("".concat("Add me to your server using this link: ", config.properties.inviteLink));
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
      message.reply("you haven't created an account yet, please use the `create` command.");
      return;
    }
    if(args[0] == "UK"|| (args[0] == "Invade") && args[1] == "the" && args[2] == "UK"){
      if(parsedData[index].inventory.includes("UK")){
        message.reply("you already own that item!");
        return;
      }
      if(parsedData[index].money >= 100000){
        parsedData[index].money -= 100000;
        item = "UK";
        parsedData[index].inventory.push(item);
        message.reply("you successfully bought the item.");
      }
      else {
        message.reply("You don't have enough money to buy that item.")
      }
    }
    else if(args[0] == "Equipement"|| (args[0] == "Advanced") && args[1] == "Equipement"){
      if(parsedData[index].inventory.includes("AE")){
        message.reply("you already own that item!");
        return;
      }
      if(parsedData[index].money >= 250000){
        parsedData[index].money -= 250000;
        item = "AE";
        parsedData[index].inventory.push(item);
        message.reply("you successfully bought the item.");
      }
      else {
        message.reply("You don't have enough money to buy that item.")
      }
    }
    else if(args[0] == "Russia"|| (args[0] == "Invade") && args[1] == "Russia"){
      if(parsedData[index].inventory.includes("RU")){
        message.reply("you already own that item!");
        return;
      }
      if(parsedData[index].money >= 500000){
        parsedData[index].money -= 500000;
        item = "RU";
        parsedData[index].inventory.push(item);
        message.reply("you successfully bought the item.");
      }
      else {
        message.reply("You don't have enough money to buy that item.")
      }
    }
    else if(args[0] == "City"|| (args[0] == "Expand") && args[1] == "your" && args[2] == "City"){
      if(parsedData[index].inventory.includes("EC")){
        message.reply("you already own that item!");
        return;
      }
      if(parsedData[index].money >= 1000000){
        parsedData[index].money -= 1000000;
        item = "EC";
        parsedData[index].inventory.push(item);
        message.reply("you successfully bought the item.");
      }
      else {
        message.reply("You don't have enough money to buy that item.")
      }
    }
    else if(args[0] == "Soldiers"|| (args[0] == "Recruit") && args[1] == "more" && args[2] == "Soldiers"){
      if(parsedData[index].inventory.includes("MS")){
        message.reply("you already own that item!");
        return;
      }
      if(parsedData[index].money >= 10000000){
        parsedData[index].money -= 10000000;
        item = "MS";
        parsedData[index].inventory.push(item);
        message.reply("you successfully bought the item.");
      }
      else {
        message.reply("You don't have enough money to buy that item.")
      }
    }
    else if(args[0] == "US"|| (args[0] == "Invade") && args[1] == "the" && args[2] == "US"){
      if(parsedData[index].inventory.includes("US")){
        message.reply("you already own that item!");
        return;
      }
      if(parsedData[index].money >= 50000000){
        parsedData[index].money -= 50000000;
        item = "US";
        parsedData[index].inventory.push(item);
        message.reply("you successfully bought the item.");
      }
      else {
        message.reply("You don't have enough money to buy that item.")
      }
    }

    else if(args[0] == "VIP"){
      if(parsedData[index].inventory.includes("VIP")){
        message.reply("you already own that item!");
        return;
      }
      if(parsedData[index].money >= 50000){
        parsedData[index].money -= 50000;
        item = "VIP";
        parsedData[index].inventory.push(item);
        message.reply("you successfully bought the item.");
      }
      else {
        message.reply("You don't have enough money to buy that item.")
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
      message.reply("you haven't created an account yet, please use the `create` command.");
      return;
    }
    if(args[0] == "UK"|| (args[0] == "Invade") && args[1] == "the" && args[2] == "UK"){
      if(!parsedData[index].inventory.includes("UK")){
        message.reply("you don't own that item.")
        return;
      }
      let role = message.guild.roles.find(r => r.name === "UK");
      message.member.addRole(role).catch(console.error);
      message.reply("you successfully invaded the UK.");
    }
    else if(args[0] == "Equipement"|| (args[0] == "Advanced") && args[1] == "Equipement"){
      if(!parsedData[index].inventory.includes("AE")){
        message.reply("you don't own that item.")
        return;
      }
      let role = message.guild.roles.find(r => r.name === "Advanced Equipement");
      message.member.addRole(role).catch(console.error);
      message.reply("you successfully bought Advanced Equipement.");
    }
    else if(args[0] == "Russia"|| (args[0] == "Invade") && args[1] == "Russia"){
      if(!parsedData[index].inventory.includes("RU")){
        message.reply("you don't own that item.")
        return;
      }
      let role = message.guild.roles.find(r => r.name === "Russia");
      message.member.addRole(role).catch(console.error);
      message.reply("you successfully invaded Russia.");
    }
    else if(args[0] == "City"|| (args[0] == "Expand") && args[1] == "your" && args[2] == "City"){
      if(!parsedData[index].inventory.includes("EC")){
        message.reply("you don't own that item.")
        return;
      }
      let role = message.guild.roles.find(r => r.name === "Expanded City");
      message.member.addRole(role).catch(console.error);
      message.reply("you successfully expandecd your city.");
    }
    else if(args[0] == "Soldiers"|| (args[0] == "Recruit") && args[1] == "more" && args[2] == "Soldiers"){
      if(!parsedData[index].inventory.includes("MS")){
        message.reply("you don't own that item.")
        return;
      }
      let role = message.guild.roles.find(r => r.name === "More Soldiers");
      message.member.addRole(role).catch(console.error);
      message.reply("you successfully recruited more soldiers.");
    }
    else if(args[0] == "US"|| (args[0] == "Invade") && args[1] == "the" && args[2] == "US"){
      if(!parsedData[index].inventory.includes("US")){
        message.reply("you don't own that item.")
        return;
      }
      let role = message.guild.roles.find(r => r.name === "US");
      message.member.addRole(role).catch(console.error);
      message.reply("you successfully invaded the US.");
    }

    else if(args[0] == "VIP"){
      if(!parsedData[index].inventory.includes("VIP")){
        message.reply("you don't own that item.")
        return;
      }
      let role = message.guild.roles.find(r => r.name === "VIP");
      message.member.addRole(role).catch(console.error);
      message.reply("you successfully gained access to VIP giveaways.");
    }
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  if(command == "createalliance"){
    let rawdataUser = fs.readFileSync('userdata.json');
    let parsedData = JSON.parse(rawdataUser);
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
      message.reply(createAliiance(message, allianceName));
    }
  }

  if(command === "me" || command === "stats"){
    var user = searchUser(message);
    var alliance = user.alliance;
    if(alliance == null){
      alliance = "You haven't joined an alliance yet."
    }
    if(user.allainceRank == "M"){
      alliance = "".concat("You are a member of ", alliance);
    }
    else if(user.allainceRank == "C"){
      alliance = "".concat("You are a co-leader of ", alliance);
    }
    else if(user.allainceRank == "L"){
      alliance = "".concat("You are the leader of ", alliance);
    }
    const meEmbed = {
      color: parseInt(config.properties.embedColor),
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
      footer: config.properties.footer,
    }; 
    message.channel.send({ embed: meEmbed });
  }

  if(command == "leavealliance"){
    let rawdataUser = fs.readFileSync('userdata.json');
    let parsedData = JSON.parse(rawdataUser);
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
      message.reply(leaveAlliance(message));
    }
    if(parsedData[index].alliance == null){
      message.reply("you are not part of any alliance.")
      return;
    }
  }


  if(command === "help"){
    message.reply("*TBA*");
  }

  if(command === "store" || command == "shop"){
    var storeEmbed = null;
    if(args[0] == "population" || args[0] == "p"){
      storeEmbed = createStoreEmbed(message, "p");
    }
    else {
      storeEmbed = createStoreEmbed(message, "s");
    }
    if(storeEmbed != null) message.channel.send({ embed: storeEmbed });
  }

  if(command == "autoping"){
    let rawdataUser = fs.readFileSync('userdata.json');
    let parsedData = JSON.parse(rawdataUser);
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

  if(command === "work"){
    let rawdataUser = fs.readFileSync('userdata.json');
    let parsedData = JSON.parse(rawdataUser);
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
    if(Math.floor(Date.now() / 1000) - parsedData[index].lastWorked < 1800){
      message.reply("".concat("You can work again in ", new Date((1800 - (Math.floor(Date.now() / 1000) - parsedData[i].lastWorked)) * 1000).toISOString().substr(11, 8)));
    }
    else {
      let oldBalance = parseInt(parsedData[index].money);
      var produced = Math.floor(Math.random() * 10000);
      var newBalance = oldBalance + produced;
      parsedData[index].money = newBalance;
      parsedData[index].lastWorked = Math.floor(Date.now() / 1000);
      fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
      message.reply("".concat("You successfully worked and gained ", produced, " coins. Your new balance is ", newBalance, " coins."));
      if(parsedData[index].autoping == true){
        reminder(message, "w");
      }
    }
  }

  if(command === "crime"){
    let rawdataUser = fs.readFileSync('userdata.json');
    let parsedData = JSON.parse(rawdataUser);
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
    if(Math.floor(Date.now() / 1000) - parsedData[index].lastCrime < 14400){
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
      parsedData[index].money = newBalance;
      parsedData[index].lastCrime = Math.floor(Date.now() / 1000);
      fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
      if(produced > 1){
        message.reply("".concat("You successfully worked and gained ", produced, " coins. Your new balance is ", newBalance, " coins."));
      }
      else{
        message.reply("".concat("You were unsuccesful and lost ", produced, " coins. Your new balance is ", newBalance, " coins."));
      }
      if(parsedData[index].autoping == true){
        reminder(message, "c");
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
      tag: msg.author.tag,
      id: msg.author.id,
      money: 1000,
      lastWorked: 0,
      lastCrime: 0,
      autoping: true,
      alliance: null,
      allianceRank: null,
      ressources: {
        food: 1000,
        population: 1000
      },
      upgrades: {
        population: []
      },
      inventory: []
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
    for(var i = 0; i < parsedData.length; i++){
      if(msg.author.id == parsedData[i].id){
        parsedData[i].lastWorked = Math.floor(Date.now() / 1000);
        break;
      }
      fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
      await Sleep(1800000);
      msg.reply("Reminder: Work again");
    }
  }
  else if(type == "c"){
    msg.channel.send("I'll remind you in 4h to commit a crime again.");
    for(var i = 0; i < parsedData.length; i++){
      if(msg.author.id == parsedData[i].id){
        parsedData[i].lastCrime = Math.floor(Date.now() / 1000);
        break;
      }
    }
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
    await Sleep(14400000);
    msg.reply("Reminder: Commit a crime.");
  }
  else {
    console.log("Error, no valid parameter for the reminder function.");
  }
  
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
      color: parseInt(config.properties.embedColor),
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
          value: '+5k population every 4h \n Price: 100,000',
          inline: true,
        },
        {
          name: 'Advanced Equipement',
          value: '+5k population every 4h \n Price: 250,000',
          inline: true,
        },
        {
          name: 'Invade Russia',
          value: '+10k population every 4h \n Price: 500,000',
          inline: true,
        },
        {
          name: 'Expand your City',
          value: '+25k population every 4h \n Price: 1,000,000',
          inline: true,
        },
        {
          name: 'Recruit more Soldiers',
          value: '+500k population every 4h \n Price: 10,000,000',
          inline: true,
        },
        {
          name: 'Invade the US',
          value: '+2M population every 4h \n Price: 50,000,000',
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    };
    return newEmbed;
  }
  else if(type == "s"){
    var user = searchUser(message);
    const newEmbed = {
      color: parseInt(config.properties.embedColor),
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
          name: 'VIP Giveaways',
          value: 'This will give you access to VIP giveaways \n Price: 50,000',
          inline: true,
        },
        {
          name: 'Inline field title',
          value: 'Some value here',
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
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
    payoutChannel.send("Processing started...");
    let l = parsedData.length;
    for(var i = 0; i < l; i++){
      if(parsedData[i].upgrades.population.includes("UK")){
        parsedData[i].ressources.population += 5000;
      }
      if(parsedData[i].upgrades.population.includes("AE")){
        parsedData[i].ressources.population += 5000;
      }
      if(parsedData[i].upgrades.population.includes("RU")){
        parsedData[i].ressources.population += 10000;
      }
      if(parsedData[i].upgrades.population.includes("EC")){
        parsedData[i].ressources.population += 25000;
      }
      if(parsedData[i].upgrades.population.includes("MS")){
        parsedData[i].ressources.population += 500000;
      }
      if(parsedData[i].upgrades.population.includes("US")){
        parsedData[i].ressources.population += 2000000;
      }
    } 
    payoutChannel.send("You have succesfully gained population from your upgrades!");
    parsedConfigData.lastPayout = Math.floor(Date.now() / 1000);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
    fs.writeFileSync("config.json", JSON.stringify(parsedConfigData, null, 2))
    await Sleep(14400000);
  }
}

async function populationWorkLoop(){
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  let rawdataConfig = fs.readFileSync("config.json");
  let parsedConfigData = JSON.parse(rawdataConfig);
  var payoutChannel = client.channels.get(parsedConfigData.payoutChannel);
  while(true){
    if(Math.floor(Date.now() / 1000) - parsedConfigData.lastPopulationWorkPayout < 43200){
      await Sleep((Math.floor(Date.now() / 1000) - parsedConfigData.lastPopulationWorkPayout) * 1000);
    }
    payoutChannel.send("Processing started...");
    let l = parsedData.length;
    for(var i = 0; i < l; i++){
      parsedData[i].money += parsedData[i].ressources.population / 100;
    } 
    payoutChannel.send("You have succesfully gained money through the work of your population!");
    parsedConfigData.lastPopulationWorkPayout = Math.floor(Date.now() / 1000);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
    fs.writeFileSync("config.json", JSON.stringify(parsedConfigData, null, 2))
    await Sleep(43200000);
  }
}

function getLeaderboardList(type){
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  if(type == "p"){
    return parsedData.sort((a, b) => parseFloat(b.ressources.population) - parseFloat(a.ressources.population));
  }
  else {
    return parsedData.sort((a, b) => parseFloat(b.money) - parseFloat(a.money));
  }
}

function generateLeaderboardEmbed(type, page){
  var p = page - 1;
  var lbEmbed;
  if(type == "p"){
    var lb = getLeaderboardList("p");
    lbEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Leaderboard sorted by population, page ", page),
      fields: leaderBoardEmbedFields(p, lb, "p"),
      timestamp: new Date(),
      footer: config.properties.footer,
    };
  }
  else {
    var lb = getLeaderboardList("m");
    lbEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Leaderboard sorted by money, page ", page),
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
    for(var i = p * 10; i < h; i++){
      field = {
        name: "#".concat(i + 1),
        value: "".concat(lb[i + p * 10].tag, " - ", lb[i + p * 10].ressources.population.commafy(), " population")
      }
      fields.push(field);
    }
  }
  else {
    for(var i = p * 10; i < h; i++){
      field = {
        name: "#".concat(i + 1),
        value: "".concat(lb[i + p * 10].tag, " - ", lb[i + p * 10].money.commafy(), " coins")
      }
      fields.push(field);
    }
  }
  return fields;
}

function createAliiance(message, allianceName){
  let rawdataAlliances = fs.readFileSync('alliances.json');
  let parsedDataAlliances = JSON.parse(rawdataAlliances);
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  var index = -1;
  for(var i = 0; i < parsedData.length; i++){
    if(message.author.id == parsedData[i].id){
      index = i;
      break;
    }
  }
  if(parsedData[index].money < 250000){
    return "you don't have enough money to create a new alliance. Creating an alliance costs 250,000 coins."
  }
  for(var i = 0; i < parsedDataAlliances.length; i++){
    if(parsedDataAlliances[i].name == allianceName){
      return "there already exists an alliance with this name.";
    }
  }
  let data = {
    name: allianceName,
    level: 1,
    leader: {
      tag: message.author.tag,
      id: message.author.id,
    },
    coLeaders: [],
    members: [],
    upgrades: []
  }
  parsedDataAlliances.push(data);
  parsedData[index].alliance = allianceName;
  parsedData[index].allianceRank = "L";
  parsedData[index].money -= 250000;
  fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
  return "".concat("you are now the leader of ", allianceName);
}

function leaveAlliance(message){
  let rawdataAlliances = fs.readFileSync('alliances.json');
  let parsedDataAlliances = JSON.parse(rawdataAlliances);
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  var index = -1;
  for(var i = 0; i < parsedData.length; i++){
    if(message.author.id == parsedData[i].id){
      index = i;
      break;
    }
  }
  memberRank = parsedData[index].allianceRank;
  if(memberRank == "M"){
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedDataAlliances[i].members.includes(message.author.id)){
        parsedDataAlliances[i].members = parsedDataAlliances[i].members.filter(item => item != message.author.id);
        parsedData[index].alliance = null;
        parsedData[index].allianceRank = null;
        break;
      }
    }
  }
  else if(memberRank == "C"){
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedDataAlliances[i].coLeaders.includes(message.author.id)){
        parsedDataAlliances[i].coLeaders = parsedDataAlliances[i].coLeaders.filter(item => item != message.author.id);
        parsedData[index].alliance = null;
        parsedData[index].allianceRank = null;
        break;
      }
    }
  }
  else if(memberRank == "L"){
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedDataAlliances[i].leader.id == message.author.id){
        if(parsedDataAlliances[i].coLeaders.length <= 0 && parsedDataAlliances[i].members.length <= 0){
          parsedData[index].alliance = null;
          parsedData[index].allianceRank = null;
          parsedDataAlliances.splice(i, 1);
          break;
        }
        else {
          return "".concat("You are the leader of ", parsedData[index].alliance, ". You have to promote one of the co-leaders to the new leader via `.promote <mention>` first.");
        }
      }
    }
  }
  fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
  return "you have left your alliance";
}