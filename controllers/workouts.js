const { ObjectId } = require('mongoose').Types;
const convertKeysToString = require('../utils/helpers.js');

const workoutsRouter = require('express').Router();
const Workout = require('../models/Workout');
const User = require('../models/User');

// Get latest workout from database
workoutsRouter.get('/current', async (req, res, next) => {
  try {
    // sort by created date because most recently updated doesn't necessarily mean it is the latest workout
    const workout = await Workout.find({ user: new ObjectId(req.user.id) }, null, { sort: { created: -1 }, limit: 1 });

    if (workout[0]) {
      const workoutJSON = workout[0].toJSON();
      convertKeysToString(workoutJSON);
      res.send(workoutJSON);
    } else {
      // No workouts exist in database
      res.send(undefined);
    }
  } catch (err) {
    next(err);
  }
});


// Get workout from database
workoutsRouter.get('/:id', async (req, res, next) => {
  const workoutCount = req.params.id;

  try {
    const workout = await Workout.find({ user: new ObjectId(req.user.id), workoutCount }).limit(1);

    if (workout.length !== 0) {
      const workoutJSON = workout[0].toJSON();
      convertKeysToString(workoutJSON);
      res.send(workoutJSON);
    } else {
      // Specific workout not found
      res.send(undefined);
    }
  } catch (err) {
    next(err);
  }
});

// Save workout to database
workoutsRouter.post('/', async (req, res, next) => {
  const saveObject = req.body;
  const {
    workoutCount, cycle, week, section, TMTesting, RMTM, workout1, workout2, assistance, userId,
  } = saveObject;
  const {
    squatRM, squatTM, benchRM, benchTM, deadliftRM, deadliftTM, opressRM, opressTM,
  } = RMTM;

  const user = await User.findById(userId);

  // Convert all inputs to numbers
  Object.keys(RMTM).forEach((key) => {
    RMTM[key] = Number(RMTM[key]);
  });

  // Do not allow empty inputs for RMTM
  for (let i = 0; i < Object.keys(RMTM).length; i += 1) {
    const key = Object.keys(RMTM)[i];
    if (!RMTM[key]) {
      return res.status(400).send({ err: ['Must fill out all 1RM and TM exercise weight values!'] });
    }
  }

  if (workout1) {
    Object.keys(workout1).forEach((key) => {
      if (!isNaN(workout1[key])) {
        workout1[key] = Number(workout1[key]);
      }
    });
  }

  if (workout2) {
    Object.keys(workout2).forEach((key) => {
      if (!isNaN(workout2[key])) {
        workout2[key] = Number(workout2[key]);
      }
    });
  }

  // Mongoose does not store empty objects in DB
  if (assistance) {
    Object.keys(assistance).forEach((exercise) => {
      Object.keys(assistance[exercise]).forEach((key) => {
        assistance[exercise][key] = Number(assistance[exercise][key]);
      });
    });
  }

  try {
    const foundWorkout = await Workout.find({
      user: new ObjectId(userId),
      workoutCount,
      cycle,
      week,
      section,
    });

    // update workout if found
    if (foundWorkout.length !== 0) {
      const workout = foundWorkout[0];
      workout.updated = new Date();
      workout.TMTesting = TMTesting;
      workout.RMTM = {
        squatRM,
        squatTM,
        benchRM,
        benchTM,
        deadliftRM,
        deadliftTM,
        opressRM,
        opressTM,
      };
      workout.workout1 = workout1;
      workout.workout2 = workout2;
      workout.assistance = assistance;

      const savedWorkout = await workout.save();
      res.send(savedWorkout);
      return;
    }

    // create new workout if not found
    const workout = new Workout({
      created: new Date(),
      updated: new Date(),
      workoutCount,
      cycle,
      week,
      section,
      TMTesting,
      RMTM: {
        squatRM,
        squatTM,
        benchRM,
        benchTM,
        deadliftRM,
        deadliftTM,
        opressRM,
        opressTM,
      },
      workout1,
      workout2,
      assistance,
      user: user._id,
    });

    const savedWorkout = await workout.save();

    user.workouts = user.workouts.concat(savedWorkout._id);
    await user.save();
    res.send(savedWorkout);
  } catch (err) {
    next(err);
  }
});

module.exports = workoutsRouter;
