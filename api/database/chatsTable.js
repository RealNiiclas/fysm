const { db } = require("./database");

function initChatsTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT REFERENCES users (name),
    groupname TEXT REFERENCES groups (name),
    content TEXT NOT NULL,
    time DATE NOT NULL
  )`).run();
}

function createChatMessage(username, groupname, content) {
  try { return db.prepare("INSERT INTO chats (username, groupname, content, time) VALUES (?, ?, ?, ?)").run(username, groupname, content, Date.now()).changes; }
  catch (err) { return -1; }
}

function deleteChatMessages(username) {
  try { return db.prepare("DELETE FROM chats WHERE username=?").run(username).changes; }
  catch (err) { return -1; }
}

function getChatMessages(username, groupname) {
  return db.prepare("SELECT * FROM chats WHERE username=? AND groupname=? ORDER BY time DESC").all(username, groupname);
}

module.exports = {
  initChatsTable,
  createChatMessage,
  deleteChatMessages,
  getChatMessages
};
