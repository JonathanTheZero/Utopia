export interface user {
    tag: string,
    _id: string,
    money: number,
    lastWorked: number,
    lastCrime: number
    autoping: boolean,
    payoutDMs: boolean,
    alliance: string | null,
    allianceRank: string | null,
    resources: {
        food: number
        population: number
    },
    upgrades: {
        population: string[],
        misc: string[],
        battle: {
            iA: number
            iD: number
            cA: number
            cD: number
            aA: number
            aD: number
        },
        pf: {
            nf: number
            sf: number
            sef: number
            if: number
        }
    },
    loan: number
    inventory: Array<string>,
    duelsWon: number
    battleToken: number
    tokenUsed: boolean,
    votingStreak: number,
    lastVoted: number
}

export interface testUser {
    _id: string;
    tag: string;
}