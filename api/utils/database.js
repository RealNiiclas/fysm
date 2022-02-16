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
    userOne TEXT REFERENCES users (name),
    userTwo TEXT REFERENCES users (name),
    accepted BOOLEAN NOT NULL
  )`).run();
}

function createUser(name, password) {
  try { db.prepare("INSERT INTO users (name, password) VALUES (?, ?)").run(name, password); }
  catch (err) { return false; }
  return true;
}

function deleteUser(name) {
  try { db.prepare("DELETE FROM users WHERE name=?").run(name); }
  catch (err) { return false; }
  return true;
}

function getUserByName(name) {
  return db.prepare("SELECT * FROM users WHERE name=?").get(name);
}

function createPost(author, content) {
  try { db.prepare("INSERT INTO posts (id, author, content, time) VALUES (?, ?, ?, ?)").run(v4(), author, content, Date.now()); }
  catch (err) { return false; }
  return true;
}

function getPosts() {
  return db.prepare("SELECT * FROM posts ORDER BY time DESC").all();
}

function addFriend(userOne, userTwo) {
  try { db.prepare("INSERT INTO friends (userOne, userTwo, accepted) VALUES (?, ?, ?)").run(userOne, userTwo, false); }
  catch (err) { return false; }
  return true;
}

function acceptFriend(userOne, userTwo) {
  try { db.prepare("UPDATE friends SET accepted=? WHERE (userOne=$userOne AND userTwo=$userTwo) OR (userTwo=$userTwo AND userOne=$userOne)").run(true, { userOne, userTwo }); }
  catch (err) { return false; }
  return true;
}

function removeFriend(userOne, userTwo) {
  try { db.prepare("DELETE FROM friends WHERE (userOne=$userOne AND userTwo=$userTwo) OR (userTwo=$userTwo AND userOne=$userOne)").run({ userOne, userTwo }); }
  catch (err) { return false; }
  return true;
}

function getFriends(name) {
  const friends = db.prepare("SELECT userTwo FROM friends WHERE userOne=?").all(name);
  friends.push(...db.prepare("SELECT userOne FROM friends WHERE userTwo=?").all(name));
  return friends;
}

module.exports = {
  initDatabase,
  getUserByName,
  createUser,
  deleteUser,
  createPost,
  getPosts,
  addFriend,
  acceptFriend,
  removeFriend,
  getFriends
};
