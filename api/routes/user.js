const { compareSync } = require("bcrypt");
const { checkAuth } = require("../utils/middleware");
const { deleteUser, getUserByName, createPost, getPosts, addFriend, getFriends, acceptFriend, removeFriend } = require("../utils/database");
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

  const isSuccessful = deleteUser(req.session.name);
  if (!isSuccessful) return res.sendStatus(400);

  req.session.destroy();
  return res.sendStatus(200);
});

userRoutes.post("/post", checkAuth(), (req, res) => {
  const { content } = req.body;
  if (!content) return res.sendStatus(400);

  const isSuccessful = createPost(req.session.name, content);
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

userRoutes.post("/posts", checkAuth(), (req, res) => {
  const posts = getPosts(req.session.name);
  return res.json(posts);
});

userRoutes.post("/addFriend", checkAuth(), (req, res) => {
  const { friendName } = req.body;
  if (!friendName) return res.sendStatus(400);

  const isUser = friendName === req.session.name;
  if (isUser) return res.sendStatus(400);

  const isSuccessful = addFriend(req.session.name, friendName);
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

userRoutes.post("/acceptFriend", checkAuth(), (req, res) => {
  const { friendName } = req.body;
  if (!friendName) return res.sendStatus(400);

  const isSuccessful = acceptFriend(req.session.name, friendName);
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

userRoutes.post("/removeFriend", checkAuth(), (req, res) => {
  const { friendName } = req.body;
  if (!friendName) return res.sendStatus(400);

  const isSuccessful = removeFriend(req.session.name, friendName);
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

userRoutes.post("/friends", checkAuth(), (req, res) => {
  const friends = getFriends(req.session.name);
  return res.json(friends);
});

module.exports = {
  userRoutes
};
