import { Message } from "discord.js";
import { user, alliance } from "../utils/interfaces";
import { getUser, getAlliance, editAllianceArray, updateValueForUser } from "../utils/databasehandler";

export async function joinalliance(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);
    if (!user)
        return message.reply("you haven't created an account yet, please use the `create` command.");
    else if (user.alliance != null)
        return message.reply("you can't join another alliance, because you already joined one. Leave your alliance with `.leavealliance` first.");
    if (!user.alliance) {
        const allianceName = args.join(" ");
        let alliance: alliance = await getAlliance(allianceName) as alliance;
        if (!alliance) return message.reply("this alliance doesn't exist, you can form it with `.createalliance " + allianceName + "`.");

        if (alliance.public || alliance.invitedUsers.includes(message.author.id)) {
            if (alliance.invitedUsers.includes(message.author.id)) {
                editAllianceArray(allianceName, "invitedUsers", "$pull", message.author.id);
            }
            updateValueForUser(message.author.id, "allianceRank", "M");
            updateValueForUser(message.author.id, "alliance", allianceName);
            editAllianceArray(allianceName, "members", "$push", message.author.id);
            return message.reply("you are now a member of " + allianceName);
        }
        else {
            return message.reply("You can't join this alliance because it's set to private. Ask the Leader or a Co-Leader to invite you.");
        }
    }
}
