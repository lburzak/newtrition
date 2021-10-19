const express = require('express');
const AuthService = require('../services/authService')

const router = express.Router();

router.post('/', async function(req, res) {
    const {username, password} = req.body

    // if (!username || !password)
    //     return res.sendStatus(400);
    //
    // const result = await UserService.createUser(req.username, req.password);
    //
    // if (!result.error)
    //     return res.sendStatus(200)
    //
    // if (result.error === ResourceError.ALREADY_EXISTS)
    //     return res.sendStatus(409)

    const result = AuthService.generateTokens(username, password);
    const {accessToken, refreshToken} = result.data;

    res.status(200).send({accessToken, refreshToken})

    // res.sendStatus(500);
});

module.exports = router;
