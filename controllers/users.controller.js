const { selectUsers, selectUsersByUsername } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const username = req.params.username;
  try {
    const users = await selectUsersByUsername(username);
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};
