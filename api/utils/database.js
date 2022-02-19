const fs = require("fs");
const config = require("../../config.json");
const database = require("better-sqlite3");
const { v4 } = require("uuid");

const outputPath = `${__dirname}/../../${config.databaseOutputPath}`;
const outputDirectory = outputPath.substring(0, outputPath.lastIndexOf("/"));
fs.mkdirSync(outputDirectory, { recursive: true });

const db = new database(outputPath);

function initDatabase() {
  initUsersTable();
  initPostsTable();
  initFriendsTable();
}

function initUsersTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    name TEXT PRIMARY KEY,
    password TEXT NOT NULL
  )`).run();
}

function initPostsTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    time DATE NOT NULL
  )`).run();
}

function initFriendsTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS friends (
    id TEXT PRIMARY KEY,
    sender TEXT REFERENCES users (name),
    receiver TEXT REFERENCES users (name),
    accepted BOOLEAN NOT NULL
  )`).run();
}

function createUser(name, password) {
  try { return db.prepare("INSERT INTO users (name, password) VALUES (?, ?)").run(name, password).changes > 0; }
  catch (err) { return false; }
}

function deleteUser(name) {
  try { return db.prepare("DELETE FROM users WHERE name=?").run(name).changes > 0; }
  catch (err) { return false; }
}

function getUserByName(name) {
  return db.prepare("SELECT * FROM users WHERE name=?").get(name);
}

function createPost(author, content) {
  try { return db.prepare("INSERT INTO posts (id, author, content, time) VALUES (?, ?, ?, ?)").run(v4(), author, content, Date.now()).changes > 0; }
  catch (err) { return false; }
}

function deletePosts(author) {
  if (db.prepare("SELECT * FROM posts WHERE author=?").all(author).length === 0) return true;
  try { return db.prepare("DELETE FROM posts WHERE author=?").run(author).changes > 0; }
  catch (err) { return false; }
}

function getPosts(name) {
  if (getFriends(name).length <= 0) return db.prepare("SELECT * FROM posts WHERE author=?").all(name);
  return db.prepare(`SELECT DISTINCT posts.id, author, content, time FROM posts, friends WHERE
    friends.accepted=1 AND (posts.author=friends.sender OR posts.author=friends.receiver)
    AND (friends.sender=? OR friends.receiver=?)
    ORDER BY time DESC`).all(name, name);
}

function addFriend(sender, receiver) {
  const id = [sender, receiver].sort().toString().replaceAll(",", "");
  try { return db.prepare("INSERT INTO friends (id, sender, receiver, accepted) VALUES (?, ?, ?, 0)").run(id, sender, receiver).changes > 0; }
  catch (err) { return false; }
}

function acceptFriend(receiver, sender) {
  try { return db.prepare("UPDATE friends SET accepted=1 WHERE receiver=? AND sender=? AND accepted=0").run(receiver, sender).changes > 0; }
  catch (err) { return false; }
}

function deleteFriends(name) {
  if (db.prepare("SELECT * FROM friends WHERE (sender=? OR receiver=?)").all(name, name).length === 0) return true;
  try { return db.prepare("DELETE FROM friends WHERE (sender=? OR receiver=?)").run(name, name).changes > 0; }
  catch (err) { console.log(err); return false; }
}

function removeFriend(name, nameFriend) {
  try { return db.prepare("DELETE FROM friends WHERE (sender=? AND receiver=?) OR (receiver=? AND sender=?)").run(name, nameFriend, nameFriend, name).changes > 0; }
  catch (err) { console.log(err); return false; }
}

function getFriends(name) {
  const friends = db.prepare("SELECT id, sender, receiver, accepted FROM friends WHERE sender=? OR receiver=?").all(name, name);
  return friends.map((friend) => friend.sender === name ?
    { id: friend.id, name: friend.receiver, accepted: friend.accepted, receiver: false } :
    { id: friend.id, name: friend.sender, accepted: friend.accepted, receiver: true });
}

module.exports = {
  initDatabase,
  getUserByName,
  createUser,
  deleteUser,
  createPost,
  deletePosts,
  getPosts,
  addFriend,
  acceptFriend,
  deleteFriends,
  removeFriend,
  getFriends
};
