import { user, alliance, updateUserQuery, updateAllianceQuery, configDB, giveaway, server, war, army } from "./interfaces";
import * as mongodb from "mongodb";
import { db } from "../static/config.json";

const url: string = db.mongoQuery;
const client = new mongodb.MongoClient(url, { useNewUrlParser: true });
const dbName = db.name;

const config: configDB = {
    _id: 1,
    lastPayout: 0,
    lastPopulationWorkPayout: 0,
    commandsRun: 0
};

export let connected: boolean = false;

export async function addUsers(newUsers: user[]): Promise<void> {
    if (!newUsers || newUsers.length === 0) return;
    let result = await client.db(dbName).collection("users").insertMany(newUsers);
    if (result) console.log("Successfully added " + newUsers[0].tag);
}

export async function getUser(_id: string): Promise<user> {
    return client.db(dbName).collection("users").findOne({ _id })!;
}

export async function getAlliance(name: string): Promise<alliance | null> {
    return await client.db(dbName).collection("alliances").findOne({ name });
}

export async function updateValueForUser(_id: string, mode: "money" | "food" | "population" | "votingStreak" | "loan" | "steel" | "oil", newValue: number, updateMode?: "$inc" | "$set"): Promise<void>;
export async function updateValueForUser(_id: string, mode: "lastCrime" | "lastWorked" | "lastVoted", newValue: number): Promise<void>;
export async function updateValueForUser(_id: string, mode: "alliance", newValue: string | null): Promise<void>;
export async function updateValueForUser(_id: string, mode: "tag", newValue: string): Promise<void>;
export async function updateValueForUser(_id: string, mode: "allianceRank", newValue: "M" | "C" | "L" | null): Promise<void>;
export async function updateValueForUser(_id: string, mode: "autoping" | "payoutDMs", newValue: boolean): Promise<void>;
export async function updateValueForUser(_id: string, mode: updateUserQuery, newValue: any, updateMode: "$inc" | "$set" = "$set") {
    let newQuery = {};
    if (["money", "allianceRank", "alliance", "autoping", "loan", "tag", "payoutDMs", "lastCrime", "lastVoted", "lastWorked", "votingStreak"].includes(mode))
        newQuery = { [updateMode]: { [mode]: newValue } };
    else if (["food", "population", "steel", "oil"].includes(mode)) {
        const str = "resources." + mode;
        newQuery = { [updateMode]: { [str]: <number>newValue } };
    }
    else
        throw new Error("Invalid parameter passed");

    client.db(dbName).collection("users").updateOne({ _id }, newQuery, err => {
        if (err) throw err;
    });
}

