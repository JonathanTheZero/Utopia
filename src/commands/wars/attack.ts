import { Message } from "discord.js";
import { user, war } from "../../utils/interfaces";
import { getUser, findWarByUser, moveArmy } from "../../utils/databasehandler";

export async function attack(message: Message, args: string) {
    if (!args[1]) return message.reply("please follow the syntax of `.attack <armyindex> <enemy-army>`");
    const u: user = await getUser(message.author.id);

    let w: war | null = await findWarByUser(u._id);
    if (!w) return message.reply("you are not fighting in any active battles.");
    //if (!(w.p1.ready && w.p2.ready)) return message.reply("not everyone is ready yet!");

    const p1 = u._id === w.p1._id;
    const [a, b] = p1 ? [w.p1, w.p2] : [w.p2, w.p1];
    const curr = a.armies[parseInt(args[0]) - 1];
    const opp = b.armies[parseInt(args[1]) -1];

    if (curr.moved) return message.reply("you already moved that army this round!");
    if (!curr.field) return message.reply("you haven't deployed that army yet!");

    if(Math.abs(curr.field![0] - opp.field![0]) > 1 || Math.abs(curr.field![1] - opp.field![1]) > 1){
        return message.reply("that army is out of range! You can only attack armies on neighbouring fields.");
    }
    else {
        message.channel.send({
            embed: {
                title: `Battle between Army ${args[0]} of ${a.tag} and Army ${args[1]} of ${b.tag}`
            }
        });
    }
}