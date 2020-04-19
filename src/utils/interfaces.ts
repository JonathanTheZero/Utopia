import { User } from "discord.js";

export interface user {
    tag: string;
    _id: string;
    money: number;
    lastWorked: number;
    minereset: number;
    lastCrime: number;
    lastdig: number;
    lastmine: number;
    autoping: boolean;
    payoutDMs: boolean;
    alliance: string | null;
    allianceRank: "M" | "L" | "C" | null
    resources: {
        food: number;
        population: number;
        steel: number;
        oil: number;
        totaldigs: number;
        lastdig: number;
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
    };
    loan: number;
    inventory: Array<string>;
    votingStreak: number;
    lastVoted: number;
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
}

export interface configDB {
    _id: 1;
    lastPayout: number;
    lastPopulationWorkPayout: number;
    commandsRun: number;
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
    | "oil";

export type updateAllianceQuery = "name"
    | "level"
    | "public"
    | "leader"
    | "money"
    | "tax";

export interface war {
    _id: string;
    p1: battlePlayer;
    p2: battlePlayer;
    field: Array<Array<0 | string>>
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