require('dotenv').config();

let { MONGODB_URI } = process.env;
console.log('process', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}

const {
  PORT, SECRET, SENDGRID_USER, SENDGRID_PASS, APP_URL, LOCAL_URL,
} = process.env;


module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  SENDGRID_USER,
  SENDGRID_PASS,
  APP_URL,
  LOCAL_URL,
};
