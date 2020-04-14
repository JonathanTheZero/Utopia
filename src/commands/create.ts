import { user, alliance } from "../utils/interfaces";
import { Message } from "discord.js";

export function createUser(message: Message): user {
    return {
        tag: message.author.tag,
        _id: message.author.id,
        money: 1000,
        lastWorked: 0,
        lastCrime: 0,
        autoping: true,
        payoutDMs: false,
        alliance: null,
        allianceRank: null,
        resources: {
            food: 10000,
            population: 1000,
            steel: 1000
        },
        upgrades: {
            population: [],
            misc: [],
            pf: {
                nf: 0,
                sf: 0,
                sef: 0,
                if: 0
            }
        },
        loan: 0,
        inventory: [],
        votingStreak: 1,
        lastVoted: 0
    }
}

export function createAlliance(name: string, message: Message): alliance {
    return {
        name: name,
        level: 1,
        public: true,
        leader: {
            tag: message.author.tag,
            _id: message.author.id,
        },
        money: 0,
        tax: 5,
        coLeaders: [],
        members: [],
        upgrades: {
            af: 0,
            pf: 0,
            mf: 0
        },
        invitedUsers: []
    }
}