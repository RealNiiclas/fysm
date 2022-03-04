const { db } = require("./database");

function initMemberTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS member (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grouping INTEGER REFERENCES grouping (id) ON DELETE CASCADE,
    user TEXT REFERENCES user (name) ON DELETE CASCADE,
    accepted BOOLEAN NOT NULL,
    admin BOOLEAN NOT NULL,
    time DATE NOT NULL,
    virtualMin GENERATED AS (MIN(grouping, user)),
    virtualMax GENERATED AS (MAX(grouping, user)),
    UNIQUE (virtualMin, virtualMax)
  )`).run();
}

function addMember(name, grouping, accepted, admin) {
  try { return db.prepare("INSERT INTO member (grouping, user, accepted, admin, time) VALUES (?, ?, ?, ?, ?)").run(grouping, name, accepted, admin, Date.now()).changes; }
  catch (err) { return -1; }
}

function acceptInvite(name, grouping) {
  try { return db.prepare("UPDATE member SET accepted=1 WHERE grouping=? AND user=? AND accepted=0").run(grouping, name).changes; }
  catch (err) { return -1; }
}

function makeAdmin(name, grouping) {
  try { return db.prepare("UPDATE member SET admin=1 WHERE grouping=? AND user=? AND admin=0").run(grouping, name).changes; }
  catch (err) { return -1; }
}

function removeMember(name, grouping) {
  try { return db.prepare("DELETE FROM member WHERE grouping=? AND user=?").run(grouping, name).changes; }
  catch (err) { return -1; }
}

function getMember(name, grouping) {
  return db.prepare("SELECT id FROM member WHERE user=? AND grouping=?").all(name, grouping);
}

function getMembers(grouping) {
  return db.prepare("SELECT user, accepted, admin, time FROM member WHERE grouping=? ORDER BY time DESC").all(grouping);
}

function deleteMembers(grouping) {
  try { return db.prepare("DELETE FROM member WHERE grouping=?").run(grouping).changes; }
  catch (err) { return -1; }
}

module.exports = {
  initMemberTable,
  addMember,
  makeAdmin,
  acceptInvite,
  removeMember,
  deleteMembers,
  getMembers,
  getMember
};
