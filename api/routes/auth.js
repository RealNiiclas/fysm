const express = require("express");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { getUserByName, createUser } = require("../utils/database");
const { checkAuth } = require("../utils/middleware");

const authRoutes = express.Router();

authRoutes.post("/register", checkAuth(false), (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.sendStatus(400);

  const foundUser = getUserByName(name);
  if (foundUser) return res.sendStatus(400);

  const salt = genSaltSync(12);
  const hashedPassword = hashSync(password, salt);
  const isSuccessful = createUser(name, hashedPassword);
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

authRoutes.post("/login", checkAuth(false), (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.sendStatus(400);

  const foundUser = getUserByName(name);
  if (!foundUser) return res.sendStatus(400);

  const isPasswordCorrect = compareSync(password, foundUser.password);
  if (!isPasswordCorrect) return res.sendStatus(400);

  req.session.name = name;
  return res.sendStatus(200);
});

authRoutes.post("/logout", checkAuth(), (req, res) => {
  req.session.destroy();
  return res.sendStatus(200);
});

module.exports = {
  authRoutes
};
