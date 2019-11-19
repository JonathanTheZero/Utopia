const config = require("./config.json");

const helpEmbed = {
    color: parseInt(config.properties.embedColor),
    title: "Welcome to the help menu. Please choose a category",
    fields: [
        {
            name: 'General help:',
            value: "type `.help general` to view the help menu for the general commands",
        },
        {
            name: 'Alliance help:',
            value: "type `.help alliance` to view the alliance help menu",
        },
        {
            name: "Battle help",
            value: "type `.help battle` to view the battle help menu",
        },
        {
            name: "Miscellaneous help:",
            value: "type `.help misc` to view the help menu for everything else",
        },
        {
            name: "Moderation help:",
            value: "type `.help mod` to view the help menu for everything else",
        }
    ],
    timestamp: new Date(),
    footer: config.properties.footer,
};

const gHelpMenu = {
    color: parseInt(config.properties.embedColor),
    title: "General help menu",
    fields: [
        {
            name: '`.create`',
            value: "Create an account and start buidling your Utopia!",
        },
        {
            name: '`.me` or `.stats [mention/ID]`',
            value: "View your stats or these of other players.",
        },
        {
            name: "`.work`",
            value: "You gain up to 10,000 coins from working. You can work every 30 minutes.",
        },
        {
            name: "`.crime`",
            value: "You can commit a crime every 4 hours. You have a 5% chance to increase your networth by 50,000 coins or up to 5% (whichever is higher), but be careful: you can also lose up to 2% of your current networth.",
        },
        {
            name: "`.lb` or `.leaderboard [type] [page]`",
            value: "View the global leaderboard. Allowed types are 'allaince', 'wins', 'money', 'food' and 'population'.",
        },
        {
            name: "`.shop` or `.store [category]`",
            value: "View the shop (you'll find further information there).",
        },
        {
            name: "`.buy <item>`",
            value: "Buy an item from the shop."
        },
        {
            name: "`.use <item>`",
            value: "Use on of your purchased items."
        },
        {
            name: "`.inventory` or `.inv`",
            value: "View the items you purchased but haven't used yet."
        },
        {
            name: "`.kill <amount>`",
            value: "Kill a specific amount of your population."
        },
        {
            name: "`.alliance [mention/ID]`",
            value: "View the stats of your alliance or of the alliance of another user."
        },
        {
            name: "`.bet <amount>` or `.coinflip <amount>`",
            value: "You either gain the amount you bet or you lose it. (Note: use `.bet a` to bet all your money or `.bet h` to bet half of your money)"
        },
        {
            name: "`.payout [mention]`",
            value: "See how many ressources you or another user will receive during the next payout"
        }
    ],
    timestamp: new Date(),
    footer: config.properties.footer,
};

const allianceHelpEmbed = {
    color: parseInt(config.properties.embedColor),
    title: "Alliance help menu",
    fields: [
        {
            name: '`.createalliance <name>`',
            value: "Create your own alliance. (Price: 250,000)",
        },
        {
            name: '`.leavealliance`',
            value: "Leave your current alliance",
        },
        {
            name: "`.joinalliance <name>`",
            value: "Join an alliance",
        },
        {
            name: "`.promote <mention/ID>` (Leader only)",
            value: "Promote a member or Co-Leader of your alliance (there is a maximum of two co-leaders)",
        },
        {
            name: "`.demote <mention/ID>` (Leader only)",
            value: "Demote a member of your alliance.",
        },
        {
            name: "`.fire <mention/ID>` (Leader only)",
            value: "Fire a member of your alliance.",
        },
        {
            name: "`.renamealliance <new name>` (Leader and Co-Leaders only)",
            value: "Rename your alliance."
        },
        {
            name: "`.setpublic` and `.setprivate` (Leader and Co-Leaders only)",
            value: "Change the setting of your alliance. Public: Everyone can join, Private: Only invited users can join."
        },
        {
            name: "`.invite <mention/ID>` (Leader and Co-Leaders only)",
            value: "Invite a member to your alliance."
        },
        {
            name: "`.upgradealliance` (Leader and Co-Leaders only)",
            value: "Level up your alliance in order to buy more upgrades. A level two alliance can own every farm two times for example. The current maximum is level 4."
        },
        {
            name: "`.alliance [mention/ID]`",
            value: "View the stats of your alliance or of the alliance of another user."
        },
        {
            name: "`.send <mention/ID> <amount>`",
            value: "Send a specific amount of money to one of your alliance members."
        },
        {
            name: "`.alliancemembers [mention/ID]`",
            value: "See a detailed list of all members and invited users from your alliance or the alliance of another user"
        },
        {
            name: "`.deposit <amount>`",
            value: "Deposit a specific amount of money in the bank of your alliance"
        },
        {
            name: "`.settax <value between 0 and 90>` (Leader and Co-Leaders only)",
            value: "Set the taxrate of your alliance. The tax only applies to the work and crime commands."
        }
    ],
    timestamp: new Date(),
    footer: config.properties.footer,
};

const miscEmbed = {
    color: parseInt(config.properties.embedColor),
    title: "Miscellaneous help menu",
    fields: [
        {
            name: '`.autoping`',
            value: "Enable/Disable autopings when you can work or commit a crime again. (Enabled by default)",
        },
        {
            name: '`.payoutdms`',
            value: "Enable/Disable DMs when the payouts are given out. (Disabled by default)",
        },
        {
            name: "`.invitelink`",
            value: "Grab an invite link to add me to your server!",
        },
        {
            name: "`.patreon`",
            value: "Support the bot on Patreon!",
        },
        {
            name: "`.server`",
            value: "Join the official Utopia server!"
        },
        {
            name: "`.vote`",
            value: "You can vote every 12h for Utopia on top.gg to get 15k money for free!"
        },
        {
            name: "`.statistics`",
            value: "View some statistics about the bot"
        }
    ],
    timestamp: new Date(),
    footer: config.properties.footer,
};

const modEmbed = {
    color: parseInt(config.properties.embedColor),
    title: "Moderation help",
    description: "The bot role needs to be ranked above the roles of the other users in order for these commands to work.",
    fields: [
        {
            name: '`.ban <mention/ID>`',
            value: "Bans a user from the server.",
        },
        {
            name: '`.yeet <mention/ID>` or `.kick <mention/ID>`',
            value: "Kicks a user from the server",
        },
        {
            name: "`.purge <amount>`",
            value: "Delete a specific amount of messages (up to 100 at the same time).",
        },
        {
            name: "Miscellaneous help:",
            value: "type `.help misc` to view the help menu for everything else",
        },
    ],
    timestamp: new Date(),
    footer: config.properties.footer,
};

module.exports = {
    generalHelpMenu : gHelpMenu,
    allianceHelpMenu : allianceHelpEmbed,
    helpMenu : helpEmbed,
    miscHelpMenu : miscEmbed,
    modHelpMenu : modEmbed
}