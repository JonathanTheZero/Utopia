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
        },
        {
            name: "To view an in-depth guide, use `.guide`",
            value: "\u200b"
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
            name: "`.loan`",
            value: "Using loan, you can take out money to help you further expand your empire. Use `.loancalc` to see the maximum you can take as a loan, or `.loancalc <number>` to see how much you might owe if you take out a smaller sum. Use `payback [amount]` to pay it back."
        },
        {
            name: "`.send <mention/ID> <amount>`",
            value: "Send a specific amount of money to another user."
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
            name: "`.donate`",
            value: "Support the bot on Patreon or on PayPal!",
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
        }
    ],
    timestamp: new Date(),
    footer: config.properties.footer,
};

const guideEmbed = {
    color: parseInt(config.properties.embedColor),
    title: "In-depth game-guide",
    description: `If you have any additional questions, feel free to join the official server [here](${config.serverInvite}).`,
    fields: [
        {
            name: "**Starting**",
            value: "To start your empire, say `.create`."
        },
        {
            name: "**Earning money**",
            value: "Every 30 minutes you can do `.work`, which gives you up to 10,000 money. " +
                "`.crime` has 5% to give you 50,000+ money but you can also lose up to 2% of your balance. " +
                "If you're feeling lucky, you can also gamble by saying `.bet <amount>/a`. You have 50% to earn double your bet and 50% to lose it. To see how much money you have, say `.stats`."
        },
        {
            name: "**Population**",
            value: "Your population works once every 12 hours, giving you 1 money per 10-20 people and consuming ~2 food per person in the process. You get population by buying upgrades."
        },
        {
            name: "**Upgrades**",
            value: "When you earn enough money, you can go to a store and finally start getting population. You can see the list of upgrades by saying `.store p` and buy something by saying `.buy <name>`." +
                "Since v1.2 there are also personal farms, which produce food only for you, but alliance farms are still stronger"
        },
        {
            name: "**Alliances**",
            value: "Alliances give you food, but also tax a percentage of your income (0-90%, set by the owner)." + 
                "To join one, say `.joinalliance <name>` (you'll need an invite if you want to join a private alliance). When you're in an alliance, use `.send <mention>` to send money to a fellow member or `.deposit <amount>` if you want to serve the Soviet Union and help your alliance get something. " +
                "There's also an option to create your own alliance for 250k using `.createalliance <name>`. " +
                "You can learn how to manage it by saying `.help a`."
        },
        {
            name: "**Battles**",
            value: "Once you have enough population, money and food you can start dueling. Start a duel by saying `.duel <mention>`, set your troops by saying `.dividetroops <infantry regiments> <cavalry regiments> <artillery regiments>` and confirm it with `.ready`. Each regiment is composed of 1000 troops. The stats for each troop type are:\n" + 
                "-Infantry: 50 coins per regiment to create and 20 food per regiment per round to feed. Has 30 Def and 25 Atk.\n" +
                "-Infantry: 100 coins per regiment to create and 300 food per regiment per round to feed. 25 HP, 15 Def and 15 Atk.\n" +
                "-Artillery: 1000 coins per regiment to create and 500 food per regiment per round to feed. 50 HP, 30 Def and 25 Atk.\n" +
                "You get a token for every battle you win (with a 12h cooldown). Spend them on troop upgrades in `.store b`.\n"
        }
    ],
    timestamp: new Date(),
    footer: {
        text: config.properties.footer.text + "  •   Written by Astilimos#6295",
        icon_url: config.properties.footer.icon_url
    }
};

module.exports = {
    generalHelpMenu : gHelpMenu,
    allianceHelpMenu : allianceHelpEmbed,
    helpMenu : helpEmbed,
    miscHelpMenu : miscEmbed,
    modHelpMenu : modEmbed,
    guideEmbed: guideEmbed
}