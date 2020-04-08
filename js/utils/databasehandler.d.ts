import { user } from "./interfaces";
export declare function addUsers(newUsers: user[]): Promise<void>;
export declare function getUser(_id: string): Promise<user>;
export declare function addMoney(_id: string, money: number): Promise<void>;
export declare function start(): void;
