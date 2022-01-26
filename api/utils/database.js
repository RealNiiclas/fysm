const fs = require("fs");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const config = require("../../config.json");

const outputPath = `${__dirname}/../../${config.database.outputPath}`;
const outputDirectory = outputPath.substring(0, outputPath.lastIndexOf("/"));
fs.mkdirSync(outputDirectory, { recursive: true });

const db = open({
  filename: outputPath,
  driver: sqlite3.Database
});

async function initUserTable() {
  await (await db).exec(`CREATE TABLE IF NOT EXISTS user (
    id TEXT UNIQUE,
    name TEXT UNIQUE,
    password TEXT,
    version TEXT
  );`);
}

module.exports = {
  initUserTable
};
