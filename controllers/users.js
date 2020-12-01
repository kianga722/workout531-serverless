const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const usersRouter = require('express').Router();
const passport = require('passport');
const User = require('../models/User');

// const mailer = require('../utils/mailer');
const config = require('../utils/config');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASS,
  },
});

const appHost = process.env.NODE_ENV === 'production' ? config.APP_URL : config.LOCAL_URL;

// Signup
usersRouter.post('/', async (req, res, next) => {
  try {
    const { email, password, password2 } = req.body;
    const errors = [];

    // Check required fields
    if (!email || !password || !password2) {
      errors.push('Please fill in all fields');
    }

    // Check passwords match
    if (password !== password2) {
      errors.push('Passwords do not match');
    }

    // Check pass length
    if (!password || password.length < 6) {
      errors.push('Password should be at least 6 characters');
    }

    if (errors.length > 0) {
      res.status(400).send({ err: errors });
    } else {
      // Validation passed
      const user = await User.findOne({ email });
      if (user) {
        // User exists
        errors.push('Email is already registered');
        res.status(400).send({ err: errors });
      } else {
        // Hash Password
        const saltRounds = 10;

        // Set password to hashed
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Set activation token and expiration
        const minutesExpire = 1;
        const tokenEmail = randomstring.generate();
        const tokenEmailExpires = Date.now() + minutesExpire * 60000;

        // Flag the account as inactive
        const newUser = new User({
          email,
          passwordHash,
          tokenEmail,
          tokenEmailExpires,
          active: false,
        });

        await newUser.save();

        // Compose an e-mail
        const html = `
          Hi there,
          <br/>
          Thank you for registering!
          <br/><br/>
          Please verify your email by clicking the following link:
          <br/>
          <a href="${appHost}/verify/${tokenEmail}">${appHost}/verify/${tokenEmail}</a>
          <br/><br/>
          Have a pleasant day!`;

        const mailOptions = {
          from: 'admin@531.workout',
          to: newUser.email,
          subject: 'Please verify your email!',
          html,
        };

        // Send the email
        if (process.env.NODE_ENV !== 'test') {
          await transport.sendMail(mailOptions);
        }

        res.status(200).send({ info: ['An activation e-mail has been sent to you. You must activate before you can log in'] });
      }
    }
  } catch (exception) {
    next(exception);
  }
});

// Verify E-mail
usersRouter.get('/verify/:token', async (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    async (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        const tokenEmail = req.params.token;
        if (tokenEmail === '' || tokenEmail === undefined) {
          return res.status(400).send({ err: ['Activation link is invalid or has expired'] });
        }

        // Find the account that matches the secret token
        const userFound = await User.findOne({
          tokenEmail,
          tokenEmailExpires: { $gt: Date.now() },
        });
        if (!userFound) {
          return res.status(400).send({ err: ['Activation link is invalid or has expired'] });
        }
        userFound.active = true;
        userFound.tokenEmail = undefined;
        userFound.tokenEmailExpires = undefined;
        const userSave = await userFound.save();

        req.login(userSave, { session: false }, (err) => {
          if (err) {
            res.send({ err: [err] });
          }

          const payload = {
            email: userSave.email,
            id: userSave._id,
          };

          // generate a signed json web token with the contents of user object and return it in the response
          const token = jwt.sign(JSON.stringify(payload), config.SECRET);

          res.cookie('jwt', token, { httpOnly: true, maxAge: 604800000 });

          return res.status(200).send(payload);
        });
      } else {
        res.status(400).send({ err: ['Activation link is invalid or has expired'] });
      }
    })(req, res, next);
});

// Resend email activation
usersRouter.post('/resend', async (req, res, next) => {
  try {
    const { email } = req.body;

    const userFound = await User.findOne({ email });
    // If no user found
    if (!userFound) {
      return res.status(400).send({ err: ['Email is invalid'] });
    }
    // If user already active
    if (userFound.active) {
      return res.status(400).send({ err: ['User is already active!'] });
    }

    // Set activation token and expiration
    const minutesExpire = 1;
    const tokenEmail = randomstring.generate();
    const tokenEmailExpires = Date.now() + minutesExpire * 60000;
    userFound.tokenEmail = tokenEmail;
    userFound.tokenEmailExpires = tokenEmailExpires;

    // Save user with new token
    await userFound.save();

    // Compose an e-mail
    const html = `
      Hi there,
      <br/>
      We are resending your activation email.
      <br/><br/>
      Please verify your email by clicking the following link:
      <br/>
      <a href="${appHost}/verify/${tokenEmail}">${appHost}/verify/${tokenEmail}</a>
      <br/><br/>
      Have a pleasant day!`;

    const mailOptions = {
      from: 'admin@531.workout',
      to: userFound.email,
      subject: 'Activation email resend request',
      html,
    };

    // Send the email with new token
    if (process.env.NODE_ENV !== 'test') {
      await transport.sendMail(mailOptions);
    }

    res.status(200).send({ info: [`Another activation e-mail has been sent to ${userFound.email}`] });
  } catch (exception) {
    next(exception);
  }
});

