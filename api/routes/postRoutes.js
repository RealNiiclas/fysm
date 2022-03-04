const express = require("express");
const { createPost, getPosts } = require("../database/postTable");
const { checkAuth } = require("../other/middleware");

const postRoutes = express.Router();

postRoutes.post("/post", checkAuth(), (req, res) => {
  const { content } = req.body;
  if (!content) return res.sendStatus(400);

  const isSuccessful = createPost(req.session.name, content) > 0;
  if (!isSuccessful) return res.sendStatus(400);

  return res.sendStatus(200);
});

postRoutes.post("/posts", checkAuth(), (req, res) => {
  const posts = getPosts(req.session.name);
  return res.json(posts);
});

module.exports = {
  postRoutes
};
