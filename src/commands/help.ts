import { properties, serverInvite } from "../static/config.json";

export const helpMenu = {
    color: parseInt(properties.embedColor),
    title: "Welcome to the help menu. Please choose a category",
    description: "To view an in-depth guide, use `.guide` (recommended for new players)",
    fields: [
        {
            name: 'General help:',
            value: "Type `.help general` to view the help menu for the general commands",
        },
        {
            name: 'Alliance help:',
            value: "Type `.help alliance` to view the alliance help menu",
        },
        {
            name: "War help",
            value: "Type `.warguide` to view the guide for the newly introduced wars!",
        },
        {
            name: "Market help",
            value: "Type `.help market` to view all commands related to the trade market and the new economics and taxes system"
        },
        {
            name: "Client-state help",
            value: "Type `.help client-states` to view all commands related to client-states"
        },
        {
            name: "Miscellaneous help:",
            value: "Type `.help misc` to view the help menu for everything else",
        },
        {
            name: "Moderation help:",
            value: "Type `.help mod` to view the help menu for everything else",
        }
    ],
    timestamp: new Date(),
    footer: properties.footer,
};

export const generalHelpMenu = {
    color: parseInt(properties.embedColor),
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
            name: "`.digmine`, `.minestats` and `.mine <oil | steel | all>`",
            value: "Every 4 hours you can dig and search for a mine. " +
                "If you are succesful, you find either a steel mine or an oil rig, you can claim your resources from those every hour using `.mine <oil | steel>`. " +
                "But be carful: Your mines will dry out slowly, to the point where they do not generate new resources, this factor is reset once a week!\n" +
                "For a more comprehensive overview over your stats, use `.minestats`"
        },
        {
            name: "`.utopia [mention/ID]`",
            value: "View how far you've built up your Utopia. The image changes based on your personal farms, population upgrades, total population and more."
        },
        {
            name: "`.lb` or `.leaderboard [type] [page]`",
            value: "View the global leaderboard. Allowed types are 'alliance', 'money', 'food' and 'population'.",
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
            name: "`.loan`, `.payback` and `.loancalc`",
            value: "Using loan, you can take out money to help you further expand your empire. " +
                "Use `.loancalc` to see the maximum you can take as a loan, or `.loancalc <number>` to see how much you might owe if you take out a smaller sum. " +
                "Use `payback [amount]` to pay it back."
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
            name: "`.alliance [mention/ID/alliance name]`",
            value: "View the stats of your alliance or of the alliance of another user."
        },
        {
            name: "`.bet <amount>`",
            value: "You either gain the amount you bet or you lose it. (Note: use `.bet a` to bet all your money or `.bet h` to bet half of your money). Percentages (like `.bet 10%` are also valid)"
        },
        {
            name: "`.payout [mention]`",
            value: "See how many ressources you or another user will receive during the next payout"
        },
        {
            name: "`.set-prefix`",
            value: "Change the prefix of the bot (only usable by members with 'manage server' permissions)"
        },
        {
            name: "`.time`",
            value: "A comprehensive overview over all cooldowns"
        }
    ],
    timestamp: new Date(),
    footer: properties.footer,
};

export const allianceHelpMenu = {
    color: parseInt(properties.embedColor),
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
            name: "`.alliancepayout [mention/ID]`",
            value: "Shows the food division for an alliance."
        },
        {
            name: "`.upgradealliance` (Leader and Co-Leaders only)",
            value: "Level up your alliance in order to buy more upgrades. A level two alliance can own every farm two times for example. The current maximum is level 15."
        },
        {
            name: "`.alliance [mention/ID/alliance name]`",
            value: "View the stats of your alliance or of the alliance of another user."
        },
        {
            name: "`.alliancemembers [mention/ID/alliance name]`",
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
    footer: properties.footer,
};

export const miscHelpMenu = {
    color: parseInt(properties.embedColor),
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
            name: "`.taxdms",
            value: "Enabled/Disable DMs whent taxes happen. (Enabled by default)."
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
        },
        {
            name: "`.set-prefix`",
            value: "Change the prefix of the bot (server admins only)"
        },
        {
            name: "`.delete`",
            value: "Delete your account"
        }
    ],
    timestamp: new Date(),
    footer: properties.footer,
};

