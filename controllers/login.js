const jwt = require('jsonwebtoken');

const loginRouter = require('express').Router();
const passport = require('passport');

const config = require('../utils/config');

loginRouter.get('/', (req, res) => {
  return res.send('hi')
})

// Login a user
loginRouter.post('/', async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      const message = info ? info.message : 'Login failed';

      return res.status(400).send({ err: [message] });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send({ err: [err] });
      }

      const payload = {
        email: user.email,
        id: user._id,
      };

      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign(JSON.stringify(payload), config.SECRET);

      // assign our jwt to the cookie
      res.cookie('jwt', token, { httpOnly: true, maxAge: 604800000 });

      res.status(200).send(payload);
    });
  })(req, res, next);
});

// Check for already stored token
loginRouter.get('/jwtCheck', async (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    (err, user, info) => {
      if (err) { return next(err); }

      // Want to return falsy if no user found
      let payload = null;
      if (user) {
        req.login(user, { session: false }, (err) => {
          if (err) {
            res.send({ err: [err] });
          }

          payload = {
            email: user.email,
            id: user._id,
          };
        });
      }
      res.status(200).send(payload);
    })(req, res, next);
});


// Sign out a user
loginRouter.get('/logout', async (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    (err, user, info) => {
      if (err || !user) { return next(err); }

      req.logout();

      // clear the token when logging out
      res.clearCookie('jwt');

      res.status(200).send('Logout complete');
    })(req, res, next);
});


module.exports = loginRouter;
