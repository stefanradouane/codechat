import localStrategy from "passport-local";
import passport from "passport";
import fetch from "node-fetch";

const LocalStrategy = new localStrategy(
  {
    usernameField: "name",
    passwordField: "surname",
  },
  (name, surname, done) => {
    fetch(
      `https://stefan-the-api-middleman.netlify.app/.netlify/functions/getUser/?name=${name}&surname=${surname}`
    )
      .then((res) => res.json())
      .then((users) => {
        // Geen gebruiker gevonden
        if (users.data.length === 0) {
          // Return flash message
          return done(null, false, {
            message: "Fout wachtwoord",
          });
          // Return user
        } else done(null, users.data[0]);
      })
      // Error
      .catch((err) => {
        return done(null, false, {
          message: "Probeer het nogmaals",
        });
      });
  }
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

passport.use(LocalStrategy);

export default passport;
