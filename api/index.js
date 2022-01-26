const next = require("next");
const express = require("express");
const cookieParser = require("cookie-parser");
const { initUserTable } = require("./utils/database");

const devArg = process.argv.find(arg => arg.includes("--dev"));
const isDev = devArg ? devArg.split("=").pop() === "true" : false;

const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  await initUserTable();

  const server = express();
  server.use(express.json());
  server.use(cookieParser());

  server.all("*", (req, res) => handle(req, res));

  server.listen(3000, () => console.log("Server started on http://localhost:3000"));
});
