const {MongoClient} = require("mongodb");

let db;
let connection;

async function open() {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    db = await connection.db();
    await db.collection('users').createIndex({"username": 1}, {unique: true});
}

async function close() {
    await connection.close();
}

async function drop() {
    await db.dropDatabase();
}

module.exports = {
    collection: (name) => db.collection(name),
    close,
    open,
    drop
};