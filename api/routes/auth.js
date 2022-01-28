const express = require("express");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { getUserByName, createUser } = require("../utils/database");

const authRoutes = express.Router();

authRoutes.post("/register", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.sendStatus(403);

  const foundUser = getUserByName(name);
  if (foundUser) return res.sendStatus(403);

  const salt = genSaltSync(12);
  const hashedPassword = hashSync(password, salt);
  const isSuccessful = createUser(name, hashedPassword);
  if (!isSuccessful) return res.sendStatus(403);

  return res.sendStatus(200);
});

authRoutes.post("/login", (req, res) => {
  if(req.session.name) return res.sendStatus(403);

  const { name, password } = req.body;
  if (!name || !password) return res.sendStatus(403);

  const foundUser = getUserByName(name);
  if (!foundUser) return res.sendStatus(403);

  const isPasswordCorrect = compareSync(password, foundUser.password);
  if (!isPasswordCorrect) return res.sendStatus(403);

  req.session.name = name;
  return res.sendStatus(200);
});

authRoutes.post("/logout", (req, res) => {
  if(!req.session.name) return res.sendStatus(403);
  
  req.session.destroy();
  return res.sendStatus(200);
});

module.exports = {
  authRoutes
};
