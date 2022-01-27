const next = require("next");
const express = require("express");
const cookieParser = require("cookie-parser");
const { initUserTable } = require("./utils/database");
const { authRoutes } = require("./routes/auth");
const config = require("../config.json");

const devArg = process.argv.find(arg => arg.includes("--dev"));
const isDev = devArg ? devArg.split("=").pop() === "true" : false;

const app = next({ dev: isDev });
const handle = app.getRequestHandler();

const url = config.default.url;
const port = config.default.port;

app.prepare().then(() => {
  initUserTable();

  const server = express();
  server.use(express.json());
  server.use(cookieParser());

  server.use("/", authRoutes);
  server.all("*", (req, res) => handle(req, res));

  server.listen(port, () => console.log(`Server started on ${url}:${port}`));
});
