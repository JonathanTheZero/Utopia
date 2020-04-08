export interface user {
    tag: string;
    _id: string;
    money: number;
    lastWorked: number;
    lastCrime: number;
    autoping: boolean;
    payoutDMs: boolean;
    alliance: string | null;
    allianceRank: string | null;
    resources: {
        food: number;
        population: number;
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

export type updateUserQuery = "tag" | "money" | "autoping" | "payoutDMs" | "alliance" | "allianceRank" | "food" | "population";