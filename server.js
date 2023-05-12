/*******************************************************
 * Import and define variables and constants
 ********************************************************/
import http from "http";
import express from "express";
import { Server } from "socket.io";
import routes from "./routes/routes.js";
import session from "express-session";
import flash from "express-flash";
import bodyParser from "body-parser";
import passport from "./config/passport.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 4242;

const history = {};
const historySize = 50;

/*******************************************************
 * Middleware
 ********************************************************/
// Set static folder
app.use(express.static("./public"));
app.use(flash());
// Session
const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

/*******************************************************
 * Set template engine
 ********************************************************/
app.set("view engine", "ejs");
app.set("views", "views");

/*******************************************************
 * Routes
 *******************************************************/
app.use("/", routes(passport, io));

/*******************************************************
 * Socket.io
 *******************************************************/
// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log(`new connection ${socket.id}`);
  let v;

  async function emitConnections(data) {
    v = data.map((ios) => {
      return {
        id: ios.id,
        user: ios.request.user,
        room: new URL(ios.handshake.headers.referer).searchParams.get("room"),
      };
    });
    io.emit("activeUsers", v);
  }

  io.fetchSockets().then((data) => {
    emitConnections(data);
  });

  socket.on("whoami", (cb) => {
    cb(socket.request.user ? socket.request.user : "");

    socket.emit(
      "history",
      history[
        new URL(socket.handshake.headers.referer).searchParams.get("room")
      ]
    );
  });

  socket.on("message", (message) => {
    while (history[message.room]?.length > historySize) {
      history.shift();
    }
    history[message.room] = !history[message.room] ? [] : history[message.room];
    history[message.room].push(message);

    io.emit("message", message);
  });

  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();
});

/*******************************************************
 * Start server!
 *******************************************************/
server.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});
