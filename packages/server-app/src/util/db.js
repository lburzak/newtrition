const {MongoClient} = require("mongodb");

let connection;

const client = new MongoClient(getDatabaseUri() || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 2000
});

function getDatabaseUri() {
    const uri = global.__MONGO_URI__ || process.env.MONGO_URI;

    if (!uri)
        throw new Error("Unable to connect to database: MONGO_URI environmental variable is not set!");

    return uri;
}

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