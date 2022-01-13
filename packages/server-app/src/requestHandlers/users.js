const UserRepository = require('../repositories/userRepository');

async function getAuthenticatedUser(req, res) {
  const result = await UserRepository.findByUsername(req.user.username);

  if (result.isFailure)
    return res.sendStatus(404);

  const {username, admin} = result.payload;

  res.status(200)
      .send({username, admin});
}

module.exports = {
  getAuthenticatedUser
};
