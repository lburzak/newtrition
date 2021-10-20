const express = require('express');
const UserService = require('../services/userService')
const {ResourceError} = require("../services/results");

const router = express.Router();

function verifyUsername(username) {
  const matcher = /^([A-Za-z\-]+)$/;

  return matcher.test(username);
}

router.post('/', async function(req, res) {
  const {username, password} = req.body;

  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  if (!verifyUsername(username))
      return res.sendStatus(400);

  const result = await UserService.createUser(username, password);

  if (!result.error)
    return res.sendStatus(200)

  if (result.error === ResourceError.ALREADY_EXISTS)
    return res.sendStatus(409)

  res.sendStatus(500);
});

router.get('/@me', async function(req, res) {
  res.status(200)
      .send({username: req.user.username})
});

module.exports = router;
