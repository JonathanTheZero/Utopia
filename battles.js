const Discord = require('discord.js');
const config = require("./config.json");
const fs = require("fs");
const client = new Discord.Client();
const effect = require("./effects.json");
require("./utils.js")();
client.login(config.token);


async function startBattleSelection(id, initiator) {
  let member = client.users.get(id);
  if (!initiator) member.send("If you wish to cancel the duel, type `.cancelduel`");
  if (initiator) member.send("you succesfully started the duel, type `.cancelduel` if you wish to cancel the duel.");
  member.send({embed: battleHelpEmbed});
}

function startbattle(index, oppIndex, channelID) {
  let rawdataUser = fs.readFileSync('userdata.json');
  let parsedData = JSON.parse(rawdataUser);
  let rawdataBattle = fs.readFileSync('activebattles.json');
  let battleData = JSON.parse(rawdataBattle);
  const newBattle = {
    p1: {
      id: parsedData[index].id,
      tag: parsedData[index].tag,
      troops: {
        inf: 0,
        cav: 0,
        art: 0,
      },
      resources: {
        money: parsedData[index].money,
        food: parsedData[index].resources.food,
        population: parsedData[index].resources.population
      },
      ready: false,
      costs: 0,
    },
    p2: {
      id: parsedData[oppIndex].id,
      tag: parsedData[oppIndex].tag,
      troops: {
        inf: 0,
        cav: 0,
        art: 0,
      },
      resources: {
        money: parsedData[oppIndex].money,
        food: parsedData[oppIndex].resources.food,
        population: parsedData[oppIndex].resources.population
      },
      ready: false,
      costs: 0,
    },
    channelID: channelID,
    startedAt: Math.floor(Date.now() / 1000),
  }
  battleData.push(newBattle);
  parsedData[oppIndex].resources.food -= Math.floor(parsedData[oppIndex].resources.food * 0.95);
  parsedData[index].resources.food -= Math.floor(parsedData[index].resources.food * 0.95);
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
  fs.writeFileSync("activebattles.json", JSON.stringify(battleData, null, 2));
  startBattleSelection(parsedData[index].id, true);
  startBattleSelection(parsedData[oppIndex].id, false);
}

const battleHelpEmbed = {
  color: parseInt(config.properties.embedColor),
  title: "Battle command list",
  description: "This guide will guide you through the battle process in the right order.\n" +
    "Battles are working round-based and there are three types of troops exisitng: Infantry, Cavalry and Artillery. Each of them have their own pros and cons.\n" +
    "Each round a random effect occurs and influences the battle. They can affect both, only one or no players and can be positive or negative.\n" + 
    "If you win a duel, you get a duel token (you can get one every 12h). You can use those to buy buffs in the battle shop. The winner also gets his money back and gets 5% of the remaining population of the Loser",
  fields: [
    {
      name: "`.duel <mention>` or `.startbattle <mention>`",
      value: "Start a battle against another user"
    },
    {
      name: "`.dividetroops <infantry: regiments> <Cavalry: regiments> <artillery: regiments>`",
      value: "You can divide your population into the different types with this command (One regiment = 1000 troops). Use `.troopinfo` to view an expanded list of the stats and effects of the different types.\n\n" +
        "Infantry: They are cheap to build and maintain.\n" +
        "Cavalry: Also cheap to build but stronger and more expensive to maintain.\n" +
        "Artillery: The strongest type but expensive to maintain and expensive to build."
    },
    {
      name: "`.troopinfo`",
      value: "View an expanded list of the stats and effects of the different troop types."
    },
    {
      name: "`.cancelduel`",
      value: "Use this command to cancel the running duel."
    },
    {
      name: "`.ready`",
      value: "Use this command when you finished everything else and are ready to fight."
    }
  ],
  timestamp: new Date(),
  footer: config.properties.footer,
}

const troopInfoEmbed = {
  color: parseInt(config.properties.embedColor),
  title: "Detailed troop info",
  description: "One regiment = 1000 troops",
  fields: [
    {
      name: "Infantry base stats:",
      value: "HP: 15 \u0000  Def: 5 \u0000  Att: 10\n" +
        "Bonus effects: -\n" +
        "Costs: 50 coins per regiment when creating them + 20 food per round per regiment"
    },
    {
      name: "Cavalry base stats:",
      value: "HP: 25 \u0000  Def: 15 \u0000  Att: 15\n" +
        "Bonus efffects: \n" + 
        "Costs: 100 coins per regiment when creating them + 300 food per regiment each round"
    },
    {
      name: "Artillery base stats:",
      value: "HP: 50 \u0000  Def: 30 \u0000  Att: 25\n" +
        "Bonus effects: \n" +
        "Costs: 1,000 coins per regiment when creating them + 500 food per regiment each round"
    }
  ],
  timestamp: new Date(),
  footer: config.properties.footer,
}

