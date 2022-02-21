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
  try { return db.prepare("INSERT INTO posts (id, author, content, time) VALUES (?, ?, ?, ?)").run(v4(), author, content, Date.now()).changes; }
  catch (err) { return -1; }
}

function deletePosts(author) {
  try { return db.prepare("DELETE FROM posts WHERE author=?").run(author).changes; }
  catch (err) { return -1; }
}

function getPosts(name) {
  return db.prepare(`SELECT posts.id, author, content, time FROM posts LEFT JOIN friends 
    ON posts.author=friends.sender OR posts.author=friends.receiver
    WHERE posts.author=$name OR ((friends.sender=$name OR friends.receiver=$name) AND friends.accepted=1)
    ORDER BY time DESC`).all({ name });
}

module.exports = {
  initPostsTable,
  createPost,
  deletePosts,
  getPosts
};
