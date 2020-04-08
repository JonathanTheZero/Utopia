import { user, testUser } from "./interfaces";
import * as mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;
const url: string = "mongodb://localhost:27017/mydb";

export async function addUsers(newUsers: user[]): Promise<void> {
    if(!newUsers || newUsers.length === 0) return;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.db("mydb").collection("users").insertMany(newUsers, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
        });
    });
}

export async function test(n: testUser): Promise<void>{
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.db("mydb").collection("users").insertOne(n, function (err, res) {
            if (err) throw err;
            console.log(`Created account for ${n.tag}`);
            db.close();
        });
    });
}

export function start(): void {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.db("mydb").createCollection("users", (err, res) => {
            if (err) throw err;
            console.log("Collection created!");
            db.close();
        });
    });
}