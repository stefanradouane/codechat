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
    if (!!req.user) {
      res.render("pages/index", { room: req.query.room });
    } else {
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

// <div
//   class="cm-tooltip-autocomplete cm-tooltip cm-tooltip-below"
//   style="position: fixed; top: 787.891px; left: 125.641px;">
//   <ul
//     id="cm-ac-5wpd"
//     role="listbox"
//     aria-expanded="true"
//     aria-label="Completions">
//     <li id="cm-ac-5wpd-0" role="option" aria-selected="true">
//       <div
//         class="cm-completionIcon cm-completionIcon-keyword"
//         aria-hidden="true"></div>
//       <span class="cm-completionLabel">
//         <span class="cm-completionMatchedText">f</span>alse
//       </span>
//     </li>
//     <li id="cm-ac-5wpd-1" role="option">
//       <div
//         class="cm-completionIcon cm-completionIcon-keyword"
//         aria-hidden="true"></div>
//       <span class="cm-completionLabel">
//         <span class="cm-completionMatchedText">f</span>inally
//       </span>
//     </li>
//     <li id="cm-ac-5wpd-2" role="option">
//       <div
//         class="cm-completionIcon cm-completionIcon-keyword"
//         aria-hidden="true"></div>
//       <span class="cm-completionLabel">
//         <span class="cm-completionMatchedText">f</span>or
//       </span>
//       <span class="cm-completionDetail">loop</span>
//     </li>
//     <li id="cm-ac-5wpd-3" role="option">
//       <div
//         class="cm-completionIcon cm-completionIcon-keyword"
//         aria-hidden="true"></div>
//       <span class="cm-completionLabel">
//         <span class="cm-completionMatchedText">f</span>or
//       </span>
//       <span class="cm-completionDetail">of loop</span>
//     </li>
//     <li id="cm-ac-5wpd-4" role="option">
//       <div
//         class="cm-completionIcon cm-completionIcon-keyword"
//         aria-hidden="true"></div>
//       <span class="cm-completionLabel">
//         <span class="cm-completionMatchedText">f</span>unction
//       </span>
//       <span class="cm-completionDetail">definition</span>
//     </li>
//   </ul>
// </div>;
