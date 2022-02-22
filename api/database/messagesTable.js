const { db } = require("./database");

function initMessagesTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT REFERENCES users (name),
    receiver TEXT REFERENCES users (name),
    content TEXT NOT NULL,
    time DATE NOT NULL
  )`).run();
}

function createMessage(sender, receiver, content) {
  try { return db.prepare("INSERT INTO messages (sender, receiver, content, time) VALUES (?, ?, ?, ?)").run(sender, receiver, content, Date.now()).changes; }
  catch (err) { return -1; }
}

function deleteMessage(id) {
  try { return db.prepare("DELETE FROM messages WHERE id=?").run(id).changes; }
  catch (err) { return -1; }
}

function deleteMessagesBetween(sender, receiver) {
  try { return db.prepare("DELETE FROM messages WHERE sender=? AND receiver=?").run(sender, receiver).changes; }
  catch (err) { return -1; }
}

function deleteMessages(sender) {
  try { return db.prepare("DELETE FROM messages WHERE sender=? OR receiver=?").run(sender, sender).changes; }
  catch (err) { return -1; }
}

function getMessages(sender, receiver) {
  return db.prepare("SELECT * FROM messages WHERE sender=? AND receiver=? ORDER BY time DESC").all(sender, receiver);
}

module.exports = {
  initMessagesTable,
  createMessage,
  deleteMessage,
  deleteMessagesBetween,
  deleteMessages,
  getMessages
};
