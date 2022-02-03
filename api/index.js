const expressApp = require("express")();
const server = require("http").createServer(expressApp);
const socketApp = require("socket.io")(server);

const next = require("next");
const express = require("express");
const session = require("express-session");
const store = require("memorystore")(session);
const { initUserTable } = require("./utils/database");
const { handleSocket, disconnectSocket } = require("./utils/socket");
const { authRoutes } = require("./routes/auth");
const { userRoutes } = require("./routes/user");
const config = require("../config.json");

const nextApp = next({ dev: config.debug });
const handle = nextApp.getRequestHandler();

const sessionMiddleware = session({ 
  resave: false,
  name: config.sessionCookieName,
  secret: config.sessionSecret,
  saveUninitialized: false,
  store: new store({ 
    checkPeriod: 1000 * 60 * 60,
    dispose: (id) => disconnectSocket(socketApp, id)
  }),
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24
  }
});

nextApp.prepare().then(() => {
  initUserTable();
  
  expressApp.use(express.json());
  expressApp.use(sessionMiddleware);
  expressApp.use("/", authRoutes);
  expressApp.use("/", userRoutes);
  expressApp.all("*", (req, res) => handle(req, res));

  socketApp.use((socket, next) => sessionMiddleware(socket.request, {}, next));
  socketApp.on("connection", (socket) => handleSocket(socketApp, socket));

  server.listen(config.serverPort, () => 
    console.log(`Server started on ${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`));
});
