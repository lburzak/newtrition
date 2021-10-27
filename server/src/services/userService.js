const {ResourceError, Result} = require("./results");
const db = require("../util/db");

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

async function findUserByUsername(username) {
    const Users = db.collection('users');

    const user = await Users.findOne({username});

    if (!user)
        return Result.withError(ResourceError.NOT_EXISTS);

    return Result.withData(user);
}

module.exports = {
    createUser,
    findUserByUsername
};