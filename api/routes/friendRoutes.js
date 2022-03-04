const express = require("express");
const { addFriend, getFriends, acceptFriend, removeFriend } = require("../database/friendTable");
const { checkAuth } = require("../other/middleware");

const friendRoutes = express.Router();

friendRoutes.post("/addFriend", checkAuth(), (req, res) => {
  const { friend } = req.body;
  if (!friend) return res.sendStatus(400);

  const isSameUser = friend == req.session.name;
  if (isSameUser) return res.sendStatus(400);

  const isSuccessful = addFriend(req.session.name, friend) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

friendRoutes.post("/acceptFriend", checkAuth(), (req, res) => {
  const { friend } = req.body;
  if (!friend) return res.sendStatus(400);

  const isSuccessful = acceptFriend(req.session.name, friend) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

friendRoutes.post("/removeFriend", checkAuth(), (req, res) => {
  const { friend } = req.body;
  if (!friend) return res.sendStatus(400);

  const isSuccessful = removeFriend(req.session.name, friend) > 0;
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
