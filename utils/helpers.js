const convertKeysToString = (workout) => {
  Object.keys(workout.RMTM).forEach((key) => {
    workout.RMTM[key] = workout.RMTM[key].toString();
  });

  if (workout.workout1) {
    Object.keys(workout.workout1).forEach((key) => {
      if (workout.workout1[key] === null || workout.workout1[key] === 0) {
        workout.workout1[key] = '';
      } else {
        workout.workout1[key] = workout.workout1[key].toString();
      }
    });
  }

  if (workout.workout2) {
    Object.keys(workout.workout2).forEach((key) => {
      if (workout.workout2[key] === null || workout.workout2[key] === 0) {
        workout.workout2[key] = '';
      } else {
        workout.workout2[key] = workout.workout2[key].toString();
      }
    });
  }

  if (workout.assistance) {
    Object.keys(workout.assistance).forEach((exercise) => {
      Object.keys(workout.assistance[exercise]).forEach((key) => {
        if (workout.assistance[exercise][key] === 0) {
          workout.assistance[exercise][key] = '';
        } else {
          workout.assistance[exercise][key] = workout.assistance[exercise][key].toString();
        }
      });
    });
  }
};

module.exports = convertKeysToString;
