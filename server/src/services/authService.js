const {Result, AuthError} = require('../common/results')
const jwt = require('../util/jwtAuthentication');
const db = require('../util/db');
const {serializeUser} = require("../models/user");

async function generateTokens(username, password) {
    const Users = db.collection('users');
    const userEntity = await Users.findOne({username, password});

    if (userEntity) {
        const user = serializeUser(userEntity);

        return Result.withData({
            accessToken: jwt.generateAccessToken(user),
            refreshToken: "refresh_token"
        });
    }

    return Result.withError(AuthError.INVALID_USERNAME_OR_PASSWORD);
}

function authenticate(token) {
    const user = jwt.verifyToken(token);

    if (!user)
        return Result.withError(AuthError.INVALID_TOKEN);

    return Result.withData(serializeUser(user));
}

module.exports = {
    generateTokens,
    authenticate
}