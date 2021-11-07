const express = require('express');
const UserRepository = require('../repositories/userRepository');
const {create, findByAuthor} = require("../repositories/productRepository");
const {ResourceError} = require("../common/results");
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

  const result = await UserRepository.findByUsername(username);

  if (result.error) {
    const status = convertServiceErrorToStatus(result.error);
    return res.sendStatus(status);
  }

  req.targetUser = result.data;
  next();
}

router.get('/:username/products', extractUserFromPath, async function (req, res) {
  const products = await findByAuthor(req.targetUser.username);

  res.status(200).json(products);
});

router.post('/:username/products', extractUserFromPath, async function (req, res) {
  if (req.targetUser.username !== req.user.username)
    return res.sendStatus(401);

  const product = req.body;
  const validationResult = ValidationService.validateProduct(product);

  if (!validationResult.data.valid) {
    return res.status(400).json({errors: validationResult.data.errors});
  }

  const result = await create(req.targetUser.username, req.body);

  if (!result.error) {
    return res.sendStatus(200);
  }

  return res.sendStatus(500);
})

module.exports = router;