export const modHelpMenu = {
    color: parseInt(properties.embedColor),
    title: "Moderation help and Set-up",
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
            name: "`.set-prefix`",
            value: "Change the prefix of the bot (only usable by members with 'manage server' permissions)"
        }
    ],
    timestamp: new Date(),
    footer: properties.footer,
};

export const guideEmbed = {
    color: parseInt(properties.embedColor),
    title: "In-depth game-guide",
    description: `If you have any additional questions, feel free to join the official server [here](${serverInvite}).`,
    fields: [
        {
            name: "**Starting**",
            value: "To start your empire, say `.create`."
        },
        {
            name: "**Earning money**",
            value: "Every 30 minutes you can do `.work`, which is the base source of income. " +
                "The maximum amount of coins you can get from working increases with increasing population. " +
                "`.crime` has a 7% chance to give you 50,000+ money but you can also lose up to 2% of your balance. " +
                "If you're feeling lucky, you can also gamble by saying `.bet <amount>/a`. " +
                "You have 50% to earn double your bet and 50% to lose it. " +
                "To see how much money you have, say `.me` or `.stats`."
        },
        {
            name: "**Population**",
            value: "Your population works once every 12 hours, giving you between 8 and 15 money per citizen and consuming ~2 food per person in the process. " +
                "You get population by buying upgrades. " +
                "Additionally they reproduce naturally by up to 5% each day."
        },
        {
            name: "**Upgrades**",
            value: "When you earn enough money, you can go to a store and finally start getting population. " +
                "You can see the list of all population upgrades by saying `.store p` and buy something by saying `.buy <name>`.\n" +
                "Since v1.2 there are also personal farms, which produce food only for you, but alliance farms are still stronger (and cheaper)."
        },
        {
            name: "**Alliances**",
            value: "Alliances give you food, but also tax a percentage of your income (0-90%, set by the owner)." +
                "To join one, say `.joinalliance <name>` (you'll need an invite if you want to join a private alliance). " +
                "When you're in an alliance, use `.send <mention>` to send money to a fellow member or `.deposit <amount>` if you want to serve the Soviet Union and help your alliance get some upgrades. " +
                "There's also an option to create your own alliance for 250k using `.createalliance <name>`. " +
                "You can learn how to manage it by saying `.help a`."
        },
        {
            name: "**Battles**",
            value: "The old battle system has been removed and replaced by wars, use `.warguide` to learn how they work. " +
                "(By now wars are the only actions where the new oil and steel resources are used, you can find mroe about those in the mine section when running `.help general`)"
        },
        {
            name: "**Plagues**",
            value: "Once a day up to 1% of all player's Utopias are struck by a plague, these can kill up to 40% of their population. " +
                "This seems a bit high but the factor can be lowered with buying hospitals in the population store."
        }
    ],
    timestamp: new Date(),
    footer: {
        text: properties.footer.text + "  •   Written by Astilimos#6295",
        icon_url: properties.footer.icon_url
    }
};

export const marketHelp = {
    title: "Market help",
    description: "Here you will find anything related to markets and the new economy system introduced in v2.1.\n" +
        "All offers are available to every other player.\n" +
        "Note: There is a fee of 2% on all market offers.",
    fields: [
        {
            name: "`.market [search query]`",
            value: "Show the market offers. If no search criteria are given, everything is given out." +
                "There are three search criteria: minimum amount, currency and page. The syntax for a query is `criteria:value`.\n" +
                "For example `.market currency:food min:10000 page:3 order:price:asc` would give page 3 of the all food offers over 10,000, sorted by price in ascending order. " +
                "All words can be changed to their starting letter for shorter writing (`currency:food` => `c:f`). Sorting follows the syntax `order:<price | offer>:<asc | desc>`."
        },
        {
            name: "`.make-offer <amount> <currency> <price amount> <price currency>`",
            value: "This command allows you to place an offer to the market.\n" +
                "For example: `.make-offer 1000 food 200 money` means, that you offer 1000 food for 200 money."
        },
        {
            name: "`.offer <id>`",
            value: "View detailed information about a specific offer",
        },
        {
            name: "`.my-offers [page]`",
            value: "Shows all your offers. If you have more than 10 offers, you can view your additional offers using the page argument."
        },
        {
            name: "`.cancel-offer <id>`",
            value: "Cancel the offer with the given ID. (You will still pay the fee)"
        },
        {
            name: "`.buy-offer <id>`",
            value: "Buy the offer with the given ID."
        },
        {
            name: "Taxes and the Utopian Super Bank",
            value: "v2.1 also introduced the Utopian Super Bank (USB) in order to control the economy a bit better.\n" +
                "The USB gives out the money for betting for example: if the USB is empty, there will no more money available for betting." +
                "Another new feature are taxes: Once a week every player will be taxed based on their weekly income (you can check your income and tax classes classes with `.taxes`), this money will be given to the USB." +
                "Basically every time you spend money on buying upgrades, betting, mine digging etc. will be given to the USB.\n" +
                "You can check the USB balance with `.usb`.\n"
        }
    ],
    timestamp: new Date(),
    color: parseInt(properties.embedColor),
    footer: properties.footer
};

