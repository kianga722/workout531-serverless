const mongoose = require('mongoose');

const { Schema } = mongoose;

const workoutSchema = new Schema({
  created: {
    type: Date,
    required: true,
  },
  updated: {
    type: Date,
    required: true,
  },
  workoutCount: {
    type: Number,
    required: true,
  },
  cycle: {
    type: Number,
    required: true,
  },
  week: {
    type: Number,
    required: true,
  },
  section: {
    type: Number,
    required: true,
  },
  TMTesting: {
    type: Boolean,
    required: true,
  },
  RMTM: {
    squatRM: {
      type: Number,
      required: true,
    },
    squatTM: {
      type: Number,
      required: true,
    },
    benchRM: {
      type: Number,
      required: true,
    },
    benchTM: {
      type: Number,
      required: true,
    },
    deadliftRM: {
      type: Number,
      required: true,
    },
    deadliftTM: {
      type: Number,
      required: true,
    },
    opressRM: {
      type: Number,
      required: true,
    },
    opressTM: {
      type: Number,
      required: true,
    },
  },
  workout1: {
    exercise: {
      type: String,
    },
    warmup1: {
      type: Number,
    },
    warmup2: {
      type: Number,
    },
    warmup3: {
      type: Number,
    },
    main1: {
      type: Number,
    },
    main2: {
      type: Number,
    },
    main3: {
      type: Number,
    },
    TMTest: {
      type: Number,
    },
    AMRAP: {
      type: Number,
    },
    setsLast1: {
      type: Number,
    },
    setsLast2: {
      type: Number,
    },
    setsLast3: {
      type: Number,
    },
    setsLast4: {
      type: Number,
    },
    setsLast5: {
      type: Number,
    },
  },
  workout2: {
    exercise: {
      type: String,
    },
    warmup1: {
      type: Number,
    },
    warmup2: {
      type: Number,
    },
    warmup3: {
      type: Number,
    },
    main1: {
      type: Number,
    },
    main2: {
      type: Number,
    },
    main3: {
      type: Number,
    },
    TMTest: {
      type: Number,
    },
    AMRAP: {
      type: Number,
    },
    setsLast1: {
      type: Number,
    },
    setsLast2: {
      type: Number,
    },
    setsLast3: {
      type: Number,
    },
    setsLast4: {
      type: Number,
    },
    setsLast5: {
      type: Number,
    },
  },
  assistance: {
    type: {},
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = Workout = mongoose.model('Workout', workoutSchema);
