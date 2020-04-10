import { user, alliance } from "./interfaces";
export declare function addUsers(newUsers: user[]): Promise<void>;
export declare function getUser(_id: string): Promise<user>;
export declare function getAlliance(name: string): Promise<alliance | null>;
export declare function updateValueForUser(_id: string, mode: "money" | "food" | "population" | "votingStreak" | "loan", newValue: number, updateMode?: "$inc" | "$set"): Promise<void>;
export declare function updateValueForUser(_id: string, mode: "lastCrime" | "lastWorked" | "lastVoted", newValue: number): Promise<void>;
export declare function updateValueForUser(_id: string, mode: "alliance", newValue: string | null): Promise<void>;
export declare function updateValueForUser(_id: string, mode: "tag", newValue: string): Promise<void>;
export declare function updateValueForUser(_id: string, mode: "allianceRank", newValue: "M" | "C" | "L" | null): Promise<void>;
export declare function updateValueForUser(_id: string, mode: "autoping" | "payoutDMs", newValue: boolean): Promise<void>;
export declare function updateValueForAlliance(name: string, mode: "money" | "level", newValue: number, updateMode: "$inc" | "$set"): Promise<void>;
export declare function updateValueForAlliance(name: string, mode: "leader", newValue: {
    _id: string;
    tag: string;
}): Promise<void>;
export declare function updateValueForAlliance(name: string, mode: "public", newValue: boolean): Promise<void>;
export declare function updateValueForAlliance(name: string, mode: "name", newValue: string): Promise<void>;
export declare function addUpgrade(_id: string, upgrade: string, type: "population" | "misc"): Promise<void>;
export declare function addPF(_id: string, upgrade: "nf" | "sf" | "sef" | "if"): Promise<void>;
export declare function addAlliance(alliance: alliance): Promise<void>;
export declare function addAllianceUpgrade(name: string, upgrade: "af" | "pf" | "mf"): Promise<void>;
export declare function editAllianceArray(name: string, array: "members" | "coLeaders" | "invitedUsers", operation: "$push" | "$pull" | undefined, value: string): Promise<void>;
export declare function getAllUsers(): Promise<user[]>;
export declare function getAllAlliances(): Promise<alliance[]>;
export declare function deleteUser(_id: string): Promise<void>;
export declare function deleteAlliance(name: string): Promise<void>;
export declare function customUpdateQuery(collection: string, filter: {
    [key: string]: any;
}, update: {
    [key: string]: any;
}): Promise<void>;
export declare function connectToDB(): void;
