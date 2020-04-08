"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function purge(message, args) {
    if (!message.member.hasPermission(['MANAGE_MESSAGES'], false, true, true)) {
        return message.reply("sorry, this command requires the manage message permission.");
    }
    const deleteCount = parseInt(args[0], 10) + 1;
    if (!deleteCount || deleteCount < 1 || deleteCount > 100)
        return message.reply("Please provide a number between 1 and 100 for the number of messages to delete");
    const fetched = await message.channel.fetchMessages({ limit: deleteCount });
    message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
}
exports.purge = purge;
