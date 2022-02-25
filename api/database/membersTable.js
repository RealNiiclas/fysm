const { db } = require("./database");

function initMembersTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    groupname TEXT REFERENCES groups (name),
    username TEXT REFERENCES users (name),
    virtualMin GENERATED AS (MIN(groupname, username)),
    virtualMax GENERATED AS (MAX(groupname, username)),
    accepted BOOLEAN NOT NULL,
    admin BOOLEAN NOT NULL,
    time DATE NOT NULL,
    UNIQUE (virtualMin, virtualMax)
  )`).run();
}

function addMember(groupname, username, accepted, admin) {
  try { return db.prepare("INSERT INTO members (groupname, username, accepted, admin, time) VALUES (?, ?, ?, ?, ?)").run(groupname, username, accepted, admin, Date.now()).changes; }
  catch (err) { return -1; }
}

function acceptInvite(groupname, username) {
  try { return db.prepare("UPDATE members SET accepted=1 WHERE groupname=? AND username=? AND accepted=0").run(groupname, username).changes; }
  catch (err) { return -1; }
}

function makeAdmin(groupname, username) {
  try { return db.prepare("UPDATE members SET admin=1 WHERE groupname=? AND username=? AND admin=0").run(groupname, username).changes; }
  catch (err) { return -1; }
}

function removeMember(groupname, username) {
  try { return db.prepare("DELETE FROM members WHERE groupname=? AND username=?").run(groupname, username).changes; }
  catch (err) { return -1; }
}

function getGroups(username) {
  return db.prepare("SELECT id, groupname, accepted, admin FROM members WHERE username=?").all(username);
}

function getMembers(groupname) {
  return db.prepare("SELECT username, accepted, admin FROM members WHERE groupname=? ORDER BY time DESC").all(groupname);
}

function deleteMembers(groupname) {
  try { return db.prepare("DELETE FROM members WHERE groupname=?").run(groupname).changes; }
  catch (err) { return -1; }
}

module.exports = {
  initMembersTable,
  addMember,
  makeAdmin,
  acceptInvite,
  removeMember,
  deleteMembers,
  getMembers,
  getGroups
};
