const express = require("express");

const userRoutes = express.Router();
const userErrorCodes = {
  "USER_NOT_LOGGED_IN": "0"
};

userRoutes.post("/user", (req, res) => {
  if(!req.session.name) return res.status(403)
    .send(userErrorCodes.USER_NOT_LOGGED_IN);
  
  return res.send(req.session.name);
});

module.exports = {
  userRoutes,
  userErrorCodes
};
