const express = require("express");
const { removeMember, acceptInvite, getMembers, addMember, makeAdmin, deleteMembers } = require("../database/memberTable");
const { deleteGroup, getGroups } = require("../database/groupingTable");
const { checkAuth } = require("../other/middleware");

const memberRoutes = express.Router();

memberRoutes.post("/inviteGroup", checkAuth(), (req, res) => {
  const { user, group } = req.body;
  if (!group || !user) return res.sendStatus(400);

  const canInvite = !!getGroups(req.session.name).find((gr) => gr.id == group && gr.accepted == 1 && gr.admin == 1);
  if (!canInvite) return res.sendStatus(400);

  const isSuccessful = addMember(user, group, 0, 0) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

memberRoutes.post("/acceptInvite", checkAuth(), (req, res) => {
  const { group } = req.body;
  if (!group) return res.sendStatus(400);

  const isSuccessful = acceptInvite(req.session.name, group) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

memberRoutes.post("/leaveGroup", checkAuth(), (req, res) => {
  const { group } = req.body;
  if (!group) return res.sendStatus(400);

  const isSuccessful = removeMember(req.session.name, group) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  const members = getMembers(group).filter((member) => member.accepted == 1);
  if (members.length != 0) makeAdmin(members[0].user, group);
  else {
    deleteMembers(group);
    deleteGroup(group);
  }

  return res.sendStatus(200);
});

module.exports = {
  memberRoutes
};
