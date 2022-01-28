const next = require("next");
const express = require("express");
const session = require("express-session");
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
    name: config.session.cookieName,
    secret: config.session.secret,
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

  server.listen(config.default.port, () => 
    console.log(`Server started on ${config.default.url}:${config.default.port}`));
});
