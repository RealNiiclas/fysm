const express = require("express");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { getUserByName, createUser } = require("../utils/database");

const authRoutes = express.Router();
const authErrorCodes = {
  "LOGIN_NO_CREDENTIALS": 0,
  "LOGIN_BAD_CREDENTIALS": 1,
  "LOGIN_ALREADY_LOGGED_IN": 2,
  "LOGIN_ACCOUNT_NOT_FOUND": 3,
  "REGISTER_NO_CREDENTIALS": 4,
  "REGISTER_ACCOUNT_EXISTS": 5,
  "REGISTER_COULD_NOT_CREATE": 6,
  "LOGOUT_NOT_LOGGED_IN": 7
}

authRoutes.post("/register", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(403)
    .send(authErrorCodes.REGISTER_NO_CREDENTIALS);

  const foundUser = getUserByName(name);
  if (foundUser) return res.status(403)
    .send(authErrorCodes.REGISTER_ACCOUNT_EXISTS);

  const salt = genSaltSync(12);
  const hashedPassword = hashSync(password, salt);
  const isSuccessful = createUser(name, hashedPassword);
  if (!isSuccessful) return res.status(403)
    .send(authErrorCodes.REGISTER_COULD_NOT_CREATE);

  return res.sendStatus(200);
});

authRoutes.post("/login", (req, res) => {
  if(req.session.name) return res.status(403)
    .send(authErrorCodes.LOGIN_ALREADY_LOGGED_IN);

  const { name, password } = req.body;
  if (!name || !password) return res.status(403)
    .send(authErrorCodes.LOGIN_NO_CREDENTIALS);

  const foundUser = getUserByName(name);
  if (!foundUser) return res.status(403)
    .send(authErrorCodes.LOGIN_ACCOUNT_NOT_FOUND);

  const isPasswordCorrect = compareSync(password, foundUser.password);
  if (!isPasswordCorrect) return res.status(403)
    .send(authErrorCodes.LOGIN_BAD_CREDENTIALS);

  req.session.name = name;
  return res.sendStatus(200);
});

authRoutes.post("/logout", (req, res) => {
  if(!req.session.name) return res.status(403)
    .send(authErrorCodes.LOGOUT_NOT_LOGGED_IN);
  
  req.session.destroy();
  return res.sendStatus(200);
});

module.exports = {
  authRoutes,
  authErrorCodes
};
