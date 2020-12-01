require('dotenv').config();
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;
// jwt
const passportJWT = require('passport-jwt');

const JWTStrategy = passportJWT.Strategy;

// Load User Model
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match User
      User.findOne({ email })
        .then((user) => {
          // Check if email already exists
          if (!user) {
            return done(null, false, { message: 'Invalid E-mail address' });
          }

          // Match password
          bcrypt.compare(password, user.passwordHash, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              // If user account has not been verified
              if (!user.active) {
                return done(null, false, { message: 'Please verify your account by e-mail first.' });
              }
              // Account verified
              return done(null, user);
            }
            // Incorrect password
            return done(null, false, { message: 'Password incorrect' });
          });
        })
        .catch(err => done(err));
    }),
  );

  passport.use(
    new JWTStrategy({
      jwtFromRequest: req => req.cookies.jwt,
      secretOrKey: process.env.SECRET,
    },
    (jwtPayload, done) => {
      User.findOne({ email: jwtPayload.email }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    }),
  );
};
