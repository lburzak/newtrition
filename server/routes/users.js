const express = require('express');
const router = express.Router();

/* GET users listing. */
router.post('/', function(req, res) {
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  res.sendStatus(500);
});

module.exports = router;
