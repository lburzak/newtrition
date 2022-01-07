async function getAuthenticatedUser(req, res) {
  res.status(200)
      .send({username: req.user.username})
}

module.exports = {
  getAuthenticatedUser
};
