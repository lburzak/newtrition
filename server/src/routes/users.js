const express = require('express');
const UserService = require('../services/userService')
const {ResourceError} = require("../services/results");

const router = express.Router();

router.post('/', async function(req, res) {
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  const result = await UserService.createUser(req.username, req.password);

  if (!result.error)
    return res.sendStatus(200)

  if (result.error === ResourceError.ALREADY_EXISTS)
    return res.sendStatus(409)

  res.sendStatus(500);
});

router.get('/@me', async function(req, res) {
  res.status(200)
      .send({username: res.user.username})
});

module.exports = router;
