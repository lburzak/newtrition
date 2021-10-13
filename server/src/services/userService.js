const ResourceError = require("../results/resourceErrors");
const Result = require("../results/result");
const db = require("../data/db");

async function createUser(username, password) {
    const Users = db.collection('users');
    const existingUser = await Users.findOne({username});

    if (existingUser)
        return Result.withError(ResourceError.ALREADY_EXISTS);

    await Users.insertOne({
        username,
        password
    });

    return Result.empty();
}

module.exports = {
    createUser
};