import { Message, Client } from "discord.js";
import * as config from "../../static/config.json";
import { user, alliance} from "../../utils/interfaces";
import "../../utils/utils";
import { getUser, getAlliance } from "../../utils/databasehandler";

export async function allianceMembers(message: Message, args: string[], client: Client){
    var user: user, url: string;
    if (typeof args[0] === "undefined") {
        user = await getUser(message.author.id);
        url = `${message.author.displayAvatarURL}`;
    }
    else {
        user = await getUser(message.mentions?.users?.first()?.id || args[0]);
        url = client.users.get(user._id)?.displayAvatarURL as string;
    }

    let alliance: alliance = await getAlliance(!user ? args.join(" "): user.alliance as string) as alliance;
    if (!alliance) {
        if (!args[0])
            return message.reply("you haven't joined an alliance yet.");
        else
            return message.reply(user.tag + " hasn't joined an alliance yet");
    }

    var coLeaders = "This alliance doesn't have any Co-Leaders";
    const cl = alliance.coLeaders;
    if(cl.length == 1){
      coLeaders = "<@" + cl[0] + ">";
    }
    else if(cl.length == 2){
      coLeaders = " <@" + cl[0] + "> and <@" + cl[1] + ">";
    }
    var members = "This alliance doesn't have any members";
    if(alliance.members.length > 0){
      members = ""
      for(let i = 0; i < alliance.members.length;i++){
        members += "<@" + alliance.members[i] +">\n";
      }
    }
    var invs = "This alliance doesn't have any active invites";
    if(alliance.invitedUsers.length > 0){
      invs = ""
      for(let i = 0; i < alliance.invitedUsers.length;i++){
        invs += "<@" + alliance.invitedUsers[i] +">\n";
      }
    }
    const u = alliance.upgrades;
    message.channel.send(
      { 
        embed: {
          color: parseInt(config.properties.embedColor),
          title: "Data for " + alliance.name,
          thumbnail: {
            url: url,
          },
          fields: [
            {
              name: 'Leader:',
              value: "<@" + alliance.leader._id +">",
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
        } 
    });
}