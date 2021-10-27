const express = require('express');
const UserService = require('../services/userService');
const {createProduct} = require("../services/productService");
const {ResourceError} = require("../services/results");
const ValidationError = require("../models/validationError");
const ValidationService = require('../services/validationService');

const router = express.Router();

router.get('/@me', async function(req, res) {
  res.status(200)
      .send({username: req.user.username})
});

function convertServiceErrorToStatus(error) {
  let status;

  switch (error) {
    case ResourceError.NOT_EXISTS: status = 404; break;
    default: status = 500
  }

  return status;
}

async function extractUserFromPath(req, res, next) {
  const username = req.params.username;

  if (username === '@me') {
    req.targetUser = req.user;
    return next();
  }

  const result = await UserService.findUserByUsername(username);

  if (result.error) {
    const status = convertServiceErrorToStatus(result.error);
    return res.sendStatus(status);
  }

  req.targetUser = result.data;
  next();
}

router.post('/:username/products', extractUserFromPath, async function (req, res) {
  const product = req.body;
  const validationResult = ValidationService.validateProduct(product);

  if (validationResult.error) {
    const error = ValidationError.fromJoiError(validationResult.error);
    return res.status(400).json(error);
  }

  const result = await createProduct(req.targetUser.username, req.body);

  if (!result.error) {
    return res.sendStatus(200);
  }

  return res.sendStatus(500);
})

module.exports = router;
