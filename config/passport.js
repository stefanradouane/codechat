import database from "../model/database.json" assert { type: "json" };
import localStrategy from "passport-local";
import passport from "passport";

// const database = require("../model/database.json");
// const passport = require("passport");
// const localStrategy = require("passport-local");

const LocalStrategy = new localStrategy((username, password, done) => {
  const user = database.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    console.log("authentication OK");
    return done(null, user);
  } else {
    console.log("wrong credentials");
    return done(null, false);
  }
});

passport.serializeUser((user, cb) => {
  console.log(`serializeUser ${user.id}`);
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  console.log(`deserializeUser ${id}`);
  cb(
    null,
    database.find((user) => user.id === id)
  );
});

passport.use(LocalStrategy);

// module.exports = passport;
export default passport;
