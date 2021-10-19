const Result = require('../results/result')
const AuthError = require("../results/authError");
const jwt = require('./jwtAuthentication');
const db = require('../data/db');
const {serializeUser} = require("../models/user");

function generateAccessToken(user) {
    return jwt.generateAccessToken(user);
}

function generateRefreshToken(user) {
    return "refreshtoken"
}

async function generateTokens(username, password) {
    const Users = db.collection('users');
    const userEntity = await Users.findOne({username, password});


    if (userEntity) {
        const user = serializeUser(userEntity);

        return Result.withData({
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user)
        });
    }

    return Result.withError(AuthError.INVALID_USERNAME_OR_PASSWORD);
}

function authenticate(token) {
    const user = jwt.verifyToken(token);

    if (!user)
        return Result.withError(AuthError.INVALID_TOKEN);

    return Result.withData(user);
}

module.exports = {
    generateTokens,
    authenticate
}