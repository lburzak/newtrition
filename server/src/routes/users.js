const express = require('express');
const UserService = require('../services/userService');
const ValidationService = require('../services/validationService');
const {ResourceError} = require("../services/results");

const router = express.Router();

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
