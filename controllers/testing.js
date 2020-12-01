const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const testingRouter = require('express').Router();
const Workout = require('../models/Workout');
const User = require('../models/User');

testingRouter.post('/reset', async (req, res) => {
  await Workout.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

testingRouter.post('/createUser', async (req, res) => {
  const {
    email, password, approved, tokenEmail, tokenForgot,
  } = req.body;

  // Hash Password
  const saltRounds = 10;
  // Set password to hashed
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Set activation token and expiration
  const minutesExpire = 7;
  // const tokenEmail = randomstring.generate();
  const tokenEmailExpires = Date.now() + minutesExpire * 60000;

  const newUser = new User({
    email,
    passwordHash,
    tokenEmail,
    tokenEmailExpires,
    tokenForgot,
    tokenForgotExpires: tokenEmailExpires,
    active: approved,
  });

  await newUser.save();

  res.status(204).send(newUser);
});


module.exports = testingRouter;
