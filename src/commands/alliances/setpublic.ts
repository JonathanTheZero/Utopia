import { user } from "../../utils/interfaces";
import { updateValueForAlliance } from "../../utils/databasehandler";

export async function toggleStatus(user: user, mode: boolean): Promise<string> {
    updateValueForAlliance(user.alliance!, "public", mode);
    return mode ? "the alliance is now set to public." : "the alliance was set to invite-only.";
}