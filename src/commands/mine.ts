import { Message, Client } from "discord.js";
import { user, alliance } from "../utils/interfaces";
import { getUser, updateValueForUser} from "../utils/databasehandler";
import { reminder, getRandomInt } from "../utils/utils";

export async function digmine(message: Message, args: string[]){
    let user: user = await getUser(message.author.id);

    if(!user){
        return message.reply("you haven't created an account yet, please use `.create` command")
    }

    for (var i = 0; i < args.length; i++){
        args[i] == args[i].toLowerCase()
    }

    if (user.money < 10000* user.resources.totaldigs ){
        return message.reply(`you don't have ${10000* user.resources.totaldigs}`)
    }

    if (Math.floor(Date.now() / 1000) - user.lastdig < 14400){
        return message.reply(`You can dig a new mine in ${(Math.floor(Date.now() / 1000)) - user.lastdig}`)
    }

    else{
        let minetype = (getRandomInt(3))
        user.money = user.money - (10000* user.resources.totaldigs))
        
        if (minetype == 0){
            user.lastdig = Math.floor(Date.now() / 1000)
            return message.reply("Your digging has returned no new mines")
        }

        if (minetype == 1){
            user.lastdig = Math.floor(Date.now() / 1000)
            //database handler to add mine
            //database handler to give 100 steel
            user.resources.steelmine += 1
            user.resources.steel += 100
            return message.reply("Your digging is successful. You got a new steel mine, and has given a initial return of 100 steel")
            
        }

        if (minetype == 2){
            user.lastdig = Math.floor(Date.now() / 1000)
            //database handler to add mine
            //database handler to give 100 steel
            user.resources.oilrig += 1
            user.resources.oil += 100
            return message.reply("Your digging is successful. You got a new steel mine, and has given a initial return of 100 barrels of oil")
            
        }
    }

}

export function mine(message: Message, args: string[]){
    let user: user = await getUser(message.author.id);
    
    if(!user){
        return message.reply("you haven't created an account yet, please use `.create` command")
    }

    for (var i = 0; i < args.length; i++){
        args[i] == args[i].toLowerCase()
    }

}

