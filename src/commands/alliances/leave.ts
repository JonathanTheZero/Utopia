import { Message } from "discord.js";
import { getUser, getAlliance, editAllianceArray, updateValueForUser, deleteAlliance, updateValueForAlliance } from "../../utils/databasehandler";
import { user, alliance } from "../../utils/interfaces";

export async function leaveAlliance(message: Message, _args: string[]) {
    let user: user = await getUser(message.author.id);
    let alliance: alliance = await getAlliance(user.alliance as string) as alliance;
    let memberRank = user.allianceRank;
    if (memberRank === "M") editAllianceArray(alliance.name, "members", "$pull", user._id);
    else if (memberRank === "C") editAllianceArray(alliance.name, "coLeaders", "$pull", user._id);
    else if (memberRank === "L") {
        if (alliance.coLeaders.length <= 0 && alliance.members.length <= 0) deleteAlliance(user.alliance as string);
        else return message.reply("You are the leader of " + user.alliance + ". You have to promote one of the co-leaders to the new leader via `.promote <mention>` first.");
    }
    updateValueForAlliance(alliance.name, "clientStates", -user.clientStates.length, "$inc");
    updateValueForUser(user._id, "alliance", null);
    updateValueForUser(user._id, "allianceRank", null);
    return message.reply("you have left your alliance");
}