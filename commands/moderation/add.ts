import { Message } from "discord.js";
import * as config from "../../config.json";

export async function add(message: Message, args: string[]){
    if(!config.botAdmins.includes(parseInt(message.author.id))) return message.reply("only selected users can use this command. If any problem occured, DM <@393137628083388430>.");
    if(!args[2]) return message.reply("please supply valid parameters following the syntax `.add <type> <mention/ID> <amount>`.");
    let parsedData = JSON.parse(fs.readFileSync('userdata.json'));

    var index = parsedData.findIndex((item, i) => {
      return item.id == message.mentions.users.first().id;
    });

    if(index === -1) return message.reply("this user hasn't created an account yet.");
    const a = parseInt(args[2])
    if(a == null) return message.reply("this isn't a valid amount.");
    if(["money", "m"].includes(args[0])){
      parsedData[index].money += a;
      message.reply("Succesfully added " + a.commafy() + " " + `money to ${message.mentions.users.first()} balance.`);
    }
    else if(["food", "f"].includes(args[0])){
      parsedData[index].resources.food += a;
      message.reply("Succesfully added " + a.commafy() + " " + `food to ${message.mentions.users.first()} balance.`);
    }
    else if(["population", "p"].includes(args[0])){
      parsedData[index].resources.population += a;
      message.reply("Succesfully added " + a.commafy() + " " + `population to ${message.mentions.users.first()} balance.`);
    }
   
    fs.writeFileSync("userdata.json", JSON.stringify(parsedData, null, 2));
}