const { db } = require("./database");

function initFriendsTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS friends (
    id TEXT PRIMARY KEY,
    sender TEXT REFERENCES users (name),
    receiver TEXT REFERENCES users (name),
    accepted BOOLEAN NOT NULL
  )`).run();
}

function addFriend(sender, receiver) {
  const id = [sender, receiver].sort().toString().replaceAll(",", "");
  try { return db.prepare("INSERT INTO friends (id, sender, receiver, accepted) VALUES (?, ?, ?, 0)").run(id, sender, receiver).changes > 0; }
  catch (err) { return false; }
}

function acceptFriend(receiver, sender) {
  try { return db.prepare("UPDATE friends SET accepted=1 WHERE receiver=? AND sender=? AND accepted=0").run(receiver, sender).changes > 0; }
  catch (err) { return false; }
}

function deleteFriends(name) {
  if (db.prepare("SELECT * FROM friends WHERE (sender=? OR receiver=?)").all(name, name).length === 0) return true;
  try { return db.prepare("DELETE FROM friends WHERE (sender=? OR receiver=?)").run(name, name).changes > 0; }
  catch (err) { console.log(err); return false; }
}

function removeFriend(name, nameFriend) {
  try { return db.prepare("DELETE FROM friends WHERE (sender=? AND receiver=?) OR (receiver=? AND sender=?)").run(name, nameFriend, nameFriend, name).changes > 0; }
  catch (err) { console.log(err); return false; }
}

function getFriends(name) {
  const friends = db.prepare("SELECT id, sender, receiver, accepted FROM friends WHERE sender=? OR receiver=?").all(name, name);
  return friends.map((friend) => friend.sender === name ?
    { id: friend.id, name: friend.receiver, accepted: friend.accepted, receiver: false } :
    { id: friend.id, name: friend.sender, accepted: friend.accepted, receiver: true });
}

module.exports = {
  initFriendsTable,
  addFriend,
  acceptFriend,
  deleteFriends,
  removeFriend,
  getFriends
};
