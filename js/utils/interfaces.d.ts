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
    };
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
export interface testUser {
    _id: string;
    tag: string;
}
