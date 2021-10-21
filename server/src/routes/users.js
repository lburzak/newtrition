const express = require('express');
const UserService = require('../services/userService');
const ValidationService = require('../services/validationService');
const {ResourceError} = require("../services/results");

const router = express.Router();

router.post('/', async function(req, res) {
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

router.get('/@me', async function(req, res) {
  res.status(200)
      .send({username: req.user.username})
});

function extractUser(req) {
  const username = req.params.username;

  if (username === '@me')
    return req.user;

  UserService.findUserByUsername(username)
}

router.post('/:username/products', async function (req, res) {
  res.sendStatus(500);
})

module.exports = router;
