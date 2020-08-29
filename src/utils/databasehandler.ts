import { user, alliance, updateUserQuery, configDB, giveaway, server, war, army, marketOffer, clientState, clsEdits, contract, clsGovernment, clsResources, unoGame } from "./interfaces";
import * as mongodb from "mongodb";
import { db } from "../static/config.json";

const url: string = db.mongoQuery;
const client = new mongodb.MongoClient(url, { useNewUrlParser: true, connectWithNoPrimary: false, useUnifiedTopology: true });
const dbn = db.name;

const config: configDB = {
    _id: 1,
    lastPayout: 0,
    lastPopulationWorkPayout: 0,
    commandsRun: 0,
    lastMineReset: 0,
    lastDailyReset: 0,
    totalOffers: 0,
    totalContracts: 0,
    totalGames: 0,
    centralBalance: 1000000000,
    upmsg: ""
};

export let connected: boolean = false;

export async function addUsers(newUsers: user[]): Promise<void> {
    if (!newUsers || newUsers.length === 0) return;
    let result = await client.db(dbn).collection("users").insertMany(newUsers);
    if (result) console.log("Successfully added " + newUsers[0].tag);
}

export async function getUser(_id: string): Promise<user> {
    return client.db(dbn).collection("users").findOne({ _id })!;
}

export async function getAlliance(name: string): Promise<alliance | null> {
    return await client.db(dbn).collection("alliances").findOne({ name });
}

export async function updateValueForUser(
    _id: string,
    mode:
        | "money"
        | "food"
        | "population"
        | "votingStreak"
        | "loan"
        | "steel"
        | "oil"
        | "lastDig"
        | "lastMine"
        | "totaldigs"
        | "steelmine"
        | "minereset"
        | "minereturn"
        | "oilrig"
        | "income"
        | "hospitals"
        | "highestVotingStreak",
    newValue: number,
    updateMode?: "$inc" | "$set"
): Promise<void>;
export async function updateValueForUser(_id: string, mode: "lastCrime" | "lastWorked" | "lastVoted", newValue: number): Promise<void>;
export async function updateValueForUser(_id: string, mode: "alliance", newValue: string | null): Promise<void>;
export async function updateValueForUser(_id: string, mode: "tag", newValue: string): Promise<void>;
export async function updateValueForUser(_id: string, mode: "allianceRank", newValue: "M" | "C" | "L" | null): Promise<void>;
export async function updateValueForUser(_id: string, mode: "autoping" | "payoutDMs" | "taxDMs", newValue: boolean): Promise<void>;
export async function updateValueForUser(_id: string, mode: "lastMessage", newValue: { channelID: string; messageID: string; alreadyPinged: boolean }): Promise<void>
export async function updateValueForUser(_id: string, mode: updateUserQuery, newValue: any, updateMode: "$inc" | "$set" = "$set") {
    let newQuery = {};
    if (["money", "allianceRank", "alliance", "autoping", "loan", "tag", "payoutDMs", "lastCrime", "lastVoted",
        "lastWorked", "votingStreak", "lastDig", "lastMine", "minereset", "income", "taxDMs", "lastMessage", "highestVotingStreak"].includes(mode))
        newQuery = { [updateMode]: { [mode]: newValue } };
    else if (["food", "population", "steel", "oil", "totaldigs", "steelmine", "minereturn", "oilrig"].includes(mode))
        newQuery = { [updateMode]: { [("resources." + mode)]: <number>newValue } };
    else if (mode === "hospitals")
        newQuery = { [updateMode]: { ["upgrades.hospitals"]: <number>newValue } };
    else throw new Error("Invalid parameter passed");

    client.db(dbn).collection("users").updateOne({ _id }, newQuery, err => {
        if (err) throw err;
    });
}

export async function addClientState(_id: string, cls: clientState): Promise<void> {
    client.db(dbn).collection("users").updateOne({ _id }, { $push: { clientStates: cls } }, err => { if (err) throw err });
}

export async function deleteClientState(_id: string, name: string): Promise<void> {
    client.db(dbn).collection("users").updateOne({ _id }, { $pull: { clientStates: { name } } }, err => { if (err) throw err });
}