async function battleMatch(index){
  var rawdataBattle = fs.readFileSync('activebattles.json');
  var battleData = JSON.parse(rawdataBattle);
  const channel = client.channels.get(battleData[index].channelID);
  await Sleep(5000);
  var battleFinished = false;
  var winnerP1 = 0;
  let p1Vals = searchUserByID(battleData[index].p1.id).upgrades.battle;
  let p2Vals = searchUserByID(battleData[index].p2.id).upgrades.battle;
  const stats = {
    p1: {
      inf : {
        a : 10 + p1Vals.iA,
        d : 5 + p1Vals.iD
      },
      cav : {
        a: 15 + p1Vals.cA,
        d: 15 + p1Vals.cD
      },
      art: {
        a: 25 + p1Vals.aA,
        d: 30 + p1Vals.aD
      }
    },
    p2: {
      inf : {
        a : 10 + p2Vals.iA,
        d : 5 + p2Vals.iD
      },
      cav : {
        a: 15 + p2Vals.cA,
        d: 15 + p2Vals.cD
      },
      art: {
        a: 25 + p2Vals.aA,
        d: 30 + p2Vals.aD
      }
    }
  }
  while(!battleFinished){
    let ef = effect[rangeInt(0, effect.length - 1)];
    rawdataBattle = fs.readFileSync('activebattles.json');
    battleData = JSON.parse(rawdataBattle);
    channel.send({embed: {
      color: parseInt(config.properties.embedColor),
      title: "Duel between " + battleData[index].p1.tag + " (player 1) and " + battleData[index].p2.tag + " (player 2).",
      fields: [
        {name: "Troop division of player 1:", value: "Infantry: " + (battleData[index].p1.troops.inf*1000).commafy() + "\nCavalry: " + (battleData[index].p1.troops.cav*1000).commafy() + "\nArtillery: " + (battleData[index].p1.troops.art*1000).commafy()},
        {name: "Troop division of player 2:", value: "Infantry: " + (battleData[index].p2.troops.inf*1000).commafy() + "\nCavalry: " + (battleData[index].p2.troops.cav*1000).commafy() + "\nArtillery: " + (battleData[index].p2.troops.art*1000).commafy()}
    ]}});
    channel.send({embed: {color: parseInt(config.properties.embedColor), title: ef.msg}});
    if(battleData[index].p1.troops.art <= 0 && battleData[index].p1.troops.cav <= 0 && battleData[index].p1.troops.inf <= 0){
      winnerP1 = false;
      battleFinished = true; 
      break;
    }
    if(battleData[index].p2.troops.art == 0 && battleData[index].p2.troops.cav == 0 && battleData[index].p2.troops.inf == 0){
      winnerP1 = true;
      battleFinished = true;
      break;
    } 
    p1Att = Math.floor(ef.p1.inf * ef.both.inf * battleData[index].p1.troops.inf * stats.p1.inf.a 
      + ef.p1.cav * ef.both.cav * battleData[index].p1.troops.cav * stats.p1.cav.a 
      + ef.p1.art * ef.both.art * battleData[index].p1.troops.art* stats.p1.art.a);
    p2Att = Math.floor(ef.p2.inf * ef.both.inf * battleData[index].p2.troops.inf * stats.p2.inf.a 
      + ef.p2.cav * ef.both.cav * battleData[index].p2.troops.cav * stats.p2.cav.a 
      + ef.p2.art * ef.both.art * battleData[index].p2.troops.art* stats.p2.art.a);
    p1Def = Math.floor(ef.p1.inf * ef.both.inf * battleData[index].p1.troops.inf * stats.p1.inf.d 
      + ef.p1.cav * ef.both.cav * battleData[index].p1.troops.cav * stats.p1.cav.d 
      + ef.p1.art * ef.both.art * battleData[index].p1.troops.art* stats.p1.art.d);
    p2Def = Math.floor(ef.p2.inf * ef.both.inf * battleData[index].p2.troops.inf * stats.p2.inf.d 
      + ef.p2.cav * ef.both.cav * battleData[index].p2.troops.cav * stats.p2.cav.d 
      + ef.p2.art * ef.both.art * battleData[index].p2.troops.art* stats.p2.art.d);
    p1Con = Math.floor(ef.p1.consump * ef.both.consump * battleData[index].p1.troops.inf * 20 
      + ef.p1.consump * ef.both.consump * battleData[index].p1.troops.cav * 300 
      + ef.both.consump * ef.p1.consump * battleData[index].p1.troops.art * 500);
    p2Con = Math.floor(ef.p2.consump * ef.both.consump * battleData[index].p2.troops.inf * 20 
      + ef.p2.consump * ef.both.consump * battleData[index].p2.troops.cav * 300 
      + ef.both.consump * ef.p2.consump * battleData[index].p2.troops.art * 500);

    await Sleep(3000);
    if(p1Con > battleData[index].p1.resources.food){
      channel.send({embed: getMissingFoodEmbed(battleData[index].p1, p1Con)});
    }
    else {
      battleData[index].p1.resources.food -= p1Con;
    }
    if(p2Con > battleData[index].p2.resources.food){
      channel.send({embed: getMissingFoodEmbed(battleData[index].p1, p1Con)});
    }
    else {
      battleData[index].p1.resources.food -= p2Con;
    }
    await Sleep(5000)
    if(p1Att > p2Def){
      channel.send({embed:{ 
        title: `**${battleData[index].p1.tag}** attacks with a total power of ${p1Att.commafy()} Attackpoints. ${battleData[index].p2.tag} defends with ${p2Def.commafy()} points.`
      }});
      channel.send({
        embed: checkBattleRound(p1Att, p2Def, battleData[index].p1, battleData[index].p2)
      });
      if(battleData[index].p2.troops.art == 0 && battleData[index].p2.troops.cav == 0 && battleData[index].p2.troops.inf == 0){
        winnerP1 = true;
        battleFinished = true;
        break;
      } 
    }
    else {
      channel.send({embed:{ 
        title: `**${battleData[index].p1.tag}** attacks with a total power of ${p1Att.commafy()} Attackpoints. ${battleData[index].p2.tag} defends with ${p2Def.commafy()} points - Nothing happens`
      }});
    }

    await Sleep(3000);
    if(p2Att > p1Def){
      channel.send({embed: {
        title: `**${battleData[index].p2.tag}** attacks with a total power of ${p2Att.commafy()} Attackpoints. ${battleData[index].p1.tag} defends with ${p1Def.commafy()} points.`,
      }});
      channel.send({
        embed: checkBattleRound(p2Att, p1Def, battleData[index].p2, battleData[index].p1)
      });
      if(battleData[index].p1.troops.art <= 0 && battleData[index].p1.troops.cav <= 0 && battleData[index].p1.troops.inf <= 0){
        winnerP1 = false;
        battleFinished = true; 
        break;
      } 
    }
    else {
      channel.send({embed: {
        title: `**${battleData[index].p2.tag}** attacks with a total power of ${p2Att.commafy()} Attackpoints. ${battleData[index].p1.tag} defends with ${p1Def.commafy()} points - Nothing happens`,
      }});
    }

    fs.writeFileSync("activebattles.json", JSON.stringify(battleData, null, 2));

    await Sleep(10000);
  }
  let rawdataUser = fs.readFileSync("userdata.json");
  let parsedData = JSON.parse(rawdataUser);
  for(let i = 0;i < parsedData.length;i++){
    if(battleData[index].p1.id == parsedData[i].id){
      if(winnerP1){
        if(!parsedData[i].tokenUsed){
          parsedData[i].battleToken++;
        } 
        parsedData[i].resources.food += battleData[index].p1.resources.food;
        parsedData[i].resources.population += (battleData[index].p1.troops.inf + battleData[index].p1.troops.cav + battleData[index].p1.troops.art)*1000
          + Math.floor(searchUserByID(battleData[index].p2.id).resources.population * 0.05);
        parsedData[i].tokenUsed = true;
        parsedData[i].duelsWon++;
        parsedData[i].money += battleData[index].p1.costs;
        channel.send({embed: {color: 0x23E809, title: `The winner is ${battleData[index].p1.tag}`}});
      }
      else {
        parsedData[i].resources.population -= Math.floor(0.05 * parsedData[i].resources.population);
      }
    }
    if(!winnerP1 && battleData[index].p2.id == parsedData[i].id){
      if(!winnerP1){
        if(!parsedData[i].tokenUsed){
          parsedData[i].battleToken++;
        }
        parsedData[i].resources.food += battleData[index].p2.resources.food;
        parsedData[i].resources.population += (battleData[index].p2.troops.inf + battleData[index].p2.troops.cav + battleData[index].p2.troops.art)*1000
          + Math.floor(searchUserByID(battleData[index].p1.id).resources.population * 0.05);
        parsedData[i].tokenUsed = true;
        parsedData[i].duelsWon++;
        parsedData[i].money += battleData[index].p2.costs;
        channel.send({embed: {color: 0x23E809, title: `The winner is ${battleData[index].p2.tag}`}});
      }
      else {
        parsedData[i].resources.population -= Math.floor(0.05 * parsedData[i].resources.population);
      }
    }  
  }
  battleData.splice(index, 1);
  fs.writeFileSync("activebattles.json", JSON.stringify(battleData, null, 2));
  fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
}

