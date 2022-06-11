const { db } = require("./database");

function initGmTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS gm (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member INTEGER REFERENCES member (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    time DATE NOT NULL
  )`).run();
}

function createGroupMessage(name, grouping, content) {
  try { return db.prepare(`INSERT INTO gm (member, content, time) VALUES 
    ((SELECT id FROM member WHERE user=? AND grouping=?), ?, ?)`).run(name, grouping, content, Date.now()).changes; }
  catch (err) { return -1; }
}

function getGroupMessages(name, grouping) {
  return db.prepare(`SELECT DISTINCT gm.id, user.name, content, gm.time FROM gm, member, user, grouping WHERE member.user=user.name 
    AND grouping.id=member.grouping AND gm.member=member.id AND member.grouping=? AND member.grouping=(SELECT grouping FROM member WHERE user=? AND grouping=?) 
    ORDER BY gm.time DESC`).all(grouping, name, grouping);
}

module.exports = {
  initGmTable,
  createGroupMessage,
  getGroupMessages
};
