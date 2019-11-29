const Discord = require('discord.js');
const config = require("./config.json");
const fs = require("fs");

module.exports = function () {
  createAliiance = function (message, allianceName, index) {

    let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));

    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    if (parsedData[index].money < 100000) {
      return "you don't have enough money to create a new alliance. Creating an alliance costs 100,000 coins."
    }
    for (var i = 0; i < parsedDataAlliances.length; i++) {
      if (parsedDataAlliances[i].name == allianceName) {
        return "there already exists an alliance with this name.";
      }
    }
    let data = {
      name: allianceName,
      level: 1,
      public: true,
      leader: {
        tag: message.author.tag,
        id: message.author.id,
      },
      money: 0,
      tax: 5,
      /*population: 0,*/
      coLeaders: [],
      members: [],
      upgrades: {
        af: 0,
        pf: 0,
        mf: 0
      },
      invitedUsers: []
    }
    parsedDataAlliances.push(data);
    parsedData[index].alliance = allianceName;
    parsedData[index].allianceRank = "L";
    parsedData[index].money -= 100000;
    fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
    return "".concat("you are now the leader of ", allianceName);
  },

    joinAliiance = function (message, allianceName, index) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      for (var i = 0; i < parsedDataAlliances.length; i++) {
        if (parsedDataAlliances[i].name == allianceName) {
          if (parsedDataAlliances[i].public || parsedDataAlliances[i].invitedUsers.includes(message.author.id)) {
            if (parsedDataAlliances[i].invitedUsers.includes(message.author.id)) {
              parsedDataAlliances[i].invitedUsers = parsedDataAlliances[i].invitedUsers.filter(item => item != message.author.id);
            }
            parsedData[index].alliance = allianceName;
            parsedData[index].allianceRank = "M";
            parsedDataAlliances[i].members.push(message.author.id);
            fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
            fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
            return "".concat("you are now a member of ", allianceName);
          }
          else {
            return "You can't join this alliance because it's set to private. Ask the Leader or a Co-Leader to invite you."
          }
        }
      }
      return "this alliance doesn't exist, you can form it with `.createalliance " + allianceName + "`.";
    },

    leaveAlliance = function (message) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      var index = -1;
      for (var i = 0; i < parsedData.length; i++) {
        if (message.author.id == parsedData[i].id) {
          index = i;
          break;
        }
      }
      memberRank = parsedData[index].allianceRank;
      if (memberRank == "M") {
        for (var i = 0; i < parsedDataAlliances.length; i++) {
          if (parsedDataAlliances[i].members.includes(message.author.id)) {
            parsedDataAlliances[i].members = parsedDataAlliances[i].members.filter(item => item != message.author.id);
            parsedData[index].alliance = null;
            parsedData[index].allianceRank = null;
            break;
          }
        }
      }
      else if (memberRank == "C") {
        for (var i = 0; i < parsedDataAlliances.length; i++) {
          if (parsedDataAlliances[i].coLeaders.includes(message.author.id)) {
            parsedDataAlliances[i].coLeaders = parsedDataAlliances[i].coLeaders.filter(item => item != message.author.id);
            parsedData[index].alliance = null;
            parsedData[index].allianceRank = null;
            break;
          }
        }
      }
      else if (memberRank == "L") {
        for (var i = 0; i < parsedDataAlliances.length; i++) {
          if (parsedDataAlliances[i].leader.id == message.author.id) {
            if (parsedDataAlliances[i].coLeaders.length <= 0 && parsedDataAlliances[i].members.length <= 0) {
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
    },

    promote = function (message, index, member) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      var memberIndex = -1;
      for (var i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id === member.id) {
          memberIndex = i;
          break;
        }
      }
      if (memberIndex == -1) {
        return "sorry, I couldn't find his user.";
      }
      if (parsedData[index].alliance != parsedData[memberIndex].alliance) {
        return "you can't promote someone who isn't part of your alliance.";
      }
      for (var i = 0; i < parsedDataAlliances.length; i++) {
        if (parsedDataAlliances[i].name == parsedData[index].alliance) {
          if (parsedData[memberIndex].allianceRank == "M") {
            if (parsedDataAlliances[i].coLeaders.length < 2) {
              parsedData[memberIndex].allianceRank = "C";
              parsedDataAlliances[i].coLeaders.push(member.id);
              parsedDataAlliances[i].members = parsedDataAlliances[i].members.filter(item => item != member.id);
              fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
              fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
              return `Succesfully promoted ${member.tag} from Member to **Co-Leader**`;
            }
            return "an alliance can't have more than two Co-Leaders at the same time."
          }
          else {
            parsedData[memberIndex].allianceRank = "L";
            parsedData[index].allianceRank = "C";
            parsedDataAlliances[i].leader.tag = member.tag;
            parsedDataAlliances[i].leader.id = member.id;
            parsedDataAlliances[i].coLeaders = parsedDataAlliances[i].coLeaders.filter(item => item != member.id);
            parsedDataAlliances[i].coLeaders.push(parsedData[index].id);
            fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
            fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
            return `Succesfully promoted ${member.tag} from Co-Leader to **Leader**`;
          }
        }
      }
    },

    demote = function (message, index, member) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      var memberIndex = -1;
      for (var i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id === member.id) {
          memberIndex = i;
          break;
        }
      }
      if (memberIndex == -1) {
        return "sorry, I couldn't find his user.";
      }
      if (parsedData[index].alliance != parsedData[memberIndex].alliance) {
        return "you can't demote someone who isn't part of your alliance.";
      }
      for (var i = 0; i < parsedDataAlliances.length; i++) {
        if (parsedDataAlliances[i].name == parsedData[index].alliance) {
          if (parsedData[memberIndex].allianceRank == "M") {
            return `you can't demote ${member.tag} since he is only a member. Use \`.fire <mention>\` to fire a member from your alliance. `;
          }
          else {
            parsedData[memberIndex].allianceRank = "M";
            parsedDataAlliances[i].members.push(member.id);
            parsedDataAlliances[i].coLeaders = parsedDataAlliances[i].coLeaders.filter(item => item != member.id);
            fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
            fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
            return `Succesfully demoted ${member.tag} from Co-Leader to **Member**`;
          }
        }
      }
    },

    fire = function (message, index, member) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      var memberIndex = -1;
      for (var i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id == member.id) {
          memberIndex = i;
          break;
        }
      }
      if (memberIndex == -1) {
        return "sorry, I couldn't find his user.";
      }
      if (parsedData[index].alliance != parsedData[memberIndex].alliance) {
        return "you can't fire someone who isn't part of your alliance.";
      }
      for (var i = 0; i < parsedDataAlliances.length; i++) {
        if (parsedDataAlliances[i].name == parsedData[index].alliance) {
          if (parsedData[memberIndex].allianceRank == "M") {
            parsedDataAlliances[i].members = parsedDataAlliances[i].members.filter(item => item != member.id);
          }
          else {
            parsedDataAlliances[i].coLeaders = parsedDataAlliances[i].coLeaders.filter(item => item != member.id);
          }
          parsedData[memberIndex].alliance = null;
          parsedData[memberIndex].allianceRank = null;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
          fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
          return `Succesfully fired ${member.tag} from your alliance`;
        }
      }
    },

    setAllianceStatus = function (mode, index) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      for (let i = 0; i < parsedDataAlliances.length; i++) {
        if (parsedDataAlliances[i].name == parsedData[index].alliance) {
          parsedDataAlliances[i].public = mode;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
          if (mode) {
            return "the alliance is now set to public."
          }
          return "the alliance was set to invite-only."
        }
      }
    },

    setAllianceTax = function (index, tax) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      for (let i = 0; i < parsedDataAlliances.length; i++) {
        if (parsedDataAlliances[i].name == parsedData[index].alliance) {
          parsedDataAlliances[i].tax = tax;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
          return "the new taxrate of your alliance is " + tax + "%";
        }
      }
    },

    upgradeAlliance = function (index) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      var ind = -1;
      for (var i = 0; i < parsedDataAlliances.length; i++) {
        if (parsedData[index].alliance == parsedDataAlliances[i].name) {
          ind = i;
          break;
        }
      }
      if (parsedDataAlliances[ind].level == 1) {
        if (parsedDataAlliances[ind].money < 500000) {
          return "you don't have enough money to upgrade your alliance to level 2. Upgrading your alliance to level 2 costs 500,000 coins.";
        }
        else {
          parsedDataAlliances[ind].money -= 500000;
          parsedDataAlliances[ind].level = 2;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          return "Succesfully upgraded your alliance to level 2. Your alliance can now own each farm two times.";
        }
      }
      else if (parsedDataAlliances[ind].level == 2) {
        if (parsedDataAlliances[ind].money < 1000000) {
          return "you don't have enough money to upgrade your alliance to level 3. Upgrading your alliance to level 3 costs 1,000,000 coins.";
        }
        else {
          parsedDataAlliances[ind].money -= 1000000;
          parsedDataAlliances[ind].level = 3;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          return "Succesfully upgraded your alliance to level 3. Your alliance can now own each farm three times.";
        }
      }
      else if (parsedDataAlliances[ind].level == 3) {
        if (parsedDataAlliances[ind].money < 5000000) {
          return "you don't have enough money to upgrade your alliance to level 4. Upgrading your alliance to level 4 costs 5,000,000 coins.";
        }
        else {
          parsedDataAlliances[ind].money -= 5000000;
          parsedDataAlliances[ind].level = 4;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          return "Succesfully upgraded your alliance to level 4. Your alliance can now own each farm four times.";
        }
      }
      else if (parsedDataAlliances[ind].level == 4) {
        if (parsedDataAlliances[ind].money < 10000000) {
          return "you don't have enough money to upgrade your alliance to level 5. Upgrading your alliance to level 5 costs 10,000,000 coins.";
        }
        else {
          parsedDataAlliances[ind].money -= 10000000;
          parsedDataAlliances[ind].level = 5;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          return "Succesfully upgraded your alliance to level 5. Your alliance can now own each farm five times.";
        }
      }
      else if (parsedDataAlliances[ind].level == 5) {
        if (parsedDataAlliances[ind].money < 20000000) {
          return "you don't have enough money to upgrade your alliance to level 6. Upgrading your alliance to level 6 costs 20,000,000 coins.";
        }
        else {
          parsedDataAlliances[ind].money -= 20000000;
          parsedDataAlliances[ind].level = 6;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          return "Succesfully upgraded your alliance to level 6. Your alliance can now own each farm six times.";
        }
      }
      else if (parsedDataAlliances[ind].level == 6) {
        if (parsedDataAlliances[ind].money < 50000000) {
          return "you don't have enough money to upgrade your alliance to level 7. Upgrading your alliance to level 7 costs 50,000,000 coins.";
        }
        else {
          parsedDataAlliances[ind].money -= 50000000;
          parsedDataAlliances[ind].level = 7;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          return "Succesfully upgraded your alliance to level 7. Your alliance can now own each farm seven times.";
        }
      }
      else if (parsedDataAlliances[ind].level == 7) {
        if (parsedDataAlliances[ind].money < 100000000) {
          return "you don't have enough money to upgrade your alliance to level 8. Upgrading your alliance to level 8 costs 100,000,000 coins.";
        }
        else {
          parsedDataAlliances[ind].money -= 100000000;
          parsedDataAlliances[ind].level = 9;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          return "Succesfully upgraded your alliance to level 8. Your alliance can now own each farm eight times.";
        }
      }
      else if (parsedDataAlliances[ind].level == 8) {
        if (parsedDataAlliances[ind].money < 500000000) {
          return "you don't have enough money to upgrade your alliance to level 9. Upgrading your alliance to level 9 costs 500,000,000 coins.";
        }
        else {
          parsedDataAlliances[ind].money -= 500000000;
          parsedDataAlliances[ind].level = 10;
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          return "Succesfully upgraded your alliance to level 9. Your alliance can now own each farm nine times.";
        }
      }
      return "Error";
    },

    inviteToAlliance = function (message, index, member) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      var memberIndex = -1;
      for (var i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id === member.id) {
          memberIndex = i;
          break;
        }
      }
      if (memberIndex == -1) return "sorry, I couldn't find his user.";
      if (parsedData[memberIndex].alliance != null) return "sorry, this user already joined another alliance.";
      for (var i = 0; i < parsedDataAlliances.length; i++) {
        if (parsedDataAlliances[i].name == parsedData[index].alliance) {
          parsedDataAlliances[i].invitedUsers.push(member.id);
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
          return `Succesfully invited ${member.tag} to join your alliance`;
        }
      }
    }

  buyItemAlliance = function (itemShort, index, price, minLevel) {
    let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
    if (parsedData[index].allianceRank == "M") {
      return "sorry, you rank isn't high enough to buy upgrades.";
    }
    var ind = -1;
    for (let i = 0; i < parsedDataAlliances.length; i++) {
      if (parsedData[index].alliance == parsedDataAlliances[i].name) {
        ind = i;
        break;
      }
    }
    if (ind == -1) {
      return "error, I couldn't find your alliance."
    }
    if (parsedDataAlliances[ind].money >= price) {
      /*for(var i = 0; i < parsedDataAlliances.length; i++){
        if(parsedDataAlliances[i].name == parsedData[index].alliance){
          if(parsedData[i].level < minLevel){
            return "only level " + minLevel +"+ alliances can buy this upgrade.";
          }
          parsedData[index].money -= price;
          parsedDataAlliances[i].upgrades.push(itemShort);
          break;
        }*/
      if (itemShort == "AF") {
        if (parsedDataAlliances[ind].upgrades.af >= parsedDataAlliances[ind].level)
          return "sorry, your alliance level isn't high enough to buy this upgrade another time. Use `.upgradealliance` to increase your alliance level."
        parsedDataAlliances[ind].upgrades.af += 1;
      }
      else if (itemShort == "PF") {
        if (parsedDataAlliances[ind].upgrades.pf >= parsedDataAlliances[ind].level)
          return "sorry, your alliance level isn't high enough to buy this upgrade another time. Use `.upgradealliance` to increase your alliance level."
        parsedDataAlliances[ind].upgrades.pf += 1;
      }
      else if (itemShort == "MF") {
        if (parsedDataAlliances[ind].upgrades.mf >= parsedDataAlliances[ind].level)
          return "sorry, your alliance level isn't high enough to buy this upgrade another time. Use `.upgradealliance` to increase your alliance level."
        parsedDataAlliances[ind].upgrades.mf += 1;
      }
      else {
        return "sorry, an error occured."
      }
      parsedDataAlliances[ind].money -= price;
    }
    else {
      return "your alliance doesn't have enough money to buy that item.";
    }
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
    fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
    switch (itemShort) {
      case "AF":
        return "you successfully bought the arable farming upgrade for your alliance.";
      case "PF":
        return "you successfully bought the pastoral farming upgrade for your alliance.";
      case "MF":
        return "you successfully bought the mixed farming upgrade for your alliance.";
    }
  },

    renameAlliance = function (message, allianceName, index) {
      let parsedDataAlliances = JSON.parse(fs.readFileSync('alliances.json'));
      let parsedData = JSON.parse(fs.readFileSync('userdata.json'));
      const old = (' ' + parsedData[index].alliance).slice(1);
      for (var i = 0; i < parsedDataAlliances.length; i++) {
        if (parsedDataAlliances[i].name == old) {
          parsedDataAlliances[i].name = allianceName;
          for (let j = 0; j < parsedData.length; j++) {
            if (parsedData[j].alliance == old) parsedData[j].alliance = allianceName;
          }
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
          return `Succesfully renamed your alliance to ${allianceName}`;
        }
      }
    }
};