const next = require("next");
const io = require("socket.io");
const express = require("express");
const { createServer } = require("http");
const session = require("express-session");
const store = require("memorystore")(session);
const { initUserTable } = require("./utils/database");
const { authRoutes } = require("./routes/auth");
const config = require("../config.json");

const devArg = process.argv.find(arg => arg.includes("--dev"));
const isDev = devArg ? devArg.split("=").pop() === "true" : false;

const nextApp = next({ dev: isDev });
const handle = nextApp.getRequestHandler();

const sessionMiddleware = session({ 
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
});

nextApp.prepare().then(() => {
  initUserTable();
  
  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(sessionMiddleware);
  
  expressApp.use("/", authRoutes);
  expressApp.post("/user", (req, res) => {
    if(!req.session.name) return res.sendStatus(403);
    return res.send(req.session.name);
  });
  expressApp.all("*", (req, res) => handle(req, res));
  
  const server = createServer(expressApp);
  const socketApp = io(server);
  socketApp.use((socket, next) => sessionMiddleware(socket.request, {}, next));

  socketApp.on("connection", (socket) => {
    console.log(`Socket (${socket.request.session.id}) connected!`);
    socket.on("disconnect", () => console.log(`Socket (${socket.request.session.id}) disconnected!`));
    if (!socket.request.session.name) {
      console.log(`Socket (${socket.request.session.id}) not authenticated!`);
      socket.disconnect();
    }
  });

  server.listen(config.serverPort, () => 
    console.log(`Server started on ${config.serverAddress}:${config.serverPort}`));
});
