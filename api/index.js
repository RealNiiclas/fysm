const next = require("next");
const express = require("express");
const session = require("express-session");
const store = require("memorystore")(session);
const { initUserTable } = require("./utils/database");
const { authRoutes } = require("./routes/auth");
const config = require("../config.json");

const devArg = process.argv.find(arg => arg.includes("--dev"));
const isDev = devArg ? devArg.split("=").pop() === "true" : false;

const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  initUserTable();

  const server = express();
  server.use(express.json());
  server.use(session({ 
    store: new store({ checkPeriod: 1000 * 60 * 60 }),
    name: config.sessionCookieName,
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24
    }
  }));

  server.use("/", authRoutes);
  server.all("*", (req, res) => handle(req, res));

  server.listen(config.serverPort, () => 
    console.log(`Server started on ${config.serverAddress}:${config.serverPort}`));
});
