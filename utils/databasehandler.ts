import { user, alliance, updateUserQuery } from "./interfaces";
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
    let result = await client.db(dbName).collection("users").findOne({ _id: _id });
    return result;
}

export async function updateValueForUser(_id: string, mode: updateUserQuery, newValue: any) {
    let newQuery = {};
    if (mode === "money")
        newQuery = { $set: { money: (await getUser(_id)).money + <number>newValue } };
    else if (mode === "allianceRank")
        newQuery = { $set: { allianceRank: <string>newValue } };
    else if (mode === "alliance")
        newQuery = { $set: { alliance: <string>newValue } };
    else if (mode === "food")
        newQuery = { $set: { food: (await getUser(_id)).resources.food + <number>newValue } };
    else if (mode === "autoping")
        newQuery = { $set: { autoping: <boolean>newValue } };
    else if (mode === "loan")
        newQuery = { $set: { loan: <number>newValue } };

    client.db(dbName).collection("users").updateOne({ _id }, newQuery, err => {
        if (err) throw err;
    });
}

export async function addUpgrade(_id: string, upgrade: string, type: "population" | "misc"): Promise<void> {
    let userUpgrades: user["upgrades"] = (await getUser(_id)).upgrades;
    userUpgrades[type].push(upgrade);
    client.db(dbName).collection("users").updateOne({ _id }, { $set: { upgrades: userUpgrades } });
}

export async function addAlliance(alliance: alliance): Promise<void> {
    if (!alliance) return;
    let result = await client.db(dbName).collection("alliances").insertOne(alliance);
    if (result) console.log(`Successfully added ${alliance.name}`);
}

export function connectToDB(): void {
    client.connect(err => {
        if (err) throw err;
        console.log("Successfully connected");
    });
}