export const contractHelp = {
    title: "Contract help",
    description: "This help menu is to help you with all your contract needs.\n" +
        "Contracts can be made between to player to ensure a regular exchange of resources.",
    fields: [
        {
            name: "`.propose <user> <amount> <currency> <price> <price-currency> <time in days>`",
            value: "This allows you to propose a contract to another user. " +
                "All contracts are limited to a maximum of 14 days." +
                "However, the other user has to accept the contract.\n" +
                "For example: `.propose @Zero 100 steel 100 oil 14`." +
                "This would mean that Zero pays the proposer 100 steel in exchange for 100 oil every day for the next two weeks."
        },
        {
            name: "`.viewcontract <contract id>`",
            value: "This command allows you to see a specific contact\n" +
                "For example: `.viewcontract 10`"
        },
        {
            name: "`.accept <contractID> <yes | no>`",
            value: "This command allows you to accept any contract if you put in the argument yes. \n" +
                "Otherwise, put in the argument of no if you don't want to accept it.\n" +
                "For example: `.accept 10 yes`",
        },
    ],
    timestamp: new Date(),
    color: parseInt(properties.embedColor),
    footer: properties.footer
};

export const clsHelp = {
    color: parseInt(properties.embedColor),
    footer: properties.footer,
    timestamp: new Date(),
    title: "Clientstate help",
    description: "Here you find everything related to the client-state system introduced in v2.2.\n" +
        "Client states are another source of passive income: Each state can have upgrades which boosts their productivity. Each state has its own loyalty factor: " +
        "Loyalitly affects their productivity (above 50% gives a bonus, below 50% a malus. On 0% they can declare independence.). They will receive resources once a day.\n" +
        "Client-states also have an own population which they need to feed, it will also grow passively, so investing in their farms is useful.",
    fields: [
        {
            name: "`.create-cls <name>`.",
            value: "Create a new client-state with the given name. Each client-state boosts the amount of food one gets from his alliance.\n" +
                "By now the names can only be one word long."
        },
        {
            name: "`.delete-cls <name>`",
            value: "Delete the client-state with the given name."
        },
        {
            name: "`.clientstates`",
            value: "View a comprehensive list of all your client-states."
        },
        {
            name: "`.clientstate <name>`",
            value: "View a detailed overview over a specific client-state."
        },
        {
            name: "`.send-to-cls <name> <amount> <resource>`.",
            value: "Send your client-states resource so you can invest in them, this will boost their loyalty."
        },
        {
            name: "`.withdraw <name> <amount> <resource>`",
            value: "Take resources from a client-state, this will lower their productivity."
        },
        {
            name: "`.setfocus <name> <resource>`",
            value: "Sets a specific production focus: They will receive a boost of 200% in the specific sector but will produce 50% of everything else." +
                "Use `.setfocus <name> none` to remove the focus of a client-state."
        },
        {
            name: "`.rename-cls <old name> <new name>`",
            value: "Renames one of your client states."
        },
        {
            name: "`.buy-cls <name> <mine | rig | farm>`",
            value: "Buy an upgrade for your client-state, for more see the client-state shop."
        }
    ]
};