import { Message } from "discord.js";

export async function kick(message: Message, args: string[]) {
    if (!message.member!.permissions.has(['KICK_MEMBERS'], true)) {
        return message.reply("this command can only be used by Members who have Kick permissions");
    }
    let member = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]);
    
    if (!member)
        return message.reply("Please mention/ID a valid member of this server");

    if (!member.kickable)
        return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    let reason = args.slice(1).join(' ');
    if (!reason) reason = "No reason provided";

    await member.kick(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
}