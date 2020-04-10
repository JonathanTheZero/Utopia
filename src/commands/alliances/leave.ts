import { Message } from "discord.js";
import { getUser, getAlliance, editAllianceArray, updateValueForUser, deleteAlliance } from "../../utils/databasehandler";
import { user, alliance } from "../../utils/interfaces";

export async function leaveAlliance(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);
    let alliance: alliance = await getAlliance(user.alliance as string) as alliance;
    let memberRank = user.allianceRank;
    if (memberRank === "M") {
        editAllianceArray(alliance.name, "members", "$pull", user._id);
        updateValueForUser(user._id, "alliance", null);
        updateValueForUser(user._id, "allianceRank", null);
    }
    else if (memberRank === "C") {
        editAllianceArray(alliance.name, "coLeaders", "$pull", user._id);
        updateValueForUser(user._id, "alliance", null);
        updateValueForUser(user._id, "allianceRank", null);
    }
    else if (memberRank === "L") {
        if (alliance.coLeaders.length <= 0 && alliance.members.length <= 0) {
            updateValueForUser(user._id, "alliance", null);
            updateValueForUser(user._id, "allianceRank", null);
            deleteAlliance(user.alliance as string);
        }
        else {
            return message.reply("You are the leader of " + user.alliance + ". You have to promote one of the co-leaders to the new leader via `.promote <mention>` first.");
        }
    }
    return message.reply("you have left your alliance");
}