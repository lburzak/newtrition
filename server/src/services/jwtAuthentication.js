const jwt = require('jsonwebtoken');
const accessTokenSecret = 'hellothere';

module.exports = {
    verifyToken: (token) => jwt.verify(token, accessTokenSecret),
    generateAccessToken: (user) => jwt.sign(user, accessTokenSecret)
}