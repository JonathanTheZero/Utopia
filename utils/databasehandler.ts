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
    let newValues = {};
    if (mode === "money") {
        newValues = {
            $set: { money: (await getUser(_id)).money + <number>newValue }
        };
    }
    else if (mode === "allianceRank") {
        newValues = {
            $set: { allianceRank: <string>newValue }
        };
    }
    client.db(dbName).collection("users").updateOne({ _id }, newValues, err => {
        if (err) throw err;
    });
}

export async function addAlliance(alliance: alliance): Promise<void> {
    if (!alliance) return;
    let result = await client.db(dbName).collection("alliances").insertOne(alliance);
    if (result) console.log(`Successfully added ${alliance.name}`);
}

export function start(): void {
    client.connect(err => {
        if (err) throw err;
        console.log("Successfully connected");
    });
}