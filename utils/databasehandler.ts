import { user, alliance, updateUserQuery, updateAllianceQuery } from "./interfaces";
import * as mongodb from "mongodb";

const url: string = "mongodb://localhost:27017/mydb";
const client = new mongodb.MongoClient(url);
const dbName = "mydb";

export async function addUsers(newUsers: user[]): Promise<void> {
    if (!newUsers || newUsers.length === 0) return;
    let result = await client.db(dbName).collection("users").insertMany(newUsers);
    if (result) console.log("Successfully added");
}

export async function getUser(_id: string): Promise<user> {
    let result = await client.db(dbName).collection("users").findOne({ _id });
    return result;
}

export async function getAlliance(name: string): Promise<alliance | null> {
    return await client.db(dbName).collection("alliances").findOne({ name });
}

export async function updateValueForUser(_id: string, mode: updateUserQuery, newValue: any, updateMode: "$inc" | "$set" = "$set") {
    let newQuery = {};
    if (mode === "money")
        newQuery = { [updateMode]: { money: <number>newValue } };
    else if (mode === "allianceRank")
        newQuery = { [updateMode]: { allianceRank: <string>newValue } };
    else if (mode === "alliance")
        newQuery = { [updateMode]: { alliance: <string>newValue } };
    else if (mode === "food")
        newQuery = { [updateMode]: { "resources.food": <number>newValue } };
    else if (mode === "autoping")
        newQuery = { [updateMode]: { autoping: <boolean>newValue } };
    else if (mode === "loan")
        newQuery = { [updateMode]: { loan: <number>newValue } };

    client.db(dbName).collection("users").updateOne({ _id }, newQuery, err => {
        if (err) throw err;
    });
}

export async function updateValueForAlliance(name: string, mode: updateAllianceQuery, newValue: any, updateMode: "$inc" | "$set" = "$set") {
    let newQuery = {};
    if (mode === "money")
        newQuery = { [updateMode]: { money: <number>newValue } };

    client.db(dbName).collection("alliances").updateOne({ name }, newQuery, err => {
        if (err) throw err;
    });
}

export async function addUpgrade(_id: string, upgrade: string, type: "population" | "misc"): Promise<void> {
    let userUpgrades: user["upgrades"] = (await getUser(_id)).upgrades;
    userUpgrades[type].push(upgrade);
    client.db(dbName).collection("users").updateOne({ _id }, { $set: { upgrades: userUpgrades } });
}

export async function addPF(_id: string, upgrade: "nf" | "sf" | "sef" | "if"): Promise<void> {
    let pfs: user["upgrades"]["pf"] = (await getUser(_id)).upgrades.pf;
    pfs[upgrade] += 1;
    client.db(dbName).collection("users").updateOne({ _id }, { $set: { upgrades: pfs } });
}

export async function addAlliance(alliance: alliance): Promise<void> {
    if (!alliance) return;
    let result = await client.db(dbName).collection("alliances").insertOne(alliance);
    if (result) console.log(`Successfully added ${alliance.name}`);
}

export async function addAllianceUpgrade(name: string, upgrade: "af" | "pf" | "mf"): Promise<void> {
    let upgrades: alliance["upgrades"] = (await getAlliance(name) as alliance)?.upgrades;
    upgrades[upgrade] += 1;
    client.db(dbName).collection("alliances").updateOne({ name }, { $set: { upgrades } });
}

export async function getAllUsers(): Promise<user[]> {
    return await client.db(dbName).collection("users").find({}).toArray();
}

export async function getAllAlliances(): Promise<alliance[]> {
    return await client.db(dbName).collection("alliances").find({}).toArray();
}

export function connectToDB(): void {
    client.connect(err => {
        if (err) throw err;
        console.log("Successfully connected");
    });
}