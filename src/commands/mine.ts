import { Message, Client } from "discord.js";
import { user, alliance } from "../utils/interfaces";
import { getUser, updateValueForUser} from "../utils/databasehandler";
import { reminder } from "../utils/utils";

export async function digmine(message: Message, client: Client, args: string[]){
    let user: user = await getUser(message.author.id);

    if(!user){
        return message.reply("you haven't created an account yet, please use `.create` command")
    }

    for (var i = 0; i < args.length; i++){
        args[i] == args[i].toLowerCase()
    }

    if (user.money < 10000 ){
        return message.reply("you don't have the ")
    }


}