// Request to recover password
usersRouter.post('/forgot', async (req, res, next) => {
  try {
    const { email } = req.body;

    const userFound = await User.findOne({ email });
    // If no user found
    if (!userFound) {
      return res.status(400).send({ err: ['Email is invalid'] });
    }

    // Set new secret token
    const minutesExpire = 5;
    const tokenForgot = randomstring.generate();
    const tokenForgotExpires = Date.now() + minutesExpire * 60000;
    userFound.tokenForgot = tokenForgot;
    userFound.tokenForgotExpires = tokenForgotExpires;

    // Save user with new token
    await userFound.save();

    // Compose an e-mail
    const html = `
      Hi there,
      <br/>
      You are receiving this because you (or someone else) has requested the reset of the password for your account.
      <br/><br/>
      Please click the following link to complete the process
      <br/>
      <a href="${appHost}/reset/${tokenForgot}">${appHost}/reset/${tokenForgot}</a>
      <br/><br/>
      If you id not request this, please ignore this email and your password will remain unchanged.`;

    const mailOptions = {
      from: 'admin@531.workout',
      to: userFound.email,
      subject: 'Password Reset Request',
      html,
    };

    // Send the email with new token
    if (process.env.NODE_ENV !== 'test') {
      await transport.sendMail(mailOptions);
    }

    res.status(200).send({ info: [`A password reset e-mail has been sent to ${userFound.email}`] });
  } catch (exception) {
    next(exception);
  }
});

// Getting reset password page
usersRouter.get('/reset/:token', async (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    async (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        const tokenForgot = req.params.token;
        if (tokenForgot === '' || tokenForgot === undefined) {
          return res.status(400).send({ err: ['Reset link is invalid or has expired'] });
        }

        // Find the account that matches the reset token
        const userFound = await User.findOne({
          tokenForgot,
          tokenForgotExpires: { $gt: Date.now() },
        });
        if (!userFound) {
          return res.status(400).send({ err: ['Reset link is invalid or has expired'] });
        }

        return res.status(200).send(userFound.email);
      }
      res.status(400).send({ err: ['Reset link is invalid or has expired'] });
    })(req, res, next);
});

// Actually resetting and updating password
usersRouter.post('/reset/:token', async (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    async (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        const tokenForgot = req.params.token;
        if (tokenForgot === '' || tokenForgot === undefined) {
          return res.status(400).send({ err: ['Reset link is invalid or has expired'] });
        }

        try {
          // Find the account that matches the reset token
          const userFound = await User.findOne({
            tokenForgot,
            tokenForgotExpires: { $gt: Date.now() },
          });
          if (!userFound) {
            return res.status(400).send({ err: ['Reset link is invalid or has expired'] });
          }

          const {
            email,
            password,
            password2,
          } = req.body;
          const errors = [];

          // Check required fields
          if (!password || !password2) {
            errors.push('Please fill in all fields');
          }

          // Check passwords match
          if (password !== password2) {
            errors.push('Passwords do not match');
          }

          // Check pass length
          if (password.length < 6) {
            errors.push('Password should be at least 6 characters');
          }

          if (errors.length > 0) {
            res.status(400).send({ err: errors });
          } else {
            // Hash Password
            const saltRounds = 10;

            // Set password to hashed
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // Remove reset token
            userFound.tokenForgot = undefined;
            userFound.tokenForgotExpires = undefined;
            // Set password to hashed
            userFound.passwordHash = passwordHash;

            await userFound.save();

            // Compose an email
            const html = `Hi there,
              <br/>
              This is a confirmation that the password for your account ${userFound.email} has just been changed.
              <br/><br/>
              Have a pleasant day!`;

            const mailOptions = {
              from: 'admin@531.workout',
              to: userFound.email,
              subject: 'Your password has been changed',
              html,
            };
        
            // Send the email
            if (process.env.NODE_ENV !== 'test') {
              await transport.sendMail(mailOptions);
            }

            res.status(200).send({ info: ['Success! Your password has been changed'] });
          }
        } catch (exception) {
          next(exception);
        }
      }
    })(req, res, next);
});


module.exports = usersRouter;
