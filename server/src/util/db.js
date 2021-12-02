const {MongoClient} = require("mongodb");

let connection;

const client = new MongoClient(global.__MONGO_URI__);

async function getConnection() {
    if (!connection)
        connection = await client.connect();

    return connection;
}

async function getDatabase() {
    const conn = await getConnection();
    return conn.db();
}

async function dropDatabase() {
    const db = await getDatabase();
    await db.dropDatabase();
}

async function getCollection(collection) {
    const db = await getDatabase();
    return db.collection(collection);
}

module.exports = {
    dropDatabase,
    getCollection,
}