import { user, alliance } from "../../utils/interfaces";
import { getAlliance, updateValueForAlliance } from "../../utils/databasehandler";

export async function toggleStatus(user: user, mode: boolean): Promise<string> {
    updateValueForAlliance(user.alliance as string, "public", mode);
    if (mode) {
        return "the alliance is now set to public."
    }
    return "the alliance was set to invite-only."
}