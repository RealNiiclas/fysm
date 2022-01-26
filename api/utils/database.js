const fs = require("fs");
const { v4 } = require("uuid");
const { open } = require("sqlite");
const config = require("../../config.json");
const sqlite3 = require("sqlite3").verbose();

const outputPath = `${__dirname}/../../${config.database.outputPath}`;
const outputDirectory = outputPath.substring(0, outputPath.lastIndexOf("/"));
fs.mkdirSync(outputDirectory, { recursive: true });

const db = open({
  filename: outputPath,
  driver: sqlite3.Database
});

async function initUserTable() {
  await (await db).exec(`CREATE TABLE IF NOT EXISTS users (
    id TEXT UNIQUE NOT NULL,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    version TEXT NOT NULL
  );`);
}

async function createUser(name, password) {
  try { await (await db).run("INSERT INTO users (id, name, password, version) VALUES (?, ?, ?, ?);", [v4(), name, password, v4()]); }
  catch (err) { return false; }
  return true;
}

async function setUserVersion(id, version) {
  try { await (await db).run("UPDATE users SET version=? WHERE id=?", [version, id]); }
  catch (err) { return false; }
  return true;
}

async function getUserByName(name) {
  try { return await (await db).get("SELECT * FROM users WHERE name=?;", [name]); }
  catch (err) { return null; }
}

async function getUserById(id) {
  try { return await (await db).get("SELECT * FROM users WHERE id=?;", [id]); }
  catch (err) { return null; }
}

module.exports = {
  initUserTable,
  setUserVersion,
  getUserByName,
  getUserById,
  createUser
};