export async function updateValueForAlliance(name: string, mode: "money" | "level" | "tax", newValue: number, updateMode?: "$inc" | "$set"): Promise<void>;
export async function updateValueForAlliance(name: string, mode: "leader", newValue: { _id: string, tag: string }): Promise<void>;
export async function updateValueForAlliance(name: string, mode: "public", newValue: boolean): Promise<void>;
export async function updateValueForAlliance(name: string, mode: "name", newValue: string): Promise<void>;
export async function updateValueForAlliance(name: string, mode: updateAllianceQuery, newValue: any, updateMode: "$inc" | "$set" = "$set") {
    let newQuery = {};
    if (["money", "level", "public", "name", "tax"].includes(mode))
        newQuery = { [updateMode]: { [mode]: newValue } };
    else if (mode === "leader")
        newQuery = { $set: { leader: { _id: newValue._id, tag: newValue.tag } } };

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
    client.db(dbName).collection("users").updateOne({ _id }, { $set: { "upgrades.pf": pfs } });
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

export async function editAllianceArray(name: string, array: "members" | "coLeaders" | "invitedUsers", operation: "$push" | "$pull" = "$push", value: string) {
    client.db(dbName).collection("alliances").updateOne({ name }, { [operation]: { [array]: value } });
}

export async function getAllUsers(): Promise<user[]> {
    return client.db(dbName).collection("users").find({}).toArray();
}

export async function getAllAlliances(): Promise<alliance[]> {
    return client.db(dbName).collection("alliances").find({}).toArray();
}

export async function deleteUser(_id: string) {
    client.db(dbName).collection("users").deleteOne({ _id });
}

export async function deleteAlliance(name: string) {
    client.db(dbName).collection("alliances").deleteOne({ name });
}

export async function customUpdateQuery(collection: string, filter: { [key: string]: any }, update: { [key: string]: any }) {
    client.db(dbName).collection(collection).updateMany(filter, update, err => {
        if (err) throw err;
    });
}

export async function getConfig(): Promise<configDB> {
    return client.db(dbName)?.collection("config")?.findOne({ _id: 1 })!;
}

export async function editConfig(field: "lastPayout" | "lastPopulationWorkPayout", val: number) {
    client.db(dbName).collection("config").updateOne({ _id: 1 }, { $set: { [field]: val } }, err => {
        if (err) throw err;
    });
}

export async function getGiveaways(): Promise<giveaway[]> {
    return client.db(dbName).collection("giveaways").find({}).toArray();
}

export async function addGiveaway(giveaway: giveaway) {
    return client.db(dbName).collection("giveaways").insertOne(giveaway);
}

export async function getGiveaway(_id: string): Promise<giveaway> {
    let result = await client.db(dbName).collection("giveaways").findOne({ _id });
    return result;
}

export async function deleteGiveaway(_id: string) {
    client.db(dbName).collection("giveaways").deleteOne({ _id });
}

export async function addCR(): Promise<void> {
    client.db(dbName).collection("config").updateOne({ _id: 1 }, { $inc: { commandsRun: 1 } }, err => {
        if (err) throw err;
    });
}

export async function getServers(): Promise<Array<server>> {
    return client.db(dbName).collection("servers").find({}).toArray();
}

export async function getServer(_id: string): Promise<server> {
    return client.db(dbName).collection("servers").findOne({ _id })!;
}

export async function addServer(server: server) {
    client.db(dbName).collection("servers").insertOne(server);
}

export async function updateServer(server: server, upsert: boolean) {
    client.db(dbName).collection("servers").updateOne({ _id: server._id }, { $set: server }, { upsert });
}

export async function deleteServer(_id: string) {
    client.db(dbName).collection("servers").deleteOne({ _id });
}

export async function updatePrefix(_id: string, prefix: string) {
    client.db(dbName).collection("servers").updateOne({ _id }, { $set: { prefix } });
}

export async function addWar(w: war) {
    client.db(dbName).collection("wars").insertOne(w, err => {
        if (err) throw err;
    });
}

export async function setWarStarted(_id: string) {
    client.db(dbName).collection("wars").updateOne({ _id }, { $set: { started: true } });
}

export async function getWar(_id: string): Promise<war> {
    return client.db(dbName).collection("wars").findOne({ _id })!;
}

export async function deleteWar(_id: string) {
    client.db(dbName).collection("wars").deleteOne({ _id });
}

export async function findWarByUser(_id: string): Promise<war | null> {
    return client.db(dbName).collection("wars").findOne({
        $or: [
            { "p1._id": _id },
            { "p2._id": _id }
        ]
    });
}

export async function updateReady(_id: string, p1: boolean, newReady = true): Promise<void> {
    client.db(dbName).collection("wars").updateOne({ _id }, {
        $set: { [(p1 ? "p1.ready" : "p2.ready")]: newReady }
    }, err => { if (err) throw err });
}

export async function addArmy(_id: string, army: army, p1: boolean) {
    const str = p1 ? "p1.armies" : "p2.armies";
    client.db(dbName).collection("wars").updateOne({ _id }, {
        $push: { [str]: army }
    });
}

export async function moveArmy(_id: string, p1: boolean, army: number, newField: [number, number]) {
    const str = p1 ? `p1.armies.${army}` : `p2.armies.${army}`;
    client.db(dbName).collection("wars").updateOne({ _id }, {
        $set: {
            [str + ".field"]: newField,
            [str + ".moved"]: true
        }
    });
    await updateField(_id);
}

export async function updateField(_id: string): Promise<Array<Array<number | string>>> {
    let war: war = await client.db(dbName).collection("wars").findOne({ _id })!;
    let arr: (number | string)[][] = JSON.parse(JSON.stringify((Array(15).fill(new Array(15).fill(0)))));
    for (let i = 0; i < war.p1.armies.length; ++i) {
        if (war.p1.armies[i].field)
            arr[war.p1.armies[i].field![0]][war.p1.armies[i].field![1]] = "1#" + i;
    }
    for (let i = 0; i < war.p2.armies.length; ++i) {
        if (war.p2.armies[i].field)
            arr[war.p2.armies[i].field![0]][war.p2.armies[i].field![1]] = "2#" + i;
    }
    await client.db(dbName).collection("wars").updateOne({ _id }, { $set: { field: arr } });
    return arr;
}

export async function updateCosts(_id: string, mode: "money" | "food" | "population" | "oil" | "steel", p1: boolean, amount: number) {
    const str = p1 ? "p1.resources." + mode + ".consumed" : "p2.resources." + mode + ".consumed";
    client.db(dbName).collection("wars").updateOne({ _id }, {
        $inc: { [str]: amount }
    }, err => { if (err) throw err });
}

export async function markAllArmies(_id: string, newVal: boolean) {
    client.db(dbName).collection("wars").updateOne({ _id }, {
        $set: {
            "p1.armies.$[].moved": newVal,
            "p2.armies.$[].moved": newVal
        }
    }, err => { if (err) throw err });
}

export async function replaceArmy(_id: string, p1: boolean, index: number, army: army) {
    client.db(dbName).collection("wars").updateOne({ _id }, {
        $set: {
            [(p1 ? "p1" : "p2") + `.armies.${index}`]: army
        }
    }, err => { if (err) throw err });
}

export async function connectToDB(): Promise<void> {
    return new Promise(resolve => {
        client.connect(async err => {
            if (err) throw err;
            console.log("Successfully connected");

            client.db(dbName).createCollection("users");
            client.db(dbName).createCollection("alliances");
            client.db(dbName).createCollection("giveaways");
            client.db(dbName).createCollection("servers");
            client.db(dbName).createCollection("wars");
            if (!(await client.db(dbName).collection("config").findOne({ _id: 1 }))) {
                client.db(dbName).collection("config").insertOne(config);
            }
            connected = true;
            resolve();
        });
    });
}