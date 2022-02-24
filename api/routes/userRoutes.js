const { compareSync } = require("bcrypt");
const { checkAuth } = require("../other/middleware");
const { deleteUser, getUserByName } = require("../database/usersTable");
const { getGroups, removeMember, getMembers, deleteMembers } = require("../database/membersTable");
const { deleteChatMessages } = require("../database/chatsTable");
const { deleteMessages } = require("../database/messagesTable");
const { deleteFriends } = require("../database/friendsTable");
const { deleteGroup } = require("../database/groupsTable");
const { deletePosts } = require("../database/postsTable");
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

  if (deleteChatMessages(req.session.name) < 0)
    return res.sendStatus(400);

  const userGroups = getGroups(req.session.name);
  userGroups.forEach((group) => {
    if (removeMember(group.groupname, req.session.name) < 1) return res.sendStatus(400);
    if (!getMembers(group.groupname).find((member) => (member.accepted === 1 && member.admin === 1))) {
      deleteMembers(group.groupname);
      deleteGroup(group.groupname);
    }
  });

  const isSuccessful = deletePosts(req.session.name) > -1 &&
    deleteFriends(req.session.name) > -1 && deleteMessages(req.session.name) > -1 && deleteUser(req.session.name) > -1;
  if (!isSuccessful) return res.sendStatus(400);

  req.session.destroy();
  return res.sendStatus(200);
});

module.exports = {
  userRoutes
};
