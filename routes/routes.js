import { Router } from "express";

export default function routes(passport, io) {
  const router = Router();

  router.get("/", (req, res) => {
    if (!!req.user) {
      res.render("pages/index", { room: req.query.room });
    } else {
      // Forcefully remove cookie
      res.cookie("connect.sid", "", { expires: new Date() });
      res.render("pages/login");
    }
  });

  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
    })
  );

  router.post("/logout", (req, res) => {
    const socketId = req.session.socketId;
    if (socketId && io.of("/").sockets.get(socketId)) {
      io.of("/").sockets.get(socketId).disconnect(true);
    }

    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      // Forcefully remove cookie
      res.cookie("connect.sid", "", { expires: new Date() });
      res.redirect("/");
    });
  });

  return router;
}
