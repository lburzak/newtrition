const express = require('express');
const UserService = require('../src/services/userService')
const ResourceError = require("../src/errors/resourceErrors");

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

module.exports = router;
