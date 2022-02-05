const { compareSync } = require("bcrypt");
const { deleteUser, getUserByName } = require("../utils/database");
const express = require("express");

const userRoutes = express.Router();
const userErrorCodes = {
  "USER_NOT_LOGGED_IN": "0",
  "DELETE_NOT_LOGGED_IN": "1",
  "DELETE_NO_CREDENTIALS": "2",
  "DELETE_ACCOUNT_NOT_FOUND": "3",
  "DELETE_BAD_CREDENTIALS": "4",
  "DELETE_COULD_NOT_DELETE": "5"
};

userRoutes.post("/user", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.USER_NOT_LOGGED_IN);

  return res.send(req.session.name);
});

userRoutes.post("/delete", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.DELETE_NOT_LOGGED_IN);

  const { password } = req.body;
  if (!password) return res.status(403)
    .send(userErrorCodes.DELETE_NO_CREDENTIALS);

  const foundUser = getUserByName(req.session.name);
  if (!foundUser) return res.status(403)
    .send(userErrorCodes.DELETE_ACCOUNT_NOT_FOUND);

  const isPasswordCorrect = compareSync(password, foundUser.password);
  if (!isPasswordCorrect) return res.status(403)
    .send(userErrorCodes.DELETE_BAD_CREDENTIALS);

  const isSuccessful = deleteUser(req.session.name);
  if (!isSuccessful) return res.status(403)
    .send(userErrorCodes.DELETE_COULD_NOT_DELETE);

  req.session.destroy();
  return res.sendStatus(200);
});

module.exports = {
  userRoutes,
  userErrorCodes
};
