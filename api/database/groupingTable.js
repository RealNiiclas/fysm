const { db } = require("./database");

function initGroupingTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS grouping (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    time DATE NOT NULL
  )`).run();
}

function createGroup(name) {
  try { return db.prepare("INSERT INTO grouping (name, time) VALUES (?, ?) RETURNING id").get(name, Date.now()); }
  catch (err) { return null; }
}

function deleteGroup(grouping) {
  try { return db.prepare("DELETE FROM grouping WHERE id=?").run(grouping).changes; }
  catch (err) { return -1; }
}

function getGroups(name) {
  return db.prepare("SELECT grouping.id, name, accepted, admin, grouping.time FROM member, grouping WHERE member.user=? AND grouping.id=member.grouping").all(name);
}

module.exports = {
  initGroupingTable,
  deleteGroup,
  createGroup,
  getGroups
};
