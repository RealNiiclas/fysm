const { compareSync } = require("bcrypt");
const { checkAuth } = require("../utils/middleware");
const { deleteUser, getUserByName, deletePosts, deleteFriends } = require("../database/usersTable");
const express = require("express");

const userRoutes = express.Router();

userRoutes.post("/user", checkAuth(), (req, res) => {
  return res.send(req.session.name);
});

userRoutes.post("/delete", checkAuth(), (req, res) => {
  const { password } = req.body;
  if (!password) return res.sendStatus(400);

  const foundUser = getUserByName(req.session.name);
  if (!foundUser) return res.sendStatus(400);

  const isPasswordCorrect = compareSync(password, foundUser.password);
  if (!isPasswordCorrect) return res.sendStatus(400);

  const isSuccessful = deletePosts(req.session.name)
    && deleteFriends(req.session.name) && deleteUser(req.session.name);
  if (!isSuccessful) return res.sendStatus(400);

  req.session.destroy();
  return res.sendStatus(200);
});

module.exports = {
  userRoutes
};
