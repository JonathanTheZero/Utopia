import { user } from "./interfaces";
import * as mongodb from "mongodb";

const url: string = "mongodb://localhost:27017/mydb";
const client = new mongodb.MongoClient(url);

export async function addUsers(newUsers: user[]): Promise<void> {
    if (!newUsers || newUsers.length === 0) return;
    let result = await client.db("mydb").collection("users").insertMany(newUsers);
    if (result) console.log("Successfully added");
}

export async function getUser(_id: string): Promise<user> {
    let result = await client.db("mydb").collection("users").findOne({_id: _id});
    return result;
}

export function start(): void {
    client.connect(err => {
        if (err) throw err;
        console.log("Successfully connected");
    });
}