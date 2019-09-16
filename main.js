const Discord = require('discord.js');
const config = require("./config.json");
const fs = require("fs");
require("./alliances.js")();
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
  
  
  /*const roleUKexists = (guild.roles.find(role => role.name === "UK") == null) ? false : true;
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
  }*/
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
  var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  else if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  else if(command === "kick" || command === "yeet" || command == "YEET") {
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
  
  else if(command === "ban") {
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

  else if(command === "create"){
    createUser(message);
  }

  else if(command == "leaderboard" || command == "lb"){
    var lbEmbed;
    if(args[0] == "p" || args[0] == "population"){
      try {
        lbEmbed = (typeof args[1] === "undefined") ? generateLeaderboardEmbed("p", 1) : generateLeaderboardEmbed("p", args[1]);
      }
      catch {
        message.reply("that isn't a valid page numbers!")
      }
    }
    else if(args[0] == "allainces" || args[0] == "allaince" || args[0] == "a"){
      try {
        lbEmbed = (typeof args[1] === "undefined") ? generateLeaderboardEmbed("a", 1) : generateLeaderboardEmbed("a", args[1]);
      }
      catch {
        message.reply("that isn't a valid page number!")
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

  else if(command === "invitelink"){
    message.reply("".concat("Add me to your server using this link: ", config.properties.inviteLink));
  }

  else if(command == "buy"){
    let rawdataUser = fs.readFileSync('userdata.json');
    var parsedData = JSON.parse(rawdataUser);
    let rawdataAlliances = fs.readFileSync('alliances.json');
    let parsedDataAlliances = JSON.parse(rawdataAlliances);
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
    for(var i = 0; i < args.length; i++){
      args[i] = args[i].toLowerCase();
    }
    if(args[0] == "uk"|| (args[0] == "invade") && args[1] == "the" && args[2] == "uk"){
      message.reply(buyItem("UK", index, 100000));
    }
    else if(args[0] == "equipement"|| (args[0] == "advanced") && args[1] == "equipement"){
      message.reply(buyItem("AE", index, 250000));
    }
    else if(args[0] == "russia"|| (args[0] == "invade") && args[1] == "russia"){
      message.reply(buyItem("RU", index, 500000));
    }
    else if(args[0] == "city"|| (args[0] == "expand") && args[1] == "your" && args[2] == "city"){
      message.reply(buyItem("EC", index, 1000000));
    }
    else if(args[0] == "soldiers"|| (args[0] == "recruit") && args[1] == "more" && args[2] == "soldiers"){
      message.reply(buyItem("MS", index, 10000000));
    }
    else if(args[0] == "us"|| (args[0] == "invade") && args[1] == "the" && args[2] == "us"){
      message.reply(buyItem("US", index, 5000000));
    }
    else if(args[0] == "vip"){
      message.reply(buyItem("VIP", index, 50000));
    }
    else if(args[0] == "food" || args[0] == "a" && args[1] == "pack" && args[2] == "of" && args[3] == "food"){
      if(parsedData[index].money >= 20000){
        parsedData[index].money -= 20000;
        parsedData[index].resources.food += 50000;
        fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
        message.reply("you successfully bought 50,000 food for your population.");
        return;
      }
      message.reply("You don't have enough money to buy that item.");
    }
    else if(args[0] == "small" && args[1] == "farm"){
      if(parsedData[index].allianceRank == "M"){
        message.reply("sorry, you can't buy this upgrade.");
        return;
      }
      if(parsedData[index].money >= 100000){
        parsedData[index].money -= 100000;
        for(var i = 0; i < parsedDataAlliances.length; i++){
          if(parsedDataAlliances[i].name == parsedData[index].alliance){
            parsedDataAlliances[i].upgrades.push("SF");
            break;
          }
        }
        fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
        fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
        message.reply("you successfully bought the small farm upgrade for your alliance.");
        return;
      }
      message.reply("You don't have enough money to buy that item.");
    }
  }

  else if(command == "use"){
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
    for(var i = 0; i < args.length; i++){
      args[i] = args[i].toLowerCase();
    }
    if(args[0] == "uk"|| (args[0] == "invade") && args[1] == "the" && args[2] == "uk"){
      message.reply(useItem("UK", index, message));
    }
    else if(args[0] == "equipement"|| (args[0] == "advanced") && args[1] == "equipement"){
      message.reply(useItem("AE", index, message));
    }
    else if(args[0] == "russia"|| (args[0] == "invade") && args[1] == "russia"){
      message.reply(useItem("RU", index, message));
    }
    else if(args[0] == "city"|| (args[0] == "expand") && args[1] == "your" && args[2] == "city"){
      message.reply(useItem("EC", index, message));
    }
    else if(args[0] == "soldiers"|| (args[0] == "recruit") && args[1] == "more" && args[2] == "soldiers"){
      message.reply(useItem("MS", index, message));
    }
    else if(args[0] == "us"|| (args[0] == "invade") && args[1] == "the" && args[2] == "us"){
      message.reply(useItem("US", index, message));
    }
    else if(args[0] == "vip"){
      message.reply(useItem("VIP", index, message));
    }
  }

  else if(command === "me" || command === "stats"){
    var user;
    var url;
    if(typeof args[0] === "undefined"){
      user = searchUser(message);
      url = `${message.author.avatarURL}`;
    }
    else {
      user = searchUserByID(message.mentions.users.first().id);
      url = `${message.mentions.users.first().avatarURL}`;
    }
    var alliance = user.alliance;

    if(alliance == null){
      alliance = (typeof args[0] === "undefined") ? "You haven't joined an alliance yet." : `${message.mentions.users.first()} hasn't joined an alliance yet`;
    }
    if(user.allainceRank == "M"){
      alliance = "".concat("Member of ", alliance);
    }
    else if(user.allianceRank == "C"){
      alliance = "".concat("Co-leader of ", alliance);
    }
    else if(user.allianceRank == "L"){
      alliance = "".concat("Leader of ", alliance);
    }
    const meEmbed = {
      color: parseInt(config.properties.embedColor),
      title: `Data for ${message.author.tag}`,
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
          name: "Population",
          value: user.resources.population.commafy(),
          inline: true,
        },
        {
          name: 'Alliance',
          value: alliance,
        },
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    }; 
    message.channel.send({ embed: meEmbed });
  }

  else if(command === "add"){
    /*if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'], false, true, true)) {
      message.reply("this command can only be used by Members who have Kick and Ban permissions");
      return;
    }*/
    if(!config.botAdmins.includes(parseInt(message.author.id))){
      message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
      return;
    }
    if(typeof args[0] === "undefined" || typeof args[1] === "undefined" || typeof args[2] === "undefined"){
      message.reply("please supply valid parameters following the `.add <type> <mention> <amount>`.");
      return;
    }
    let rawdataUser = fs.readFileSync('userdata.json');
    let parsedData = JSON.parse(rawdataUser);
    var index = -1;
    for(var i = 0; i < parsedData.length; i++){
      if(message.mentions.users.first().id == parsedData[i].id){
        index = i;
        break;
      }
    }
    if(index == -1){
      message.reply("this user hasn't created an account yet.");
      return;
    }
    var m = ["money", "m"];
    var f = ["food", "f"];
    var p = ["population", "p"]
    const a = parseInt(args[2])
    if(a == null){
      message.reply("this isn't a valid amount.");
      return;
    }
    if(m.includes(args[0])){
      parsedData[index].money += a;
      message.reply("Succesfully added " + a + " " + `money to ${message.mentions.users.first()} balance.`);
    }
    else if(f.includes(args[0])){
      parsedData[index].resources.food += a;
      message.reply("Succesfully added " + a + " " + `food to ${message.mentions.users.first()} balance.`);
    }
    else if(p.includes(args[0])){
      parsedData[index].resources.population += a;
      message.reply("Succesfully added " + a + " " + `population to ${message.mentions.users.first()} balance.`);
    }
   
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  }

  else if(command === "joinalliance" || command === "join"){
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
      message.reply("you can't join another alliance, because you already joined one. Leave your alliance with `.leavealliance` first.")
      return;
    }
    if(parsedData[index].alliance == null){
      const allianceName = args.join(" ");
      message.reply(joinAliiance(message, allianceName, index));
    }
  }

  else if(command == "createalliance"){
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
      message.reply(createAliiance(message, allianceName, index));
    }
  }

  else if(command == "leavealliance" || command == "leave"){
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

  else if(command === "promote"){
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
    if(typeof args[0] === 'undefined'){
      message.reply("please supply a username with `.promote <mention>`.");
      return;
    }
    if(parsedData[index].allianceRank != "L"){
      message.reply("only the leader can promote members.");
      return;
    }
    else {
      message.reply(promote(message, index));
    }
  }

  else if(command === "demote"){
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
    if(typeof args[0] === 'undefined'){
      message.reply("please supply a username with `.demote <mention>`.");
      return;
    }
    if(parsedData[index].allianceRank != "L"){
      message.reply("only the leader can demote members.");
      return;
    }
    else {
      message.reply(demote(message, index));
    }
  }

  else if(command === "setprivate"){
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
    if(parsedData[index].allianceRank != "M"){
      message.reply(setAllianceStatus(false, index));
      return;
    }
    else {
      message.reply("Only the Leader and the Co-Leaders can set the alliance status");
    }
  }

  else if(command === "setpublic"){
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
    if(parsedData[index].allianceRank != "M"){
      message.reply(setAllianceStatus(true, index));
      return;
    }
    else {
      message.reply("Only the Leader and the Co-Leaders can set the alliance status");
    }
  }

  else if(command === "upgradealliance" || command == "upalliance"){
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
    if(parsedData[index].allianceRank != "M"){
      message.reply(upgradeAlliance(index));
      return;
    }
    else {
      message.reply("Only the Leader and the Co-Leaders can upgrade the alliance status");
    }
  }

  else if(command === "invite"){
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
    if(typeof args[0] === 'undefined'){
      message.reply("please supply a username with `.invite <mention>`.");
      return;
    }
    if(parsedData[index].allianceRank != "M"){
      message.reply(inviteToAlliance(message, index));
      return;
    }
    else {
      message.reply("only the leader and the co-leaders can send out invites.");
    }
  }
  
  else if(command === "fire"){
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
    if(typeof args[0] === 'undefined'){
      message.reply("please supply a username with `.fire <mention>`.");
      return;
    }
    if(parsedData[index].allianceRank != "L"){
      message.reply("only the leader can fire members.");
      return;
    }
    else {
      message.reply(fire(message, index));
    }
  }

  else if(command == "alliance"){
    let rawdataAlliances = fs.readFileSync('alliances.json');
    let parsedDataAlliances = JSON.parse(rawdataAlliances);
    var user;
    var url;
    if(typeof args[0] === "undefined"){
      user = searchUser(message);
      url = `${message.author.avatarURL}`;
    }
    else {
      user = searchUserByID(message.mentions.users.first().id);
      url = `${message.mentions.users.first().avatarURL}`;
    }
    var alliance = user.alliance;
    if(alliance == null){
      if(typeof args[0] === "undefined"){
        message.reply("you haven't joined an alliance yet.");
        return;
      }
      else{
        message.reply(`${message.mentions.users.first()} hasn't joined an alliance yet.`);
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
      coLeaders = "The Co-Leader of this alliance is <@" + cl[0] + ">";
    }
    else if(cl.length == 2){
      coLeaders = "The Co-Leaders of this alliance are <@" + cl[0] + "> and <@" + cl[1] + ">";
    }
    var auText = "This alliance hasn't purchased any upgrades yet";
    if(parsedDataAlliances[i].upgrades.includes("SF")){
      auText = "This alliance owns a small farm"
    }
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
          name: 'Upgrades',
          value: auText,
          inline: true,
        },
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
        url: message.author.avatarURL,
      },
      fields: [
        {
          name: 'General help:',
          value: "type `.help general` to view the help menu for the general comamnds",
        },
        {
          name: 'Alliance help:',
          value: "type `.help alliance` to view the alliance help menu",
        },
        {
          name: "Miscellaneous help:",
          value: "type `.help misc` to view the help menu for everything else",
        },
      ],
      timestamp: new Date(),
      footer: config.properties.footer,
    }; 
    var a = ["alliance", "alliances", "a"]
    var g = ["general", "g"]
    if(g.includes(args[0])){
      helpEmbed.fields[2].name = "`.work`";
      helpEmbed.fields[2].value = "You gain up to 10,000 coins from working. You can work every 30 minutes.";
      helpEmbed.fields[0].name = "`.create`"
      helpEmbed.fields[0].value ="Create an account and start to conquer the world!"
      helpEmbed.fields[1].name = "`.me` or `.stats <mention>`"
      helpEmbed.fields[1].value = "View your stats or these of other players."
      field3 = {
        name: "`.crime`",
        value: "You can commit a crime every 4 hours. You have a 5% chance to increase your networth by 50,000 coins or up to 5% (whichever is higher), but be careful: you can also lose up to 2% of your current networth.",
      }
      field4 = {
        name: "`.lb` or `.leaderboard [type] [page]`",
        value: "View the global leaderboard. Allowed types are 'allaince', 'money' and 'population'.",
      }
      field5 = {
        name: "`.shop` or `.store [category]`",
        value: "View the shop (you'll find further information there).",
      }
      field6 = {
        name: "`.buy [item]`",
        value: "Buy an item from the shop."
      },
      field7 = {
        name: "`.use [item]`",
        value: "Use on of your purchased items."
      }
      field8 = {
        name: "`.alliance [mention]`",
        value: "View the stats of your alliance or of the alliance of another user."
      }
      helpEmbed.fields.push(field3);
      helpEmbed.fields.push(field4);
      helpEmbed.fields.push(field5);
      helpEmbed.fields.push(field6);
      helpEmbed.fields.push(field7);
      helpEmbed.fields.push(field8);
    }
    else if(a.includes(args[0])){
      helpEmbed.fields[2].name = "`.createalliance <name>`";
      helpEmbed.fields[2].value = "Create your own alliance.";
      helpEmbed.fields[0].name = "`.leavealliance`";
      helpEmbed.fields[0].value ="Leave your current alliance";
      helpEmbed.fields[1].name = "`.joinalliance <name>`";
      helpEmbed.fields[1].value = "Join an alliance";
      field3 = {
        name: "`.promote <mention>` (Leader only)",
        value: "Promote a member or Co-Leader of your alliance (there is a maximum of two co-leaders)",
      }
      field4 = {
        name: "`.demote <mention>` (Leader only)",
        value: "Demote a member of your alliance.",
      }
      field5 = {
        name: "`.fire <mention>` (Leader only)",
        value: "Fire a member of your alliance.",
      }
      field6 = {
        name: "`.setpublic` and `.setprivate` (Leader and Co-Leaders only)",
        value: "Change the setting of your alliance. Public: Everyone can join, Private: Only invited users can join."
      },
      field7 = {
        name: "`.invite <mention>` (Leader and Co-Leaders only)",
        value: "Invite a member to your alliance."
      }
      field8 = {
        name: "`.alliance [mention}`",
        value: "View the stats of your alliance or of the alliance of another user."
      }
      helpEmbed.fields.push(field3);
      helpEmbed.fields.push(field4);
      helpEmbed.fields.push(field5);
      helpEmbed.fields.push(field6);
      helpEmbed.fields.push(field7);
      helpEmbed.fields.push(field8);
    }
    else if(args[0] == "misc"){
      message.reply("coming soon");
      return;
    }
    message.channel.send({ embed: helpEmbed });
  }

  else if(command === "store" || command == "shop"){
    var storeEmbed = null;
    a = ["alliance", "alliances", "a"]
    if(args[0] == "population" || args[0] == "p"){
      storeEmbed = createStoreEmbed(message, "p");
    }
    else if(a.includes(args[0])){
      storeEmbed = createStoreEmbed(message, "a");
    }
    else {
      storeEmbed = createStoreEmbed(message, "s");
    }
    if(storeEmbed != null) message.channel.send({ embed: storeEmbed });
  }

  else if(command == "autoping"){
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

  else if(command === "work"){
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
      message.reply("".concat("You successfully worked and gained ", produced.commafy(), " coins. Your new balance is ", newBalance.commafy(), " coins."));
      if(parsedData[index].autoping == true){
        reminder(message, "w");
      }
    }
  }

  else if(command === "crime"){
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
        var p = Math.floor(oldBalance * Math.random() * 0.02);
        produced = (p > 50000) ? p : 50000;
      }
      else {
        produced = Math.floor(-1 * (oldBalance * Math.random() * 0.02));
      }
      var newBalance = oldBalance + produced;
      parsedData[index].money = newBalance;
      parsedData[index].lastCrime = Math.floor(Date.now() / 1000);
      fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
      if(produced > 1){
        message.reply("".concat("You successfully worked and gained ", produced.commafy(), " coins. Your new balance is ", newBalance.commafy(), " coins."));
      }
      else{
        message.reply("".concat("You were unsuccesful and lost ", produced.commafy(), " coins. Your new balance is ", newBalance.commafy(), " coins."));
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
      resources: {
        food: 10000,
        population: 1000
      },
      upgrades: {
        population: [],
        misc: []
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
function searchUserByID(id){
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  for(var i = 0; i < parsedData.length; i++){
    if(id == parsedData[i].id){
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

function randInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createStoreEmbed(message, type){
  /* p = populations
  *  s = store (default)
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
          value: '+500k population every 4h\n Price: 10,000,000',
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
  else if(type == "a"){
    var user = searchUser(message);
    var alliance = user.alliance;
    var alField;
    if(alliance == null){
      alliance= "You haven't joined an alliance yet.";
      alField = alliance;
    }
    if(user.allainceRank == "M"){
      alField = user.alliance + " , Member";
    }
    else if(user.allianceRank == "C"){
      alField = user.alliance + " , Co-Leader";
    }
    else if(user.allianceRank == "L"){
      alField = user.alliance + " , Leader";
    }
    const newEmbed = {
      color: parseInt(config.properties.embedColor),
      title: 'Alliance store',
      description: 'These items are currently avialable in the alliance store! \n' +  
                'Note: only the leader and the Co-Leaders can buy alliance upgrades and they are used immediately.',
      thumbnail: {
        url: `${message.author.avatarURL}`,
      },
      fields: [
        {
          name: 'Your balance',
          value: user.money.commafy(),
          inline: true,
        },
        {
          name: "Your alliance, your rank:",
          value: alField,
          inline: true,
        },
        {
          name: '\u200b',
			    value: '\u200b'
        },
        {
          name: 'Small farm',
          value: '+50k food for the alliance every 4h \n Price: 100,000',
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
      description: 'Welcome to the store! \n' +
                    "Note: All items can only be purchased **once**.",
      thumbnail: {
        url: `${message.author.avatarURL}`,
      },
      fields: [
        {
          name: 'Population store',
          value: "".concat('Type `', config.prefix, "store population` to view the population store"),
        },
        {
          name: 'Alliance store',
          value: "".concat('Type `', config.prefix, "store alliance` to view the alliance store"), 
        },
        {
          name: 'A pack of food',
          value: 'Contains 50k food (added to your account immediately) \n Price: 20,000',
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
  let rawdataAlliances = fs.readFileSync('alliances.json');
  let parsedDataAlliances = JSON.parse(rawdataAlliances);
  var payoutChannel = client.channels.get(parsedConfigData.payoutChannel);
  while(true){
    var tdiff = Math.floor(Date.now() / 1000) - parsedConfigData.lastPayout;
    if(tdiff < 14400){
      await Sleep((14400 - tdiff) * 1000);
    }
    payoutChannel.send("Processing started...");
    let l = parsedData.length;
    for(var i = 0; i < l; i++){
      if(parsedData[i].upgrades.population.includes("UK")){
        parsedData[i].resources.population += 5000;
      }
      if(parsedData[i].upgrades.population.includes("AE")){
        parsedData[i].resources.population += 5000;
      }
      if(parsedData[i].upgrades.population.includes("RU")){
        parsedData[i].resources.population += 10000;
      }
      if(parsedData[i].upgrades.population.includes("EC")){
        parsedData[i].resources.population += 25000;
      }
      if(parsedData[i].upgrades.population.includes("MS")){
        parsedData[i].resources.population += 500000;
      }
      if(parsedData[i].upgrades.population.includes("US")){
        parsedData[i].resources.population += 2000000;
      }
    } 
    payoutChannel.send("You have succesfully gained population from your upgrades!");
    payoutChannel.send("Processing started...");
    for(var i = 0; i < parsedDataAlliances.length; i++){
      if(parsedDataAlliances[i].upgrades.includes("SF")){
        for(var j = 0; j < parsedData.length; j++){
          if(parsedData[j].id == parsedDataAlliances[i].leader.id){
            parsedData[j].food += 5000;
          }
          if(parsedDataAlliances[i].coLeaders.includes(parsedData[j].id)){
            parsedData[j].food += 2500;
          }
          if(parsedDataAlliances[i].members.includes(parsedData[j].id)){
            parsedData[j].food += (40000/parsedDataAlliances[i].members.length);
          }
        }
      }
    }
    payoutChannel.send("You have succesfully gained food from your alliance upgrades!");
    parsedConfigData.lastPayout = Math.floor(Date.now() / 1000);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
    fs.writeFileSync("config.json", JSON.stringify(parsedConfigData, null, 2))
    fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
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
    var tdiff = Math.floor(Date.now() / 1000) - parsedConfigData.lastPopulationWorkPayout;
    if(tdiff < 43200){
      await Sleep((43200 - tdiff) * 1000);
    }
    payoutChannel.send("Processing started...");
    let l = parsedData.length;
    for(var i = 0; i < l; i++){
      parsedData[i].money += parsedData[i].resources.population / 100;
      pop = parsedData[i].resources.population;
      const consumption = Math.floor(pop * (2 + getBaseLog(10, getBaseLog(10, getBaseLog(3, pop)))));
      if(consumption > parsedData[i].resources.food){
        const diff = consumption - parsedData[i].resources.food;
        parsedData[i].resources.food = 0;
        client.users.get(parsedData[i].id).send("**Alert**: You don't have any food left, your population is dying!");
        if(diff > pop){
          parsedData[i].resources.population = 0;
          client.users.get(parsedData[i].id).send("**Alert**: All of your population died");
        }
        else {
          parsedData[i].resources.population -= diff;
        }
        }
      else {
        parsedData[i].resources.food -= consumption;
      }
      console.log("Factor: " + (2 + getBaseLog(10, getBaseLog(10, getBaseLog(3, pop)))));
    } 
    payoutChannel.send("You have succesfully gained money through the work of your population!");
    parsedConfigData.lastPopulationWorkPayout = Math.floor(Date.now() / 1000);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
    fs.writeFileSync("config.json", JSON.stringify(parsedConfigData, null, 2))
    await Sleep(43200000);
  }
}

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

function getLeaderboardList(type){
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  let rawdataAlliances = fs.readFileSync('alliances.json');
  let parsedDataAlliances = JSON.parse(rawdataAlliances);
  if(type == "p"){
    return parsedData.sort((a, b) => parseFloat(b.resources.population) - parseFloat(a.resources.population));
  }
  else if(type == "a"){
    return parsedDataAlliances.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
  }
  else {
    return parsedData.sort((a, b) => parseFloat(b.money) - parseFloat(a.money));
  }
}

var sort_by = function(field, reverse, primer){

  var key = primer ? 
      function(x) {return primer(x[field])} : 
      function(x) {return x[field]};

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
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
  else if(type == "a"){
    var lb = getLeaderboardList("a");
    lbEmbed = {
      color: parseInt(config.properties.embedColor),
      title: "".concat("Alliance leaderboard sorted by name, page ", page),
      fields: leaderBoardEmbedFields(p, lb, "a"),
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
        name: "`#" + (i + 1) + "` - " + lb[i + p * 10].tag,
        value: "".concat(lb[i + p * 10].resources.population.commafy(), " population")
      }
      fields.push(field);
    }
  }
  else if(type == "a"){
    for(var i = p * 10; i < h; i++){
      field = {
        name: "`#" + (i + 1) + "`",
        value: lb[i + p *10].name,
      }
      fields.push(field);
    }
  }
  else {
    for(var i = p * 10; i < h; i++){
      field = {
        name: "`#" + (i + 1) + "` - " + lb[i + p * 10].tag,
        value: "".concat(lb[i + p * 10].money.commafy(), " coins")
      }
      fields.push(field);
    }
  }
  return fields;
}

function useItem(item, index, message){
  let rawdataUser = fs.readFileSync('userdata.json');
  var parsedData = JSON.parse(rawdataUser);
  if(!parsedData[index].inventory.includes(item)){
    return "you don't own that item.";
  }
  //let role = message.guild.roles.find(r => r.name === item);
  //message.member.addRole(role).catch(console.error);
  populationUpgrades = ["UK", "AE", "RU", "EC", "MS", "US"];
  parsedData[index].inventory = parsedData[index].inventory.filter(i => i !== item);
  if(populationUpgrades.includes(item)){
    parsedData[index].upgrades.population.push(item);
  }
  else {
    parsedData[index].upgrades.misc.push(item);
  }
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
  switch(item){
    case "VIP":
      return "you successfully gained access to VIP giveaways.";
    case "UK":
      return "you succesfully invaded the UK.";
    case "AE":
      return "you succesfully used the Advanced Equipement.";
    case "RU":
      return "you succesfully invaded Russia.";
    case "EC":
      return "you succesfully expanded your city.";
    case "MS":
      return "you succesfully recruited more soldiers.";
    case "US":
      return "you succesfully invaded the US";
    default:
      return "Error";
  }
}

function buyItem(item, index, price){
  let rawdataUser = fs.readFileSync('userdata.json');
  var parsedData = JSON.parse(rawdataUser);
  if(parsedData[index].inventory.includes(item)){
      return "you already own that item!";
  }
  if(parsedData[index].money >= price){
    parsedData[index].money -= price;
    parsedData[index].inventory.push(item);
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
    return "you successfully bought the item.";
  }
  return "You don't have enough money to buy that item.";
}