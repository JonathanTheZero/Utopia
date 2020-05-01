import { user } from "../../utils/interfaces";
import { editAllianceArray, updateValueForUser } from "../../utils/databasehandler";

export async function fire(name: string, author: user, member: user): Promise<string> {
    if (!member) return "sorry, I couldn't find his user.";
    if (author.alliance != member.alliance) return "you can't fire someone who isn't part of your alliance.";
    if (member.allianceRank == "M") editAllianceArray(name, "members", "$pull", member._id);
    else editAllianceArray(name, "coLeaders", "$pull", member._id);
    updateValueForUser(member._id, "allianceRank", null);
    updateValueForUser(member._id, "alliance", null)
    return `Succesfully fired ${member.tag} from your alliance`;
}