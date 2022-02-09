const fs = require("fs");
const config = require("../../config.json");
const database = require("better-sqlite3");
const { v4 } = require("uuid");

const outputPath = `${__dirname}/../../${config.databaseOutputPath}`;
const outputDirectory = outputPath.substring(0, outputPath.lastIndexOf("/"));
fs.mkdirSync(outputDirectory, { recursive: true });

const db = new database(outputPath);

function initDatabase() {
  initUserTable();
  initPostTable();
}

function initUserTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`).run();
}

function initPostTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS posts (
    id TEXT UNIQUE NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    time DATE NOT NULL
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

module.exports = {
  initDatabase,
  getUserByName,
  createUser,
  deleteUser,
  createPost,
  getPosts
};
