// const express = require("express");
// const app = express();
// const server = require("http").createServer(app);
// const port = process.env.PORT || 3000;

// const session = require("express-session");
// const bodyParser = require("body-parser");
// const passport = require("./config/passport");
// const routes = require("./routes/routes");

// /*
// https://socket.io/get-started/chat
// */
import { ifError } from "assert";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import path from "path";
import routes from "./routes/routes.js";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "./config/passport.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 4242;

/*******************************************************
 * Middleware
 ********************************************************/
// Set static folder
app.use(express.static("./public"));

// Session
const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
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
// const io = require("socket.io")(server);

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

io.on("connect", (socket) => {
  console.log(`new connection ${socket.id}`);
  socket.on("whoami", (cb) => {
    cb(socket.request.user ? socket.request.user.username : "");
  });

  const session = socket.request.session;
  console.log(`saving sid ${socket.id} in session ${session.id}`);
  session.socketId = socket.id;
  session.save();
});

/*******************************************************
 * Start server!
 *******************************************************/
server.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});
