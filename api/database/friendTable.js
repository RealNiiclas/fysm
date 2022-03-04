const { db } = require("./database");

function initFriendTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS friend (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT REFERENCES user (name) ON DELETE CASCADE,
    receiver TEXT REFERENCES user (name) ON DELETE CASCADE,
    accepted BOOLEAN NOT NULL,
    time DATE NOT NULL,
    virtualMin GENERATED AS (MIN(sender, receiver)),
    virtualMax GENERATED AS (MAX(sender, receiver)),
    UNIQUE (virtualMin, virtualMax)
  )`).run();
}

function addFriend(name, nameFriend) {
  try { return db.prepare("INSERT INTO friend (sender, receiver, accepted, time) VALUES (?, ?, 0, ?)").run(name, nameFriend, Date.now()).changes; }
  catch (err) { return -1; }
}

function acceptFriend(name, nameFriend) {
  try { return db.prepare("UPDATE friend SET accepted=1, time=? WHERE receiver=? AND sender=? AND accepted=0").run(Date.now(), name, nameFriend).changes; }
  catch (err) { return -1; }
}

function removeFriend(name, nameFriend) {
  try { return db.prepare("DELETE FROM friend WHERE (sender=? AND receiver=?) OR (receiver=? AND sender=?)").run(name, nameFriend, name, nameFriend).changes; }
  catch (err) { return -1; }
}

function getFriends(name) {
  return db.prepare(`SELECT name, receiver, accepted, time FROM (SELECT CASE WHEN sender=? THEN receiver ELSE sender END friendId, name,
    CASE WHEN sender=? THEN 0 ELSE 1 END receiver, accepted, time FROM friend, user WHERE friendId=name)`).all(name, name);
}

module.exports = {
  initFriendTable,
  addFriend,
  acceptFriend,
  removeFriend,
  getFriends
};
