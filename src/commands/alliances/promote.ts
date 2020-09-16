import { user, alliance } from "../../utils/interfaces";
import { getAlliance, updateValueForUser, editAllianceArray, updateValueForAlliance } from "../../utils/databasehandler";

export async function promote(author: user, member: user): Promise<string> {
    if (!member)
        return "sorry, I couldn't find his user.";
    if (author.alliance != member.alliance)
        return "you can't promote someone who isn't part of your alliance.";
    let alliance: alliance = await getAlliance(author.alliance as string) as alliance;
    if (member.allianceRank == "M") {
        if (alliance.coLeaders.length < 2) {
            updateValueForUser(member._id, "allianceRank", "C");
            editAllianceArray(alliance.name, "coLeaders", "$push", member._id);
            editAllianceArray(alliance.name, "members", "$pull", member._id);
            return `Succesfully promoted ${member.tag} from Member to **Co-Leader**`;
        }
        return "an alliance can't have more than two Co-Leaders at the same time."
    } else {
        updateValueForUser(member._id, "allianceRank", "L");
        updateValueForUser(author._id, "allianceRank", "C");
        updateValueForAlliance(alliance.name, "leader", { _id: member._id, tag: member.tag});
        editAllianceArray(alliance.name, "coLeaders", "$pull", member._id);
        editAllianceArray(alliance.name, "coLeaders", "$push", author._id);
        return `Succesfully promoted ${member.tag} from Co-Leader to **Leader**`;
    }
}