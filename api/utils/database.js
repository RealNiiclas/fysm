const fs = require("fs");
const config = require("../../config.json");
const database = require("better-sqlite3");

const outputPath = `${__dirname}/../../${config.database.outputPath}`;
const outputDirectory = outputPath.substring(0, outputPath.lastIndexOf("/"));
fs.mkdirSync(outputDirectory, { recursive: true });

const db = new database(outputPath);

function initUserTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`).run();
}

function createUser(name, password) {
  try { db.prepare("INSERT INTO users (name, password) VALUES (?, ?)").run(name, password); } 
  catch (err) { return false; }
  return true;
}

function getUserByName(name) {
  return db.prepare("SELECT * FROM users WHERE name=?").get(name);
}

module.exports = {
  initUserTable,
  getUserByName,
  createUser
};
