const Discord = require('discord.js');
const config = require("./config.json");
const fs = require("fs");

module.exports = function(){
    createAliiance = function(message, allianceName, index){
        let rawdataAlliances = fs.readFileSync('alliances.json');
        let parsedDataAlliances = JSON.parse(rawdataAlliances);
        let rawdataUser = fs.readFileSync('userdata.json');
        let parsedData = JSON.parse(rawdataUser);
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
          public: true,
          leader: {
            tag: message.author.tag,
            id: message.author.id,
          },
          coLeaders: [],
          members: [],
          upgrades: [],
          invitedUsers: []
        }
        parsedDataAlliances.push(data);
        parsedData[index].alliance = allianceName;
        parsedData[index].allianceRank = "L";
        parsedData[index].money -= 250000;
        fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
        fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
        return "".concat("you are now the leader of ", allianceName);
      },
      
    joinAliiance = function(message, allianceName, index){
        let rawdataAlliances = fs.readFileSync('alliances.json');
        let parsedDataAlliances = JSON.parse(rawdataAlliances);
        let rawdataUser = fs.readFileSync('userdata.json');
        let parsedData = JSON.parse(rawdataUser);
        for(var i = 0; i < parsedDataAlliances.length; i++){
          if(parsedDataAlliances[i].name == allianceName){
            if(parsedDataAlliances[i].public ||parsedDataAlliances[i].invitedUsers.includes(message.author.id)){
              if(parsedDataAlliances[i].invitedUsers.includes(message.author.id)){
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
        return "".concat("this alliance doesn't exist, you can form it with `.createalliance ", allianceName, "`.");
      },
      
    leaveAlliance = function(message){
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
      },
      
    promote = function(message, index){
        let rawdataAlliances = fs.readFileSync('alliances.json');
        let parsedDataAlliances = JSON.parse(rawdataAlliances);
        let rawdataUser = fs.readFileSync('userdata.json');
        let parsedData = JSON.parse(rawdataUser);
        let member = message.mentions.members.first();
        var memberIndex = -1;
        for(var i = 0; i < parsedData.length; i++){
          if(parsedData[i].id === member.id){
            memberIndex = i;
            break;
          }
        }
        if(memberIndex == -1){
          return "sorry, I couldn't find his user.";
        }
        for(var i = 0; i < parsedDataAlliances.length; i++){
          if(parsedDataAlliances[i].name == parsedData[index].alliance){
            if(parsedData[memberIndex].allianceRank == "M"){
              if(parsedDataAlliances[i].coLeaders.length < 2){
                parsedData[memberIndex].allianceRank = "C";
                parsedDataAlliances[i].coLeaders.push(member.id);
                parsedDataAlliances[i].members = parsedDataAlliances[i].members.filter(item => item != member.id);
                fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
                fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
                return `Succesfully promoted ${message.mentions.members.first()} from Member to **Co-Leader**`;
              }
              return "an alliance can't have more than two Co-Leaders at the same time."
            }
            else {
              parsedData[memberIndex].allianceRank = "L";
              parsedData[index].allianceRank = "C";
              parsedDataAlliances[i].leader.tag = member.tag;
              parsedDataAlliances[i].leader.id = member.id;
              parsedDataAlliances[i].coLeaders = parsedDataAlliances[i].coLeaders.filter(item => item != member.id);
              fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
              fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
              return `Succesfully promoted ${message.mentions.members.first()} from Co-Leader to **Leader**`;
            }
          }
        }
      },
      
    demote = function(message, index){
        let rawdataAlliances = fs.readFileSync('alliances.json');
        let parsedDataAlliances = JSON.parse(rawdataAlliances);
        let rawdataUser = fs.readFileSync('userdata.json');
        let parsedData = JSON.parse(rawdataUser);
        let member = message.mentions.members.first();
        var memberIndex = -1;
        for(var i = 0; i < parsedData.length; i++){
          if(parsedData[i].id === member.id){
            memberIndex = i;
            break;
          }
        }
        if(memberIndex == -1){
          return "sorry, I couldn't find his user.";
        }
        for(var i = 0; i < parsedDataAlliances.length; i++){
          if(parsedDataAlliances[i].name == parsedData[index].alliance){
            if(parsedData[memberIndex].allianceRank == "M"){
              return `you can't demote ${message.mentions.members.first()} since he is only a member. Use \`.fire <mention>\` to fire a member from your alliance. `;
            }
            else {
              parsedData[memberIndex].allianceRank = "M";
              parsedDataAlliances[i].members.push(member.id);
              parsedDataAlliances[i].coLeaders = parsedDataAlliances[i].coLeaders.filter(item => item != member.id);
              fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
              fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
              return `Succesfully demoted ${message.mentions.members.first()} from Co-Leader to **Member**`;
            }
          }
        }
      },
      
      fire = function(message, index){
        let rawdataAlliances = fs.readFileSync('alliances.json');
        let parsedDataAlliances = JSON.parse(rawdataAlliances);
        let rawdataUser = fs.readFileSync('userdata.json');
        let parsedData = JSON.parse(rawdataUser);
        let member = message.mentions.members.first();
        var memberIndex = -1;
        for(var i = 0; i < parsedData.length; i++){
          if(parsedData[i].id === member.id){
            memberIndex = i;
            break;
          }
        }
        if(memberIndex == -1){
          return "sorry, I couldn't find his user.";
        }
        for(var i = 0; i < parsedDataAlliances.length; i++){
          if(parsedDataAlliances[i].name == parsedData[index].alliance){
            parsedData[memberIndex].allianceRank = null;
            if(parsedData[memberIndex].allianceRank == "M"){
              parsedDataAlliances[i].members = parsedDataAlliances[i].members.filter(item => item != member.id);
            }
            else {
              parsedDataAlliances[i].coLeaders = parsedDataAlliances[i].coLeaders.filter(item => item != member.id);
            }
            parsedData[memberIndex].alliance = null;
            parsedData[memberIndex].allianceRank = null;
            fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
            fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
            return `Succesfully fired ${message.mentions.members.first()} from your alliance`;
          }
        }
      },
      
      setAllianceStatus = function(mode, index){
        let rawdataAlliances = fs.readFileSync('alliances.json');
        let parsedDataAlliances = JSON.parse(rawdataAlliances);
        let rawdataUser = fs.readFileSync('userdata.json');
        let parsedData = JSON.parse(rawdataUser);
        for(let i = 0; i < parsedDataAlliances.length;i++){
          if(parsedDataAlliances[i].name == parsedData[index].alliance){
            parsedDataAlliances[i].public = mode;
            fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
            if(mode){
              return "the alliance is now set to public."
            }
            return "the alliance was set to invite-only."
          }
        }
      },
      
      upgradeAlliance = function(index){
        let rawdataAlliances = fs.readFileSync('alliances.json');
        let parsedDataAlliances = JSON.parse(rawdataAlliances);
        let rawdataUser = fs.readFileSync('userdata.json');
        let parsedData = JSON.parse(rawdataUser);
        var ind = -1;
        for(var i = 0; i < parsedDataAlliances.length; i++){
          if(parsedData[index].alliance == parsedDataAlliances[i].name){
            ind = i;
            break;
          }
        }
        if(parsedDataAlliances[ind].level == 1){
          if(parsedData[index].money < 500000){
            return "you don't have enough money to upgrade your alliance to level 2. Upgrading your alliance to level 2 costs 500,000 coins.";
          }
          else {
            parsedData[index].money -= 500000;
            parsedDataAlliances[ind].level = 2;
            fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
            fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
            return "Succesfully upgraded your alliance to level 2";
          }
        }
        else if(parsedDataAlliances[ind].level == 2){
          if(parsedData[index].money < 1000000){
            return "you don't have enough money to upgrade your alliance to level 3. Upgrading your alliance to level 3 costs 1,000,000 coins.";
          }
          else {
            parsedData[index].money -= 1000000;
            parsedDataAlliances[ind].level = 3;
            fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
            fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
            return "Succesfully upgraded your alliance to level 3";
          }
        }
        else if(parsedDataAlliances[ind].level == 3){
          if(parsedData[index].money < 5000000){
            return "you don't have enough money to upgrade your alliance to level 4. Upgrading your alliance to level 4 costs 5,000,000 coins.";
          }
          else {
            parsedData[index].money -= 5000000;
            parsedDataAlliances[ind].level = 4;
            fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
            fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2))
            return "Succesfully upgraded your alliance to level 4";
          }
        }
        return "Error";
      },
      
      inviteToAlliance = function (message, index){
        let rawdataAlliances = fs.readFileSync('alliances.json');
        let parsedDataAlliances = JSON.parse(rawdataAlliances);
        let rawdataUser = fs.readFileSync('userdata.json');
        let parsedData = JSON.parse(rawdataUser);
        let member = message.mentions.members.first();
        var memberIndex = -1;
        for(var i = 0; i < parsedData.length; i++){
          if(parsedData[i].id === member.id){
            memberIndex = i;
            break;
          }
        }
        if(memberIndex == -1){
          return "sorry, I couldn't find his user.";
        }
        if(parsedData[memberIndex].alliance != null){
          return "sorry, this User already joined another alliance.";
        }
        for(var i = 0; i < parsedDataAlliances.length; i++){
          if(parsedDataAlliances[i].name == parsedData[index].alliance){
            parsedDataAlliances[i].invitedUsers.push(member.id);
            fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2))
            return `Succesfully invited ${message.mentions.members.first()} to join your alliance`;
          }
        }
      }
      
      buyItemAlliance = function(itemShort, index, price, minLevel){
        if(parsedData[index].allianceRank == "M"){
          return "sorry, you can't buy this upgrade.";
        }
        if(parsedData[index].money >= price){
          for(var i = 0; i < parsedDataAlliances.length; i++){
            if(parsedDataAlliances[i].name == parsedData[index].alliance){
              if(parsedData[i].level < minLevel){
                return "only level " + minLevel +"+ alliances can buy this upgrade.";
              }
              parsedData[index].money -= price;
              parsedDataAlliances[i].upgrades.push(itemShort);
              break;
            }
          }
          fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
          fs.writeFileSync("alliances.json", JSON.stringify(parsedDataAlliances, null, 2));
          return "you successfully bought the small farm upgrade for your alliance.";
        }
      return "You don't have enough money to buy that item.";
      }
};