const { v4 } = require("uuid");
const express = require("express");
const { checkToken } = require("../middleware/auth");
const { getUserByName, createUser, setUserVersion } = require("../utils/database");
const { sendAccessToken, sendRefreshToken } = require("../utils/tokens");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

const authRoutes = express.Router();

authRoutes.post("/register", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.sendStatus(403);

  const foundUser = await getUserByName(name);
  if (foundUser) return res.sendStatus(403);

  const salt = genSaltSync(12);
  const hashedPassword = hashSync(password, salt);
  const isSuccessful = await createUser(name, hashedPassword);
  if (!isSuccessful) return res.sendStatus(403);

  return res.sendStatus(200);
});

authRoutes.post("/login", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.sendStatus(403);

  const foundUser = await getUserByName(name);
  if (!foundUser) return res.sendStatus(403);

  const isPasswordCorrect = compareSync(password, foundUser.password);
  if (!isPasswordCorrect) return res.sendStatus(403);

  const newVersion = v4();
  await setUserVersion(foundUser.id, newVersion);
  foundUser.version = newVersion;

  sendAccessToken(res, foundUser);
  sendRefreshToken(res, foundUser);

  return res.sendStatus(200);
});

authRoutes.post("/logout", checkToken("act"), async (req, res) => {
  await setUserVersion(res.locals.user.id, v4());
  return res.sendStatus(200);
});

authRoutes.post("/refresh", checkToken("rft"), async (req, res) => {
  const user = res.locals.user;
  const newVersion = v4();

  await setUserVersion(user.id, newVersion);
  user.version = newVersion;

  sendAccessToken(res, user);
  sendRefreshToken(res, user);

  return res.sendStatus(200);
});

module.exports = {
  authRoutes
};
