const fs = require("fs");
const { v4 } = require("uuid");
const config = require("../../config.json");
const database = require("better-sqlite3");

const outputPath = `${__dirname}/../../${config.database.outputPath}`;
const outputDirectory = outputPath.substring(0, outputPath.lastIndexOf("/"));
fs.mkdirSync(outputDirectory, { recursive: true });

const db = new database(outputPath);

function initUserTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id TEXT UNIQUE NOT NULL,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    version TEXT NOT NULL
  )`).run();
}

function createUser(name, password) {
  try { db.prepare("INSERT INTO users (id, name, password, version) VALUES (?, ?, ?, ?)").run(v4(), name, password, v4()); } 
  catch (err) { return false; }
  return true;
}

function setUserVersion(id, version) {
  try { db.prepare("UPDATE users SET version=? WHERE id=?").run(version, id); }
  catch (err) { return false; }
  return true;
}

function getUserByName(name) {
  return db.prepare("SELECT * FROM users WHERE name=?").get(name);
}

function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id=?").get(id);
}

module.exports = {
  initUserTable,
  setUserVersion,
  getUserByName,
  getUserById,
  createUser
};
