const serverless = require('serverless-http');

const express = require('express');
const bodyParser = require('body-parser');
// Express
const app = express();

// Mongoose
const mongoose = require('mongoose');

// Mongo Config
const config = require('../../utils/config');

// Controllers
const testingRouter = require('../../controllers/testing');

// Connect to Mongo
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Body Parser
app.use(bodyParser.json());

// Routing
app.use('/.netlify/functions/testing', testingRouter);

module.exports.handler = serverless(app);