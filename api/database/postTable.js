const { db } = require("./database");

function initPostTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT REFERENCES user (name) ON DELETE CASCADE,
    content TEXT NOT NULL,
    time DATE NOT NULL
  )`).run();
}

function createPost(author, content) {
  try { return db.prepare("INSERT INTO post (author, content, time) VALUES (?, ?, ?)").run(author, content, Date.now()).changes; }
  catch (err) { return -1; }
}

function getPosts(name) {
  return db.prepare(`SELECT post.id, name, content, post.time FROM 
    (post LEFT JOIN friend ON (author=receiver OR author=sender)) LEFT JOIN user ON author=name WHERE
    author=? OR ((sender=? OR receiver=?) AND accepted=1) ORDER BY post.time DESC`).all(name, name, name);
}

module.exports = {
  initPostTable,
  createPost,
  getPosts
};
