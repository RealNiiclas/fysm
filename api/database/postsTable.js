const { v4 } = require("uuid");
const { db } = require("./database");

function initPostsTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author TEXT REFERENCES users (name),
    content TEXT NOT NULL,
    time DATE NOT NULL
  )`).run();
}

function createPost(author, content) {
  try { return db.prepare("INSERT INTO posts (id, author, content, time) VALUES (?, ?, ?, ?)").run(v4(), author, content, Date.now()).changes > 0; }
  catch (err) { return false; }
}

function deletePosts(author) {
  if (db.prepare("SELECT * FROM posts WHERE author=?").all(author).length === 0) return true;
  try { return db.prepare("DELETE FROM posts WHERE author=?").run(author).changes > 0; }
  catch (err) { return false; }
}

function getPosts(name) {
  return db.prepare(`SELECT posts.id, author, content, time FROM posts LEFT JOIN friends 
    ON posts.author = friends.sender OR posts.author = friends.receiver
    WHERE posts.author = $name OR friends.sender = $name OR friends.receiver = $name
    ORDER BY time DESC`).all({ name });
}

module.exports = {
  initPostsTable,
  createPost,
  deletePosts,
  getPosts
};
