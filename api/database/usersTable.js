const { db } = require("./database");

function initUsersTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    name TEXT PRIMARY KEY,
    password TEXT NOT NULL
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

module.exports = {
  initUsersTable,
  getUserByName,
  createUser,
  deleteUser
};
