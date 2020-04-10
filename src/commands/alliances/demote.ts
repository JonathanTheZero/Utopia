import { user, alliance } from "../../utils/interfaces";
import { getAlliance, updateValueForUser, editAllianceArray } from "../../utils/databasehandler";

export async function demote(author: user, member: user): Promise<string> {
    if (author.alliance != member.alliance) {
        return "you can't demote someone who isn't part of your alliance.";
    }
    let alliance: alliance = await getAlliance(member?.alliance as string) as alliance;
    if (member.allianceRank == "M")
        return `you can't demote ${member.tag} since he is only a member. Use \`.fire <mention>\` to fire a member from your alliance. `;
    else {
        updateValueForUser(member._id, "allianceRank", "M");
        editAllianceArray(alliance.name, "members", "$push", member._id);
        editAllianceArray(alliance.name, "coLeaders", "$pull", member._id);
        return `Succesfully demoted ${member.tag} from Co-Leader to **Member**`;
    }
}