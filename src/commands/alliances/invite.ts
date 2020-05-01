import { user } from "../../utils/interfaces";
import { editAllianceArray } from "../../utils/databasehandler";

export async function invite(name: string, member: user): Promise<string> {
    if (member.alliance != null) return "sorry, this user already joined another alliance.";

    editAllianceArray(name, "invitedUsers", "$push", member._id);
    return `Succesfully invited ${member.tag} to join your alliance`;
}