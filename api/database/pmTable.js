const { db } = require("./database");

function initPmTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS pm (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT REFERENCES user (name) ON DELETE CASCADE,
    friend INTEGER REFERENCES friend (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    time DATE NOT NULL
  )`).run();
}

function createMessage(name, nameFriend, content) {
  try { return db.prepare(`INSERT INTO pm (author, friend, content, time) VALUES 
    (?, (SELECT id FROM friend WHERE (sender=? AND receiver=?) OR (sender=? AND receiver=?)), ?, ?)`).run(name, name, nameFriend, nameFriend, name, content, Date.now()).changes; }
  catch (err) { return -1; }
}

function getMessages(name, nameFriend) {
  return db.prepare(`SELECT pm.id, author as name, content, pm.time FROM pm, friend WHERE pm.friend=friend.id
    AND ((friend.sender=? AND friend.receiver=?) OR (friend.sender=? AND friend.receiver=?))  ORDER BY pm.time DESC`).all(name, nameFriend, nameFriend, name);
}

module.exports = {
  initPmTable,
  createMessage,
  getMessages
};
