const { checkAuth } = require("../utils/middleware");
const { addFriend, getFriends, acceptFriend, removeFriend } = require("../utils/database");
const express = require("express");

const friendRoutes = express.Router();

friendRoutes.post("/addFriend", checkAuth(), (req, res) => {
  const { friendName } = req.body;
  if (!friendName) return res.sendStatus(400);

  const isUser = friendName === req.session.name;
  if (isUser) return res.sendStatus(400);

  const isSuccessful = addFriend(req.session.name, friendName);
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

friendRoutes.post("/acceptFriend", checkAuth(), (req, res) => {
  const { friendName } = req.body;
  if (!friendName) return res.sendStatus(400);

  const isSuccessful = acceptFriend(req.session.name, friendName);
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

friendRoutes.post("/removeFriend", checkAuth(), (req, res) => {
  const { friendName } = req.body;
  if (!friendName) return res.sendStatus(400);

  const isSuccessful = removeFriend(req.session.name, friendName);
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

friendRoutes.post("/friends", checkAuth(), (req, res) => {
  const friends = getFriends(req.session.name);
  return res.json(friends);
});

module.exports = {
  friendRoutes
};
