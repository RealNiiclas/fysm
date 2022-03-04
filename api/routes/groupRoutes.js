const express = require("express");
const { createGroup, getGroups } = require("../database/groupingTable");
const { getGroupMessages } = require("../database/gmTable");
const { addMember } = require("../database/memberTable");
const { checkAuth } = require("../other/middleware");

const groupRoutes = express.Router();

groupRoutes.post("/createGroup", checkAuth(), (req, res) => {
  const { group } = req.body;
  if (!group) return res.sendStatus(400);

  const generatedGroup = createGroup(group);
  if (!generatedGroup) return res.sendStatus(400);

  const isSuccessful = addMember(req.session.name, generatedGroup.id, 1, 1) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

groupRoutes.post("/groups", checkAuth(), (req, res) => {
  const groups = getGroups(req.session.name);
  return res.json(groups);
});

groupRoutes.post("/groupMessages", checkAuth(), (req, res) => {
  const { group } = req.body;
  if (!group) return res.sendStatus(400);

  const messages = getGroupMessages(req.session.name, group);
  return res.json(messages);
});

module.exports = {
  groupRoutes
};
