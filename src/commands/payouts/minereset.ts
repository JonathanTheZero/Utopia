import { Client, TextChannel } from "discord.js";
import { getAllUsers, updateValueForUser, editConfig } from "../../utils/databasehandler";
import { user } from "../../utils/interfaces";
import * as config from "../../static/config.json";

export async function mineReset(client: Client){
    let users: user[] = await getAllUsers();
    const channel = <TextChannel>client.channels.get(config.payoutChannel);
    for(const u of users){
        updateValueForUser(u._id, "minereturn", 1, "$set");

        if(u.payoutDMs){
            try {
                client.users.get(u._id)?.send("Your mines have been reset, happy mining!");
            }
            catch {}
        }
    }
    channel.send({
        embed: {
            title: "Your mines have been reset, happy mining!",
            color: 0x00FF00,
            timestamp: new Date()
        }
    });
    editConfig("lastMineReset", Date.now());
    setTimeout(() => mineReset(client), 604800 * 1000);
}