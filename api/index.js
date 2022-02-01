const expressApp = require("express")();
const server = require("http").createServer(expressApp);
const socketApp = require("socket.io")(server);

const next = require("next");
const express = require("express");
const session = require("express-session");
const store = require("memorystore")(session);
const { initUserTable } = require("./utils/database");
const { authRoutes } = require("./routes/auth");
const config = require("../config.json");
const { userRoutes } = require("./routes/user");

const nextApp = next({ dev: config.debug });
const handle = nextApp.getRequestHandler();

const sessionMiddleware = session({ 
  store: new store({ checkPeriod: 1000 * 60 * 60, dispose: (key) => {
    socketApp.sockets.sockets.forEach(socket => {
      if (socket.request.session.id !== key) return;
      socket.emit("unauthed");
      socket.disconnect();
    });
  }}),
  name: config.sessionCookieName,
  secret: config.sessionSecret,
  saveUninitialized: false,
  resave: false,
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
  socketApp.on("connection", (socket) => {
    socket.on("message", (message) => socketApp.sockets.emit("message", { message, from: socket.request.session.name }));
    if (!socket.request.session.name) {
      socket.emit("unauthed");
      socket.disconnect();
    }
  });

  server.listen(config.serverPort, () => 
    console.log(`Server started on ${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`));
});
