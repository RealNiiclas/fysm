const { db } = require("./database");

function initLoginTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT REFERENCES user (name) ON DELETE CASCADE,
    time DATE NOT NULL
  )`).run();
}

function addFailedLogin(name) {
  try { return db.prepare("INSERT INTO login (user, time) VALUES (?, ?)").run(name, Date.now()).changes; }
  catch (err) { return -1; }
}

function canLogin(name) {
  return db.prepare(`SELECT * FROM login WHERE user=? AND time>?`).all(name, Date.now() - 900000).length < 5;
}

function removeLogins(name) {
  try { return db.prepare("DELETE FROM login WHERE user=?").run(name).changes; }
  catch (err) { return -1; }
}

function removeOldLogins() {
  try { return db.prepare("DELETE FROM login WHERE time<=?").run(Date.now() - 900000).changes; }
  catch (err) { return -1; }
}

module.exports = {
  initLoginTable,
  addFailedLogin,
  removeOldLogins,
  removeLogins,
  canLogin
};
