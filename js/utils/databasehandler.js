"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = __importStar(require("mongodb"));
const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/mydb";
async function addUsers(newUsers) {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        db.db("mydb").collection("users").insertMany(newUsers, function (err, res) {
            if (err)
                throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
        });
    });
}
exports.addUsers = addUsers;
async function test(n) {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        db.db("mydb").collection("users").insertOne(n, function (err, res) {
            if (err)
                throw err;
            console.log(`Created account for ${n.tag}`);
            db.close();
        });
    });
}
exports.test = test;
function start() {
    MongoClient.connect(url, (err, db) => {
        if (err)
            throw err;
        db.db("mydb").createCollection("users", (err, res) => {
            if (err)
                throw err;
            console.log("Collection created!");
            db.close();
        });
    });
}
exports.start = start;
