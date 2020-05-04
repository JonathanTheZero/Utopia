import { user } from "../../utils/interfaces";
import { updateValueForAlliance } from "../../utils/databasehandler";

export async function toggleStatus(user: user, mode: boolean): Promise<string> {
    updateValueForAlliance(user.alliance!, "public", mode);
    if (mode) {
        return "the alliance is now set to public."
    }
    return "the alliance was set to invite-only."
}