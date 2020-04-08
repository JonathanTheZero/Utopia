"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function kick(message, args) {
    if (!message.member.hasPermission(['KICK_MEMBERS'], false, true, true)) {
        return message.reply("this command can only be used by Members who have Kick permissions");
    }
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member)
        return message.reply("Please mention/ID a valid member of this server");
    if (!member.kickable)
        return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    let reason = args.slice(1).join(' ');
    if (!reason)
        reason = "No reason provided";
    await member.kick(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
}
exports.kick = kick;