export async function editCLSVal(_id: string, index: number, type: "loyalty" | "mines" | "rigs" | "farms" | clsResources, val: number, mode: "$inc" | "$set"): Promise<void>;
export async function editCLSVal(_id: string, index: number, type: "focus", val: clsResources | null): Promise<void>;
export async function editCLSVal(_id: string, index: number, type: "name", val: string): Promise<void>;
export async function editCLSVal(_id: string, index: number, type: "government", val: clsGovernment): Promise<void>;
export async function editCLSVal(_id: string, index: number, type: clsEdits | clsResources, val: any, mode: "$inc" | "$set" = "$set"): Promise<void> {
    let query: { [x: string]: { [x: string]: any; } | { [x: string]: any; }; };
    if (["loyalty", "focus", "name", "government"].includes(type))
        query = { [mode]: { [`clientStates.${index}.${type}`]: val } };
    else if (["mines", "rigs", "farms"].includes(type))
        query = { [mode]: { [`clientStates.${index}.upgrades.${type}`]: val } };
    else if (["steel", "oil", "food", "population", "money"].includes(type))
        query = { [mode]: { ["clientStates." + index + ".resources." + type]: val } };

    client.db(dbn).collection("users").updateOne({ _id }, query!, err => { if (err) throw err });
}

export async function updateValueForAlliance<K extends keyof alliance>(name: string, mode: K, newValue: alliance[K], updateMode: "$inc" | "$set" = "$set") {
    let newQuery = {};
    if (["money", "level", "public", "name", "tax", "clientStates"].includes(mode))
        newQuery = { [updateMode || "$set"]: { [mode]: newValue } };
    else if (mode === "leader")
        newQuery = { $set: { leader: newValue} };

    client.db(dbn).collection("alliances").updateOne({ name }, newQuery, err => { if (err) throw err });
}

export async function addUpgrade(_id: string, upgrade: string, type: "population" | "misc"): Promise<void> {
    let userUpgrades: user["upgrades"] = (await getUser(_id)).upgrades;
    userUpgrades[type].push(upgrade);
    client.db(dbn).collection("users").updateOne({ _id }, { $set: { upgrades: userUpgrades } });
}

export async function addPF(_id: string, upgrade: "nf" | "sf" | "sef" | "if"): Promise<void> {
    let pfs: user["upgrades"]["pf"] = (await getUser(_id)).upgrades.pf;
    pfs[upgrade] += 1;
    client.db(dbn).collection("users").updateOne({ _id }, { $set: { "upgrades.pf": pfs } });
}

export async function addAlliance(alliance: alliance): Promise<void> {
    if (!alliance) return;
    let result = await client.db(dbn).collection("alliances").insertOne(alliance);
    if (result) console.log(`Successfully added ${alliance.name}`);
}

export async function addAllianceUpgrade(name: string, upgrade: "af" | "pf" | "mf"): Promise<void> {
    let upgrades: alliance["upgrades"] = (await getAlliance(name) as alliance)?.upgrades;
    upgrades[upgrade] += 1;
    client.db(dbn).collection("alliances").updateOne({ name }, { $set: { upgrades } });
}

export async function editAllianceArray(name: string, array: "members" | "coLeaders" | "invitedUsers", operation: "$push" | "$pull" = "$push", value: string) {
    client.db(dbn).collection("alliances").updateOne({ name }, { [operation]: { [array]: value } });
}

export async function getAllUsers(): Promise<user[]> {
    return client.db(dbn).collection("users").find({}).toArray();
}

export async function getUsersWithQuery(query: mongodb.FilterQuery<any>): Promise<user[]> {
    return client.db(dbn).collection("users").find(query).toArray();
}

export async function getAllAlliances(): Promise<alliance[]> {
    return client.db(dbn).collection("alliances").find({}).toArray();
}

export async function deleteUser(_id: string) {
    client.db(dbn).collection("users").deleteOne({ _id });
}

export async function deleteAlliance(name: string) {
    client.db(dbn).collection("alliances").deleteOne({ name });
}

export async function customUpdateQuery(collection: "users" | "alliances" | "wars" | "servers", filter: { [key: string]: any }, update: { [key: string]: any }) {
    client.db(dbn).collection(collection).updateMany(filter, update, err => {
        if (err) throw err;
    });
}

export async function getConfig(): Promise<configDB> {
    return client.db(dbn).collection("config")?.findOne({ _id: 1 })!;
}

export async function addUpmsg(words: string[]) {
    client.db(dbn).collection("config").updateOne({ _id: 1 }, { $set: { upmsg: words } }, err => {
        if (err) throw err;
    });
}

export async function editConfig<K extends keyof configDB>(field: K, val: configDB[K]) {
    client.db(dbn).collection("config").updateOne({ _id: 1 }, { $set: { [field]: val } }, err => {
        if (err) throw err;
    });
}

