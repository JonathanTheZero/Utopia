import { user, alliance, updateUserQuery } from "./interfaces";
export declare function addUsers(newUsers: user[]): Promise<void>;
export declare function getUser(_id: string): Promise<user>;
export declare function updateValueForUser(_id: string, mode: updateUserQuery, newValue: any): Promise<void>;
export declare function addUpgrade(_id: string, upgrade: string, type: "population" | "misc"): Promise<void>;
export declare function addAlliance(alliance: alliance): Promise<void>;
export declare function connectToDB(): void;
