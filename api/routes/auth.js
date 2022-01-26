const express = require("express");
const { getUserByName, createUser } = require("../utils/database");

const authRoutes = express.Router();

authRoutes.post("/register", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.sendStatus(403);

  const foundUser = await getUserByName(name);
  if (foundUser) return res.sendStatus(403);

  const isSuccessful = await createUser(name, password);
  if (!isSuccessful) return res.sendStatus(403);

  return res.sendStatus(200);
});

module.exports = {
  authRoutes
};
