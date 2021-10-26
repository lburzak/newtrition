const express = require('express');
const AuthService = require('../services/authService')
const {AuthError, ResourceError} = require("../services/results");
const ValidationService = require("../services/validationService");
const UserService = require("../services/userService");

const router = express.Router();

router.post('/signup', async function(req, res) {
    const {username, password} = req.body;

    if (!req.body.username || !req.body.password)
        return res.sendStatus(400);

    const validationErrors =
        ValidationService.validateUsername(username)
            .concat(ValidationService.validatePassword(password));

    if (validationErrors.length > 0)
        return res.status(400).send({errors: validationErrors});

    const result = await UserService.createUser(username, password);

    if (!result.error)
        return res.sendStatus(200)

    if (result.error === ResourceError.ALREADY_EXISTS)
        return res.sendStatus(409)

    res.sendStatus(500);
});

router.post('/', async function (req, res) {
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
});

module.exports = router;
