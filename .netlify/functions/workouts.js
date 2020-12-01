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
const workoutsRouter = require('../../controllers/workouts');

// Connect to Mongo
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB Connected...'))
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
app.use('/.netlify/functions/workouts', passport.authenticate('jwt', { session: false }), workoutsRouter);

module.exports.handler = serverless(app);