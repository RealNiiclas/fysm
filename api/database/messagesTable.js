const { v4 } = require("uuid");
const { db } = require("./database");

function initMessagesTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender TEXT REFERENCES users (name),
    receiver TEXT REFERENCES users (name),
    content TEXT NOT NULL,
    time DATE NOT NULL
  )`).run();
}

function createMessage(sender, receiver, content) {
  try { return db.prepare("INSERT INTO messages (id, sender, receiver, content, time) VALUES (?, ?, ?, ?, ?)").run(v4(), sender, receiver, content, Date.now()).changes > 0; }
  catch (err) { return false; }
}

function deleteMessage(id) {
  if (db.prepare("SELECT * FROM messages WHERE id=?").all(id).length === 0) return true;
  try { return db.prepare("DELETE FROM messages WHERE id=?").run(id).changes > 0; }
  catch (err) { return false; }
}

function deleteMessages(sender, receiver) {
  if (db.prepare("SELECT * FROM messages WHERE sender=? AND receiver=?").all(sender, receiver).length === 0) return true;
  try { return db.prepare("DELETE FROM messages WHERE sender=? AND receiver=?").run(sender, receiver).changes > 0; }
  catch (err) { return false; }
}

function getMessages(sender, receiver) {
  return db.prepare("SELECT * FROM messages WHERE sender=? AND receiver=? ORDER BY time DESC").all(sender, receiver);
}


module.exports = {
  initMessagesTable,
  createMessage,
  deleteMessage,
  deleteMessages,
  getMessages
};