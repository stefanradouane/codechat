// const { Router } = require("express");
// const app = Router();

// app

// app

// app

// module.exports = app;

import { Router } from "express";

export default function routes(passport, io) {
  const router = Router();

  router.get("/", (req, res) => {
    const isAuthenticated = !!req.user;
    console.log(req.user);
    if (isAuthenticated) {
      console.log(`user is authenticated, session is ${req.session.id}`);
    } else {
      res.cookie("connect.sid", "", { expires: new Date() });
      console.log("unknown user");
    }
    isAuthenticated ? res.render("pages/index") : res.render("pages/login");
  });

  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
    })
  );

  router.post("/logout", (req, res) => {
    console.log(`logout ${req.session.id}`);
    const socketId = req.session.socketId;
    if (socketId && io.of("/").sockets.get(socketId)) {
      console.log(`forcefully closing socket ${socketId}`);
      io.of("/").sockets.get(socketId).disconnect(true);
    }

    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.cookie("connect.sid", "", { expires: new Date() });
      res.redirect("/");
    });
  });

  return router;
}
