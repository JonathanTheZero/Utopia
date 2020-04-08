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
async function addMoney(_id, money) {
    let newValues = {
        $set: {
            money: (await getUser(_id)).money + money
        }
    };
    client.db(dbName).collection("users").updateOne({ _id }, newValues, err => {
        if (err)
            throw err;
    });
}
exports.addMoney = addMoney;
function start() {
    client.connect(err => {
        if (err)
            throw err;
        console.log("Successfully connected");
    });
}
exports.start = start;
