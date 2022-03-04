const express = require("express");
const { compareSync } = require("bcrypt");
const { getMembers, deleteMembers, makeAdmin } = require("../database/memberTable");
const { deleteGroup, getGroups } = require("../database/groupingTable");
const { deleteUser, getUser } = require("../database/userTable");
const { getMessages } = require("../database/pmTable");
const { checkAuth } = require("../other/middleware");

const userRoutes = express.Router();

userRoutes.post("/user", checkAuth(), (req, res) => {
  return res.send(req.session.name);
});

userRoutes.post("/delete", checkAuth(), (req, res) => {
  const { password } = req.body;
  if (!password) return res.sendStatus(400);

  const foundUser = getUser(req.session.name);
  if (!foundUser) return res.sendStatus(400);

  const isPasswordCorrect = compareSync(password, foundUser.password);
  if (!isPasswordCorrect) return res.sendStatus(400);

  const userGroups = getGroups(req.session.name);
  const isSuccessful = deleteUser(req.session.name) > -1;
  if (!isSuccessful) return res.sendStatus(400);

  userGroups.forEach((group) => {
    const groupMembers = getMembers(group.id).filter((member) => member.accepted == 1);
    if (groupMembers.length != 0) makeAdmin(group.id, groupMembers[0].user);
    else {
      deleteMembers(group.id);
      deleteGroup(group.id);
    }
  });

  req.session.destroy();
  return res.sendStatus(200);
});

userRoutes.post("/messages", checkAuth(), (req, res) => {
  const { nameFriend } = req.body;
  if (!nameFriend) return res.sendStatus(400);

  const messages = getMessages(req.session.name, nameFriend);
  return res.json(messages);
});

module.exports = {
  userRoutes
};
