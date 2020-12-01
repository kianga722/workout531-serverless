const serverless = require('serverless-http');

const express = require('express');
const bodyParser = require('body-parser');
// Express
const app = express();
const cookieParser = require('cookie-parser');

// Passport
const passport = require('passport');

// Mongoose
const mongoose = require('mongoose');

// Mongo Config
const config = require('../../utils/config');

// Controllers
const usersRouter = require('../../controllers/users');

// Connect to Mongo
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB Connected...', config.MONGODB_URI))
  .catch(err => console.log(err));

// Passport config
require('../../utils/passport')(passport);

// Body Parser
app.use(bodyParser.json());
// Cookie Parser
app.use(cookieParser());
// Passport middleware
app.use(passport.initialize());

// Routing
app.use('/.netlify/functions/users', usersRouter);

module.exports.handler = serverless(app);