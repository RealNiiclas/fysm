const express = require("express");

const userRoutes = express.Router();

userRoutes.post("/user", (req, res) => {
  if(!req.session.name) return res.sendStatus(403);
  return res.send(req.session.name);
});

module.exports = {
  userRoutes
};
