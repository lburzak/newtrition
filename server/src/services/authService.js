const Result = require('../results/result')

function generateAccessToken(username, password) {
    return "accesstoken";
}

function generateRefreshToken(username, password) {
    return "refreshtoken"
}

function authenticate(username, password) {
    return Result.withData({
        accessToken: generateAccessToken(username, password),
        refreshToken: generateRefreshToken(username, password)
    });
}

module.exports = {
    authenticate
}