const { compareSync } = require("bcrypt");
const { deleteUser, getUserByName, createPost, getPosts, addFriend, getFriends, acceptFriend, removeFriend } = require("../utils/database");
const express = require("express");

const userRoutes = express.Router();
const userErrorCodes = {
  "USER_NOT_LOGGED_IN": "0",
  "DELETE_NOT_LOGGED_IN": "1",
  "DELETE_NO_CREDENTIALS": "2",
  "DELETE_ACCOUNT_NOT_FOUND": "3",
  "DELETE_BAD_CREDENTIALS": "4",
  "DELETE_COULD_NOT_DELETE": "5",
  "POST_NOT_LOGGED_IN": "6",
  "POST_COULD_NOT_CREATE": "7",
  "POST_NO_CONTENT": "8",
  "POSTS_NOT_LOGGED_IN": "9",
  "ADD_FRIEND_NOT_LOGGED_IN": "10",
  "ADD_FRIEND_NO_CONTENT": "11",
  "ADD_FRIEND_IS_ALREADY_FRIEND": "12",
  "ADD_FRIEND_COULD_NOT_CREATE": "13",
  "ACCEPT_FRIEND_NOT_LOGGED_IN": "14",
  "ACCEPT_FRIEND_NO_CONTENT": "15",
  "ACCEPT_FRIEND_COULD_NOT_CREATE": "16",
  "REMOVE_FRIEND_NOT_LOGGED_IN": "17",
  "REMOVE_FRIEND_NO_CONTENT": "18",
  "REMOVE_FRIEND_COULD_NOT_CREATE": "19",
  "FRIENDS_NOT_LOGGED_IN": "20"
};

userRoutes.post("/user", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.USER_NOT_LOGGED_IN);

  return res.send(req.session.name);
});

userRoutes.post("/delete", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.DELETE_NOT_LOGGED_IN);

  const { password } = req.body;
  if (!password) return res.status(403)
    .send(userErrorCodes.DELETE_NO_CREDENTIALS);

  const foundUser = getUserByName(req.session.name);
  if (!foundUser) return res.status(403)
    .send(userErrorCodes.DELETE_ACCOUNT_NOT_FOUND);

  const isPasswordCorrect = compareSync(password, foundUser.password);
  if (!isPasswordCorrect) return res.status(403)
    .send(userErrorCodes.DELETE_BAD_CREDENTIALS);

  const isSuccessful = deleteUser(req.session.name);
  if (!isSuccessful) return res.status(403)
    .send(userErrorCodes.DELETE_COULD_NOT_DELETE);

  req.session.destroy();
  return res.sendStatus(200);
});

userRoutes.post("/post", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.POST_NOT_LOGGED_IN);

  const { content } = req.body;
  if (!content) return res.status(403)
    .send(userErrorCodes.POST_NO_CONTENT);

  const isSuccessful = createPost(req.session.name, content);
  if (!isSuccessful) return res.status(403)
    .send(userErrorCodes.POST_COULD_NOT_CREATE);

  return res.sendStatus(200);
});

userRoutes.post("/posts", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.POSTS_NOT_LOGGED_IN);

  const posts = getPosts();
  return res.json(posts);
});

userRoutes.post("/addFriend", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.ADD_FRIEND_NOT_LOGGED_IN);

  const { friendName } = req.body;
  if (!friendName) return res.status(403)
    .send(userErrorCodes.ADD_FRIEND_NO_CONTENT);

  const isUser = friendName === req.session.name;
  if (isUser) return res.status(403)
    .send(userErrorCodes.ADD_FRIEND_COULD_NOT_CREATE);

  const isSuccessful = addFriend(req.session.name, friendName);
  if (!isSuccessful) return res.status(403)
    .send(userErrorCodes.ADD_FRIEND_COULD_NOT_CREATE);

  return res.sendStatus(200);
});

userRoutes.post("/acceptFriend", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.ACCEPT_FRIEND_NOT_LOGGED_IN);

  const { friendName } = req.body;
  if (!friendName) return res.status(403)
    .send(userErrorCodes.ACCEPT_FRIEND_NO_CONTENT);

  const isSuccessful = acceptFriend(req.session.name, friendName);
  if (!isSuccessful) return res.status(403)
    .send(userErrorCodes.ACCEPT_FRIEND_COULD_NOT_CREATE);

  return res.sendStatus(200);
});

userRoutes.post("/removeFriend", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.REMOVE_FRIEND_NOT_LOGGED_IN);

  const { friendName } = req.body;
  if (!friendName) return res.status(403)
    .send(userErrorCodes.REMOVE_FRIEND_NO_CONTENT);

  const isSuccessful = removeFriend(req.session.name, friendName);
  if (!isSuccessful) return res.status(403)
    .send(userErrorCodes.REMOVE_FRIEND_COULD_NOT_CREATE);

  return res.sendStatus(200);
});

userRoutes.post("/friends", (req, res) => {
  if (!req.session.name) return res.status(403)
    .send(userErrorCodes.FRIENDS_NOT_LOGGED_IN);

  const friends = getFriends(req.session.name);
  return res.json(friends);
});

module.exports = {
  userRoutes,
  userErrorCodes
};
