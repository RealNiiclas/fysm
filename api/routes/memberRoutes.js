const { checkAuth } = require("../other/middleware");
const { getGroups, removeMember, acceptInvite, getMembers, addMember, deleteMembers } = require("../database/membersTable");
const { deleteGroup } = require("../database/groupsTable");
const express = require("express");

const memberRoutes = express.Router();

memberRoutes.post("/inviteGroup", checkAuth(), (req, res) => {
  const { username, groupname } = req.body;
  if (!groupname || !username) return res.sendStatus(400);

  const canInvite = !!getGroups(req.session.name)
    .find((group) => group.groupname === groupname && group.accepted === 1 && group.admin === 1);
  if (!canInvite) return res.sendStatus(400);

  const isSuccessful = addMember(groupname, username, 0, 0) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

memberRoutes.post("/acceptInvite", checkAuth(), (req, res) => {
  const { groupname } = req.body;
  if (!groupname) return res.sendStatus(400);

  const isSuccessful = acceptInvite(groupname, req.session.name) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

memberRoutes.post("/leaveGroup", checkAuth(), (req, res) => {
  const { groupname } = req.body;
  if (!groupname) return res.sendStatus(400);

  const isSuccessful = removeMember(groupname, req.session.name) > 0;
  if (!isSuccessful) return res.sendStatus(400);
  
  if (!getMembers(groupname).find((member) => (member.accepted === 1 && member.admin === 1))) {
    deleteMembers(groupname);
    deleteGroup(groupname);
  }

  return res.sendStatus(200);
});

module.exports = {
  memberRoutes
};
