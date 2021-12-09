const AuthService = require('../services/authService')
const {AuthError, ResourceError} = require("../common/results");
const UserRepository = require("../repositories/userRepository");

async function signUp(req, res) {
    const credentials = req.body;

    const {username, password} = credentials;
    const result = await UserRepository.create(username, password);

    if (!result.error)
        return res.sendStatus(200)

    if (result.error === ResourceError.ALREADY_EXISTS)
        return res.sendStatus(409)

    res.sendStatus(500);
}

async function getToken(req, res) {
    const {username, password} = req.body

    if (!username || !password)
        return res.sendStatus(400);

    const result = await AuthService.generateTokens(username, password);

    if (result.error === AuthError.INVALID_USERNAME_OR_PASSWORD)
        return res.status(401).send({
            error: {
                message: "Invalid username or password."
            }
        });

    if (result.data) {
        const {accessToken, refreshToken} = result.data;
        return res.status(200).send({accessToken, refreshToken});
    }

    res.sendStatus(500);
}

module.exports = {
    signUp,
    getToken
}