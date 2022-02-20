const fs = require("fs");
const config = require("../../config.json");
const database = require("better-sqlite3");

const outputPath = `${__dirname}/../../${config.databaseOutputPath}`;
const outputDirectory = outputPath.substring(0, outputPath.lastIndexOf("/"));
fs.mkdirSync(outputDirectory, { recursive: true });

const db = new database(outputPath);

module.exports = {
  db
};