function checkBattleRound(att, def, pA, pD){
  var s = `**${pA.tag}** defeats the defending troops, causing **${pD.tag}** to lose `;
  var diff = att - def;
  if(diff > 15){
    var infHP = pD.troops.inf * 15;
    if(diff > infHP){
      diff -= pD.troops.inf * 15;
      var cavHP = pD.troops.cav * 25;
      if(diff > cavHP){
        diff -= pD.troops.cav * 25;
        var artHP = pD.troops.art * 50;
        if(diff > artHP){
          pD.troops.inf = 0;
          pD.troops.cav = 0;
          pD.troops.art = 0;
          return {
            color: 0x00FF00,
            title: s + `all of his troops - **${pA.tag}** wins the match.`,
          };
        }
        else {
          var lost = Math.floor((diff/50));
          pD.troops.inf = 0;
          pD.troops.cav = 0;
          pD.troops.art -= lost;
          return {
            color: 0xDD2341,
            title: s + "all of his Infantry, all of his Cavalry and " + (lost*1000).commafy() + " Artillery.",
          };
        }
      }
      else {
        var lost = Math.floor((diff/25));
        pD.troops.inf = 0;
        pD.troops.cav -= lost;
        return {
          color: 0xDD2341,
          title: s + "all of his Infantry and " + (lost*1000).commafy() + " Cavalry",
        };
      }
    }
    else {
      var lost = Math.floor((diff/15))
      pD.troops.inf -= lost;
      return {
        color: 0xC72143,
        title: s + (lost*1000).commafy() + " Infantry",
      };
    }
  }
  return {
    title: s + "nothing, because the difference in damage was too low.",
  };
}

