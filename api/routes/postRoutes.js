const express = require("express");
const { createPost, getPosts } = require("../database/postTable");
const { containsSwearWords, containsFakeNews } = require("../filtering/filter");
const { checkAuth } = require("../other/middleware");
const config = require("../../config.json");

const postRoutes = express.Router();

postRoutes.post("/post", checkAuth(), async (req, res) => {
  const { content } = req.body;
  if (!content) return res.sendStatus(400);

  const isInvalid = ((config.filterSwearWords && containsSwearWords(message)) ||
    (config.filterFakeNews && (await containsFakeNews(message))));
  if (isInvalid) return res.sendStatus(460);

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
