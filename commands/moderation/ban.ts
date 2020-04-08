import { Message } from "discord.js";

export async function ban(message: Message, args: string[]) {
    if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'], false, true, true))
        return message.reply("this command can only be used by Members who have Kick and Ban permissions");

    let member = message.mentions.members.first();
    if (!member)
        return message.reply("Please mention/ID a valid member of this server");

    if (!member.bannable)
        return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if (!reason) reason = "No reason provided";

    await member.ban(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));

    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
}