export async function addToUSB(amount: number) {
    return client.db(dbn).collection("config").updateOne({ _id: 1 }, { $inc: { centralBalance: amount } });
}

export async function getGiveaways(): Promise<giveaway[]> {
    return client.db(dbn).collection("giveaways").find({}).toArray();
}

export async function addGiveaway(giveaway: giveaway) {
    return client.db(dbn).collection("giveaways").insertOne(giveaway);
}

export async function getGiveaway(_id: string): Promise<giveaway> {
    let result = await client.db(dbn).collection("giveaways").findOne({ _id });
    return result;
}

export async function deleteGiveaway(_id: string) {
    client.db(dbn).collection("giveaways").deleteOne({ _id });
}

export async function addCR(): Promise<void> {
    client.db(dbn).collection("config").updateOne({ _id: 1 }, { $inc: { commandsRun: 1 } }, err => {
        if (err) throw err;
    });
}

export async function getServers(): Promise<Array<server>> {
    return client.db(dbn).collection("servers").find({}).toArray();
}

export async function getServer(_id: string): Promise<server> {
    return client.db(dbn).collection("servers").findOne({ _id })!;
}

export async function addServer(server: server) {
    client.db(dbn).collection("servers").insertOne(server);
}

export async function updateServer(server: server, upsert: boolean) {
    client.db(dbn).collection("servers").updateOne({ _id: server._id }, { $set: server }, { upsert });
}

export async function deleteServer(_id: string) {
    client.db(dbn).collection("servers").deleteOne({ _id });
}

export async function updatePrefix(_id: string, prefix: string) {
    client.db(dbn).collection("servers").updateOne({ _id }, { $set: { prefix } });
}

export async function addContract(newContract: contract) {
    await client.db(dbn).collection("contracts").insertOne(newContract);
}

export async function getContract(_id: string): Promise<contract> {
    return client.db(dbn).collection("contracts").findOne({ _id })!;
}

export async function getAllContracts(): Promise<contract[]> {
    return client.db(dbn).collection("contracts").find({}).toArray();
}

export async function deleteContract(_id: string) {
    return client.db(dbn).collection("contracts").deleteOne({ _id });
}

export async function ContractAccepted(contractid: string) {
    await client.db(dbn).collection("contracts").updateOne({ _id: contractid }, { $set: { proposal: false } })!;
}

export async function ContractTime(contractid: string, value: number) {
    await client.db(dbn).collection("contracts").updateOne({ _id: contractid }, { $set: { ["info.totaltime"]: value } })!;
}

export async function addWar(w: war) {
    client.db(dbn).collection("wars").insertOne(w, err => { if (err) throw err });
}

export async function setWarStarted(_id: string) {
    client.db(dbn).collection("wars").updateOne({ _id }, { $set: { started: true } });
}

export async function getWar(_id: string): Promise<war> {
    return client.db(dbn).collection("wars").findOne({ _id })!;
}

export async function deleteWar(_id: string) {
    client.db(dbn).collection("wars").deleteOne({ _id });
}

export async function findWarByUser(_id: string): Promise<war | null> {
    return client.db(dbn).collection("wars").findOne({
        $or: [
            { "p1._id": _id },
            { "p2._id": _id }
        ]
    });
}

export async function updateReady(_id: string, p1: boolean, newReady = true): Promise<void> {
    client.db(dbn).collection("wars").updateOne({ _id }, {
        $set: { [(p1 ? "p1.ready" : "p2.ready")]: newReady }
    }, err => { if (err) throw err });
}

export async function addArmy(_id: string, army: army, p1: boolean) {
    const str = p1 ? "p1.armies" : "p2.armies";
    client.db(dbn).collection("wars").updateOne({ _id }, {
        $push: { [str]: army }
    });
}

export async function moveArmy(_id: string, p1: boolean, army: number, newField: [number, number]) {
    const str = p1 ? `p1.armies.${army}` : `p2.armies.${army}`;
    client.db(dbn).collection("wars").updateOne({ _id }, {
        $set: {
            [str + ".field"]: newField,
            [str + ".moved"]: true
        }
    });
    await updateField(_id);
}

