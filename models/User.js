const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  tokenEmail: {
    type: String,
  },
  tokenEmailExpires: {
    type: Date,
  },
  tokenForgot: {
    type: String,
  },
  tokenForgotExpires: {
    type: Date,
  },
  active: {
    type: Boolean,
    required: true,
  },
  workouts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = User = mongoose.model('User', userSchema);
