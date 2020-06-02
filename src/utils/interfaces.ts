import { User } from "discord.js";

export interface user {
    tag: string;
    _id: string;
    money: number;
    lastWorked: number;
    minereset: number;
    lastCrime: number;
    lastDig: number;
    lastMine: number;
    autoping: boolean;
    payoutDMs: boolean;
    taxDMs: boolean;
    alliance: string | null;
    allianceRank: "M" | "L" | "C" | null
    resources: {
        food: number;
        population: number;
        steel: number;
        oil: number;
        totaldigs: number;
        steelmine: number;
        oilrig: number;
        minereturn: number;
    },
    upgrades: {
        population: string[];
        misc: string[];
        pf: {
            nf: number;
            sf: number;
            sef: number;
            if: number;
        };
        hospitals: number;
    };
    loan: number;
    inventory: Array<string>;
    votingStreak: number;
    lastVoted: number;
    income: number;
    clientStates: Array<clientState>;
    lastMessage: {
        channelID: string;
        messageID: string;
        alreadyPinged: boolean;
    };
}

export interface alliance {
    name: string;
    level: number;
    public: boolean;
    leader: {
        tag: string;
        _id: string;
    };
    money: number;
    tax: number;
    coLeaders: string[];
    members: string[],
    upgrades: {
        af: number;
        pf: number;
        mf: number;
    };
    invitedUsers: string[];
    clientStates: number;
}

export interface configDB {
    _id: 1;
    lastPayout: number;
    lastPopulationWorkPayout: number;
    commandsRun: number;
    lastMineReset: number;
    lastDailyReset: number;
    totalOffers: number;
    totalContracts: number;
    centralBalance: number;
    upmsg: string;
}

export interface giveaway {
    channelid: string,
    _id: string,
    winners: number,
    startedAt: number,
    endingISO: Date,
    priceAm: string | number,
    priceCur: string,
    endingAt: number,
    embedId: string,
    users: User[];
}

export interface server {
    _id: string;
    name: string;
    prefix: string;
}

export type updateUserQuery = "tag"
    | "money"
    | "autoping"
    | "payoutDMs"
    | "alliance"
    | "allianceRank"
    | "food"
    | "population"
    | "loan"
    | "lastWorked"
    | "lastCrime"
    | "lastVoted"
    | "votingStreak"
    | "steel"
    | "oil"
    | "lastDig"
    | "lastMine"
    | "totaldigs"
    | "steelmine"
    | "oilrig"
    | "minereturn"
    | "minereset"
    | "income"
    | "taxDMs"
    | "hospitals"
    | "lastMessage";

export type updateAllianceQuery = "name"
    | "level"
    | "public"
    | "leader"
    | "money"
    | "tax"
    | "clientStates";

export interface war {
    _id: string;
    p1: battlePlayer;
    p2: battlePlayer;
    field: Array<Array<0 | string>>;
    started: boolean;
}

interface battlePlayer {
    _id: string;
    tag: string;
    ready: boolean;
    resources: {
        food: battleResource;
        money: battleResource;
        population: battleResource;
        steel: battleResource;
        oil: battleResource;
    };
    armies: army[];
}

interface battleResource {
    begin: number;
    consumed: number;
};

export interface army {
    if: number;
    art: number;
    tnk: number;
    jet: number;
    field: [number, number] | null;
    moved: boolean;
}

export interface marketOffer {
    _id: string;
    seller: {
        _id: string;
        tag: string;
    };
    offer: {
        amount: number;
        currency: resources;
    };
    price: {
        amount: number;
        currency: resources;
    };
}

export type resources = "money" | "food" | "oil" | "steel" | "population";

export interface clientState {
    name: string;
    resources: {
        food: number;
        oil: number;
        steel: number;
        population: number;
        money: number;
    };
    loyalty: number;
    upgrades: {
        mines: number;
        rigs: number;
        farms: number;
    };
    focus: resources | null;
}

export type clsEdits = "loyalty" | "focus" | clsUpgrades;
export type clsUpgrades = "mines" | "rigs" | "farms";

export interface contract {
    _id: string;
    proposal: boolean;
    users: [string, string];
    info: { 
        totaltime: number;
        selling: resources;
        sellingprice: number;
        priceresource: resources;
        price: number;
    }
}