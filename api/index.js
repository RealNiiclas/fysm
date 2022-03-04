const expressApp = require("express")();
const server = require("http").createServer(expressApp);
const socketApp = require("socket.io")(server);

const next = require("next");
const express = require("express");
const config = require("../config.json");
const session = require("express-session");
const store = require("memorystore")(session);
const { handleSocket, disconnectSocket } = require("./other/socket");
const { authRoutes } = require("./routes/authRoutes");
const { userRoutes } = require("./routes/userRoutes");
const { postRoutes } = require("./routes/postRoutes");
const { friendRoutes } = require("./routes/friendRoutes");
const { groupRoutes } = require("./routes/groupRoutes");
const { memberRoutes } = require("./routes/memberRoutes");
const { initUserTable } = require("./database/userTable");
const { initFriendTable } = require("./database/friendTable");
const { initGroupingTable } = require("./database/groupingTable");
const { initMemberTable } = require("./database/memberTable");
const { initPostTable } = require("./database/postTable");
const { initGmTable } = require("./database/gmTable");
const { initPmTable } = require("./database/pmTable");

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
  initUserTable();
  initPostTable();
  initFriendTable();
  initPmTable();
  initGroupingTable();
  initMemberTable();
  initGmTable();

  expressApp.use(express.json());
  expressApp.use(sessionMiddleware);
  expressApp.use("/", authRoutes);
  expressApp.use("/", userRoutes);
  expressApp.use("/", postRoutes);
  expressApp.use("/", friendRoutes);
  expressApp.use("/", groupRoutes);
  expressApp.use("/", memberRoutes);
  expressApp.all("*", (req, res) => handle(req, res));

  socketApp.use((socket, next) => sessionMiddleware(socket.request, {}, next));
  socketApp.on("connection", (socket) => handleSocket(socketApp, socket));

  server.listen(config.serverPort, () =>
    console.log(`Server started on ${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`));
});
