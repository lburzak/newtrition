const {MongoClient} = require("mongodb");

let db;
let connection;

async function open() {
    connection = await MongoClient.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
    });

    db = await connection.db(process.env.MONGO_DB);
    await db.collection('users').createIndex({"username": 1}, {unique: true})
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