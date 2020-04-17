import { user, army } from "../../utils/interfaces";
import { Message } from "discord.js";
import { getUser } from "../../utils/databasehandler";

//format: .mobilize armyID Infantry Artillery Tanks Jets
export async function mobilize(message: Message, args: string[]) {
    if(!args[3]) return message.reply("please follow the syntax of `..mobilize <armyID> <Infantry> <Artillery> <Tanks> <Jets>`");
    const user = await getUser(message.author.id);

    const army: army = {
        if: parseInt(args[0]),
        art: parseInt(args[1]),
        tnk: parseInt(args[2]),
        jet: parseInt(args[3])
    };
}
