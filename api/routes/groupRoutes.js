const { checkAuth } = require("../other/middleware");
const { createGroup } = require("../database/groupsTable");
const { addMember, getGroups } = require("../database/membersTable");
const express = require("express");

const groupRoutes = express.Router();

groupRoutes.post("/createGroup", checkAuth(), (req, res) => {
  const { groupname } = req.body;
  if (!groupname) return res.sendStatus(400);

  const generatedGroup = createGroup(groupname);
  if (!generatedGroup) return res.sendStatus(400);

  const isSuccessful = addMember(generatedGroup.name, req.session.name, 1, 1) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

groupRoutes.post("/groups", checkAuth(), (req, res) => {
  const groups = getGroups(req.session.name);
  return res.json(groups);
});

module.exports = {
  groupRoutes
};