export async function updateField(_id: string): Promise<Array<Array<number | string>>> {
    let war: war = await client.db(dbn).collection("wars").findOne({ _id })!;
    let arr: (number | string)[][] = JSON.parse(JSON.stringify((Array(15).fill(new Array(15).fill(0)))));
    for (let i = 0; i < war.p1.armies.length; ++i) {
        if (war.p1.armies[i].field)
            arr[war.p1.armies[i].field![0]][war.p1.armies[i].field![1]] = "1#" + i;
    }
    for (let i = 0; i < war.p2.armies.length; ++i) {
        if (war.p2.armies[i].field)
            arr[war.p2.armies[i].field![0]][war.p2.armies[i].field![1]] = "2#" + i;
    }
    await client.db(dbn).collection("wars").updateOne({ _id }, { $set: { field: arr } });
    return arr;
}

export async function updateCosts(_id: string, mode: "money" | "food" | "population" | "oil" | "steel", p1: boolean, amount: number) {
    const str = p1 ? "p1.resources." + mode + ".consumed" : "p2.resources." + mode + ".consumed";
    client.db(dbn).collection("wars").updateOne({ _id }, {
        $inc: { [str]: amount }
    }, err => { if (err) throw err });
}

export async function markAllArmies(_id: string, newVal: boolean) {
    client.db(dbn).collection("wars").updateOne({ _id }, {
        $set: {
            "p1.armies.$[].moved": newVal,
            "p2.armies.$[].moved": newVal
        }
    }, err => { if (err) throw err });
}

export async function replaceArmy(_id: string, p1: boolean, index: number, army: army) {
    client.db(dbn).collection("wars").updateOne({ _id }, {
        $set: {
            [(p1 ? "p1" : "p2") + `.armies.${index}`]: army
        }
    }, err => { if (err) throw err });
}

export async function getOffer(_id: string): Promise<marketOffer> {
    return client.db(dbn).collection("market").findOne({ _id })!;
}

export async function getAllOffers(): Promise<Array<marketOffer>> {
    return client.db(dbn).collection("market").find().toArray();
}

export async function addOffer(offer: marketOffer): Promise<void> {
    client.db(dbn).collection("market").insertOne(offer);
}

export async function findOffer(query: { [key: string]: any }): Promise<marketOffer[]> {
    return client.db(dbn).collection("market").find(query).toArray();
}

export async function deleteOffer(_id: string) {
    client.db(dbn).collection("market").deleteOne({ _id });
}

export async function getOfferID(): Promise<number> {
    const conf = await getConfig();
    const id = conf.totalOffers + 1;
    editConfig("totalOffers", id);
    return id;
}

export async function getContractID(): Promise<number> {
    const conf = await getConfig();
    const id = conf.totalContracts + 1;
    editConfig("totalContracts", id);
    return id;
}

export async function getUnoGame(_id: string): Promise<unoGame> {
    return client.db(dbn).collection("uno").findOne({ _id })!;
}

export async function addUnoGame(game: unoGame): Promise<void> {
    client.db(dbn).collection("uno").insertOne(game);
}

export async function deleteUnoGame(_id: string): Promise<void> {
    client.db(dbn).collection("uno").deleteOne({ _id });
}

export async function addPlayer(_id: string, player: { _id: string, hand: [] }): Promise<void> {
    client.db(dbn).collection("uno").updateOne({ _id }, { $push: { players: player } });
}

export async function removePlayer(_id: string, pid: string): Promise<void> {
    client.db(dbn).collection("uno").updateOne({ _id }, { $pull: { players: { _id: pid } } });
}

export async function setPlayerHand(_id: string, i: number, hand: string[]): Promise<void> {
    client.db(dbn).collection("uno").updateOne({ _id }, { $set: { [`players.${i}.hand`]: hand } });
}

export async function updateGame<K extends keyof unoGame>(_id: string, field: K, value: unoGame[K]): Promise<void> {
    let query = { $set: { [field]: value } };

    client.db(dbn).collection("uno").updateOne({ _id }, query!);
}

export async function getGameID(): Promise<number> {
    const conf = await getConfig();
    const id = conf.totalGames + 1;
    editConfig("totalGames", id);
    return id;
}

export async function connectToDB(): Promise<void> {
    return new Promise(resolve => {
        client.connect(async err => {
            if (err) throw err;
            console.log("Successfully connected");
            client.db(dbn).createCollection("users");
            client.db(dbn).createCollection("alliances");
            client.db(dbn).createCollection("giveaways");
            client.db(dbn).createCollection("servers");
            client.db(dbn).createCollection("wars");
            client.db(dbn).createCollection("market");
            client.db(dbn).createCollection("trades");
            client.db(dbn).createCollection("uno");
            if (!(await client.db(dbn).collection("config").findOne({ _id: 1 }))) {
                client.db(dbn).collection("config").insertOne(config);
            }
            connected = true;
            resolve();
        });
    });
}