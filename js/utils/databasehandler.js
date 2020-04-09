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
const url = "mongodb://localhost:27017/mydb";
const client = new mongodb.MongoClient(url);
const dbName = "mydb";
async function addUsers(newUsers) {
    if (!newUsers || newUsers.length === 0)
        return;
    let result = await client.db(dbName).collection("users").insertMany(newUsers);
    if (result)
        console.log("Successfully added");
}
exports.addUsers = addUsers;
async function getUser(_id) {
    let result = await client.db(dbName).collection("users").findOne({ _id: _id });
    return result;
}
exports.getUser = getUser;
async function updateValueForUser(_id, mode, newValue, updateMode = "$set") {
    let newQuery = {};
    if (mode === "money")
        newQuery = { [updateMode]: { money: newValue } };
    else if (mode === "allianceRank")
        newQuery = { [updateMode]: { allianceRank: newValue } };
    else if (mode === "alliance")
        newQuery = { [updateMode]: { alliance: newValue } };
    else if (mode === "food")
        newQuery = { [updateMode]: { "resources.food": newValue } };
    else if (mode === "autoping")
        newQuery = { [updateMode]: { autoping: newValue } };
    else if (mode === "loan")
        newQuery = { [updateMode]: { loan: newValue } };
    console.log(newQuery);
    client.db(dbName).collection("users").updateOne({ _id }, newQuery, err => {
        if (err)
            throw err;
    });
}
exports.updateValueForUser = updateValueForUser;
async function addUpgrade(_id, upgrade, type) {
    let userUpgrades = (await getUser(_id)).upgrades;
    userUpgrades[type].push(upgrade);
    client.db(dbName).collection("users").updateOne({ _id }, { $set: { upgrades: userUpgrades } });
}
exports.addUpgrade = addUpgrade;
async function addAlliance(alliance) {
    if (!alliance)
        return;
    let result = await client.db(dbName).collection("alliances").insertOne(alliance);
    if (result)
        console.log(`Successfully added ${alliance.name}`);
}
exports.addAlliance = addAlliance;
function getAllUsers() {
    return client.db(dbName).collection("users").find({}).toArray();
}
exports.getAllUsers = getAllUsers;
function getAllAlliances() {
    return client.db(dbName).collection("alliances").find({}).toArray();
}
exports.getAllAlliances = getAllAlliances;
function connectToDB() {
    client.connect(err => {
        if (err)
            throw err;
        console.log("Successfully connected");
    });
}
exports.connectToDB = connectToDB;
