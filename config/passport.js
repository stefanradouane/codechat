// import database from "../model/database.json" assert { type: "json" };
import localStrategy from "passport-local";
import passport from "passport";

import fetch from "node-fetch";

// const database = require("../model/database.json");
// const passport = require("passport");
// const localStrategy = require("passport-local");

const strategyOptions = {
  usernameField: "name",
  passwordField: "surname",
};

const LocalStrategy = new localStrategy(
  strategyOptions,
  (name, surname, done) => {
    fetch(
      `https://stefan-the-api-middleman.netlify.app/.netlify/functions/getUser/?name=${name}&surname=${surname}`
    )
      .then((res) => res.json())
      .then((users) => {
        if (users.data.length === 0) {
          return done(null, false, {
            message: "Fout wachtwoord",
          });
        } else done(null, users.data[0]);
      })
      .catch((err) => {
        return done(null, false, {
          message: "Probeer het nogmaals",
        });
      });
    // const user = database.find(
    //   (user) => user.username === username && user.password === password
    // );
    // if (user) {
    //   console.log("authentication OK");
    //   return done(null, user);
    // } else {
    //   console.log("wrong credentials");
    //   return done(null, false);
    // }
  }
);

passport.serializeUser((user, cb) => {
  // console.log(`serializeUser ${user.id}`);
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  // console.log(`deserializeUser ${user.id}`);
  cb(null, user);
});

passport.use(LocalStrategy);

// module.exports = passport;
export default passport;
