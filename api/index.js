const expressApp = require("express")();
const server = require("http").createServer(expressApp);
const socketApp = require("socket.io")(server);

const next = require("next");
const express = require("express");
const session = require("express-session");
const store = require("memorystore")(session);
const { handleSocket, disconnectSocket } = require("./other/socket");
const { authRoutes } = require("./routes/authRoutes");
const { userRoutes } = require("./routes/userRoutes");
const { postRoutes } = require("./routes/postRoutes");
const { friendRoutes } = require("./routes/friendRoutes");
const config = require("../config.json");
const { initUsersTable } = require("./database/usersTable");
const { initPostsTable } = require("./database/postsTable");
const { initFriendsTable } = require("./database/friendsTable");

const nextApp = next({ dev: config.debug });
const handle = nextApp.getRequestHandler();

const sessionMiddleware = session({
  resave: false,
  name: config.sessionCookieName,
  secret: config.sessionSecret,
  saveUninitialized: false,
  store: new store({
    noDisposeOnSet: true,
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
  initUsersTable();
  initPostsTable();
  initFriendsTable();

  expressApp.use(express.json());
  expressApp.use(sessionMiddleware);
  expressApp.use("/", authRoutes);
  expressApp.use("/", userRoutes);
  expressApp.use("/", postRoutes);
  expressApp.use("/", friendRoutes);
  expressApp.all("*", (req, res) => handle(req, res));

  socketApp.use((socket, next) => sessionMiddleware(socket.request, {}, next));
  socketApp.on("connection", (socket) => handleSocket(socketApp, socket));

  server.listen(config.serverPort, () =>
    console.log(`Server started on ${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`));
});
