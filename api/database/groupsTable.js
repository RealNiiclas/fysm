const { db } = require("./database");

function initGroupsTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS groups (
    name TEXT PRIMARY KEY
  )`).run();
}

function createGroup(name) {
  try { return db.prepare("INSERT INTO groups (name) VALUES (?) RETURNING name").get(name); }
  catch (err) { return null; }
}

function deleteGroup(name) {
  try { return db.prepare("DELETE FROM groups WHERE name=?").run(name).changes; }
  catch (err) { return -1; }
}

module.exports = {
  initGroupsTable,
  deleteGroup,
  createGroup
};
