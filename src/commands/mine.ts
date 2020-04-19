import { Message, Client, User } from "discord.js";
import { user, alliance } from "../utils/interfaces";
import { getUser, updateValueForUser } from "../utils/databasehandler";
import { getRandomInt, getRandomRange } from "../utils/utils";

export async function digmine(message: Message) {
    let user: user = await getUser(message.author.id);

    if (!user) {
        return message.reply("you haven't created an account yet, please use `.create` command")
    }

    if (user.money < 10000 * user.resources.totaldigs) {
        return message.reply(`you don't have ${10000 * user.resources.totaldigs}`)
    }

    if (Math.floor(Date.now() / 1000) - user.lastdig < 14400) {
        return message.reply(`You can dig a new mine in ${new Date((Math.floor(Date.now() / 1000)) - user.lastdig).toISOString().substr(11, 8)}`)
    }

    else {
        let minetype = (getRandomInt(3))
        user.money = user.money - (10000 * user.resources.totaldigs))

        if (minetype == 0) {
            user.lastdig = Math.floor(Date.now() / 1000)
            return message.reply("Your digging has returned no new mines")
        }

        if (minetype == 1) {
            user.lastdig = Math.floor(Date.now() / 1000)
            //database handler to add mine
            //database handler to give 100 steel
            user.resources.steelmine += 1
            updateValueForUser(user._id, "steel", 100, "$inc")
            return message.reply("Your digging is successful. You got a new steel mine, and has given a initial return of 100 steel")

        }

        if (minetype == 2) {
            user.lastdig = Math.floor(Date.now() / 1000)
            //database handler to add mine
            user.resources.oilrig += 1
            updateValueForUser(user._id, "oil", 100, "$inc")
            return message.reply("Your digging is successful. You got a new steel mine, and has given a initial return of 100 barrels of oil")

        }
    }

}

export async function mine(message: Message, args: string[]) {
    let user: user = await getUser(message.author.id);

    if (!user) {
        return message.reply("you haven't created an account yet, please use `.create` command")
    }

    if (user.resources.oilrig == 0 && user.resources.steelmine == 0) {
        return message.reply("you don't have any mines to mine")
    }

    if (args[0] != "steel" && args[0] != "oil") {
        return message.reply("Wrong mine type, please do `.mine steel` or `.mine oil`")
    }

    if (user.resources.minereturn == 1){
        return message.reply("Your mines can't make new resources") // Add days
    }

    if (Math.floor(Date.now() / 1000) - user.lastmine < 3600){
        return message.reply(`You can mine in ${new Date((3600 - (Math.floor(Date.now() / 1000) - user.lastWorked)) * 1000).toISOString().substr(11, 8)}`)
    }

    else {
        if (args[0] == "steel") {
            let payout = getRandomRange(400, 10000)

            for (var i = 0; i <= user.resources.steelmine; i++) {
                user.resources.steel += (payout - (payout * user.resources.minereturn))
            }

            return message.reply(`Your steel mines each produced ${(payout - (payout * user.resources.minereturn))} steel for a total of ${(payout - (payout * user.resources.minereturn)) * user.resources.steelmine} steel`)
        }

        if (args[0] == "oil") {
            let payout = getRandomRange(400, 10000)

            for (var i = 0; i <= user.resources.oilrig; i++) {
                user.resources.oil += (payout - (payout * user.resources.minereturn))
            }

            return message.reply(`Your oil rigs each produced ${(payout - (payout * user.resources.minereturn))} barrels for a total of ${(payout - (payout * user.resources.minereturn)) * user.resources.oilrig} barrels`)
        }

        user.resources.minereturn = (user.resources.minereturn - (user.resources.minereturn*getRandomRange(10, user.resources.minereturn/2)))/100
        
        if (user.resources.minereturn <= 0){
            user.resources.minereturn = 100/100
        }

        if (user.minereset == 0){
            user.minereset = Math.floor(Date.now() / 1000)
        }

        user.lastmine = Math.floor(Date.now() / 1000)
    }

}

