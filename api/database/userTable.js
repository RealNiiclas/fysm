const { db } = require("./database");

function initUserTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS user (
    name TEXT PRIMARY KEY,
    password TEXT NOT NULL
  )`).run();
}

function createUser(name, password) {
  try { return db.prepare("INSERT INTO user (name, password) VALUES (?, ?)").run(name, password).changes; }
  catch (err) { return -1; }
}

function deleteUser(name) {
  try { return db.prepare("DELETE FROM user WHERE name=?").run(name).changes; }
  catch (err) { return -1; }
}

function getUser(name) {
  return db.prepare("SELECT * FROM user WHERE name=?").get(name);
}

module.exports = {
  initUserTable,
  createUser,
  deleteUser,
  getUser
};