function getMissingFoodEmbed(player, con){
  var diff = player.resources.food - con;
  console.log(`Diff: ${diff}, Con: ${con}, ArtCon: $${player.troops.art * 500}`);
  if(diff > player.troops.art * 500){
    player.troops.art = 0;
    player.resources.food -= player.troops.art * 500;
    if(player.resources.food < 0) player.resources.food = 0;
    return {
      color: 0xDD8800,
      title: `**${player.tag}** loses all of his Artillery because he couldn't feed them anymore. \n${getCavalryConsumpton(player, diff - player.troops.art * 500)}`,
    }
  }
  else {
    var lost = Math.floor(con/(player.troops.art * 500));
    if(lost <= 0 || player.troops.art == 0){
      if(player.resources.food < 0) player.resources.food = 0;
      return {
        color: 0xCC7711,
        title: `${getCavalryConsumpton(player, con)}`
      }
    }
    player.troops.art -= lost;
    player.resources.food -= player.troops.art * 500;
    if(player.resources.food < 0) player.resources.food = 0;
    return {
      color: 0x992200,
      title: `**${player.tag}** loses ${lost*1000} of his artillery troops because he couldn't feed them anymore.`
    }
  }
}

function getCavalryConsumpton(player, con){
  var diff = player.resources.food - con;
  console.log(`Diff: ${diff}, Con: ${con}, cAvCon: $${player.troops.cav * 300}`);
  if(diff > player.troops.cav * 300){
    player.troops.cav = 0;
    player.resources.food -= player.troops.cav * 300;
    if(player.resources.food < 0) player.resources.food = 0;
    return `**${player.tag}** loses all of his Cavalry because he couldn't feed them anymore. \n${getInfantryConsumption(player, diff - player.troops.cav * 300)}`
  }
  else {
    var lost = Math.floor(con/(player.troops.cav * 300));
    if(player.resources.food < 0) player.resources.food = 0;
    if(lost <= 0 || player.troops.cav == 0){
      return `${getInfantryConsumption(player, con)}`
    }
    player.troops.art -= lost;
    player.resources.food -= player.troops.cav * 300;
    if(player.resources.food < 0) player.resources.food = 0;
    return `**${player.tag}** loses ${lost*1000} of his Cavalry because he couldn't feed them anymore.`
  }
}

function getInfantryConsumption(player, con){
  var diff = player.resources.food - con;
  console.log(`Diff: ${diff}, Con: ${con},InfCon: $${player.troops.art * 20}`);
  if(diff > player.troops.inf * 20){
    player.troops.cav = 0;
    player.resources.food = 0;
    if(player.resources.food < 0) player.resources.food = 0;
    return `**${player.tag} loses all of his Infantry because he couldn't feed them anymore.`
  }
  else {
    var lost = Math.floor(con/(player.troops.inf * 20));
    player.troops.inf -= lost;
    player.resources.food -= player.troops.inf * 20;
    if(player.resources.food < 0) player.resources.food = 0;
    return `**${player.tag}** loses ${lost*1000} of his infantry because he couldn't feed them anymore.`
  }
}

module.exports = {
  startbattle: startbattle,
  battleHelpEmbed: battleHelpEmbed,
  troopInfoEmbed: troopInfoEmbed,
  battleMatch: battleMatch
};