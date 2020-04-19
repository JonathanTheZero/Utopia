import { alliance, user } from "../../utils/interfaces";
import { getAlliance, editAllianceArray } from "../../utils/databasehandler";

export async function invite(name: string, member: user): Promise<string> {
    let alliance: alliance = await getAlliance(name) as alliance;
    if (member.alliance != null) return "sorry, this user already joined another alliance.";
    
    editAllianceArray(name, "invitedUsers", "$push", member._id);
    return `Succesfully invited ${member.tag} to join your alliance`;
}