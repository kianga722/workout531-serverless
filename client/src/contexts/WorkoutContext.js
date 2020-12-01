import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';

import { calcWeight, calc1RM } from '../helpers';

import { LoadingContext } from '../contexts/LoadingContext';
import { NotificationContext } from './NotificationContext';
import { AuthContext } from '../contexts/AuthContext';

export const WorkoutContext = createContext();

const WorkoutContextProvider = (props) => {
  // import from other Contexts
  const { setWorkoutLoading } = useContext(LoadingContext);
  const { setNotificationMessage } = useContext(NotificationContext);
  const { user } = useContext(AuthContext)

  // Confirm Popup
  const [confirmPopup, setConfirmPopup] = useState(null);
  const nodeConfirm = useRef();

  // Workout Controls 
  const [navState, setNavState] = useState('');
  const [completed, setCompleted] = useState(false);

  // Workout Header
  const [workoutLatest, setWorkoutLatest] = useState(1);
  const [workoutCount, setWorkoutCount] = useState(1);
  const [cycle, setCycle] = useState(1);
  const [week, setWeek] = useState(1);
  const [section, setSection] = useState(1);
  const [TMTesting, setTMTesting] = useState(false);

  // Animation
  const [workoutTransition, setWorkoutTransition] = useState(null);

  // RMTM
  const [RMTM, setRMTM] = useState({
    squatRM: '',
    squatTM: '',
    benchRM: '',
    benchTM: '',
    deadliftRM: '',
    deadliftTM: '',
    opressRM: '',
    opressTM: '',
  });

  const [RMCalc, setRMCalc] = useState({
    weight: '',
    reps: '',
    ans: '',
  });

  const [RMTMCompleted, setRMTMCompleted] = useState(false);

  // WorkoutBlock
  const getExercise = (cycle, section, order) => {
    let workout1Exercise, workout2Exercise
    if (cycle < 4) {
      switch (section) {
        case 1:
          workout1Exercise = 'Squat'
          workout2Exercise = 'Bench'
          break
        case 2:
          workout1Exercise = 'Deadlift'
          workout2Exercise = 'Overhead Press'
          break
        case 3:
          workout1Exercise = 'Bench'
          workout2Exercise = 'Squat'
          break
        default:
          workout1Exercise = 'Squat'
          workout2Exercise = 'Bench'
      }
    } else {
      switch (section) {
        case 1:
          workout1Exercise = 'Overhead Press'
          workout2Exercise = 'Squat'
          break
        case 2:
          workout1Exercise = 'Bench'
          workout2Exercise = undefined
          break
        case 3:
          workout1Exercise = 'Deadlift'
          workout2Exercise = undefined
          break
        default:
          workout1Exercise = 'Overhead Press'
          workout2Exercise = 'Squat'
      }
    }
    if (order === 1) {
      return workout1Exercise
    } 
      return workout2Exercise
  };

  const getWorkoutInit = (cycle, section, order) => {
    const exercise = getExercise(cycle, section, order);
    if (!exercise) {
      return undefined;
    }
    return {
      exercise,
      warmup1: '',
      warmup2: '',
      warmup3: '',
      main1: '',
      main2: '',
      main3: '',
      TMTest: '',
      AMRAP: '',
      setsLast1: '',
      setsLast2: '',
      setsLast3: '',
      setsLast4: '',
      setsLast5: '',
    };
  };

  const [workout1, setWorkout1] = useState(getWorkoutInit(1, 1, 1));
  const [workout2, setWorkout2] = useState(getWorkoutInit(1, 1, 2));

  const exerciseMap = {
    Squat: 'squat',
    Bench: 'bench',
    Deadlift: 'deadlift',
    'Overhead Press': 'opress',
  };

  const getPercentage = (cycle, week) => {
    const percentageMap = {
      1: {
        main1: '65%',
        main2: '75%',
        main3: '85%',
      },
      2: {
        main1: '70%',
        main2: '80%',
        main3: '90%',
      },
      3: {
        main1: '75%',
        main2: '85%',
        main3: '95%',
      },
    };

    if (cycle < 4) {
      return percentageMap[week];
    }
    return percentageMap[2];
  };

  const getReps = (cycle, week) => {
    const repsMap = {
      1: {
        main1: 5,
        main2: 5,
        main3: 5,
      },
      2: {
        main1: 3,
        main2: 3,
        main3: 3,
      },
      3: {
        main1: 5,
        main2: 3,
        main3: 1,
      },
    };

    if (cycle < 4) {
      return repsMap[week];
    }
    return repsMap[1];
  };

  const [assistAdd, setAssistAdd] = useState({
    exercise: 'pushups',
    sets: '',
    reps: '',
  });

  const [assistList, setAssistList] = useState([]);
  const [pushups, setPushups] = useState({});
  const [chinups, setChinups] = useState({});
  const [pullups, setPullups] = useState({});
  const [curls, setCurls] = useState({});
  const [legraises, setLegRaises] = useState({});
  const [lunges, setLunges] = useState({});
  const [stepUps, setStepUps] = useState({});
  const [bulgarianOneLegSquats, setBulgarianOneLegSquats] = useState({});

  const assistMap = {
    pushups: [pushups, setPushups],
    chinups: [chinups, setChinups],
    pullups: [pullups, setPullups],
    curls: [curls, setCurls],
    legraises: [legraises, setLegRaises],
    lunges: [lunges, setLunges],
    stepUps: [stepUps, setStepUps],
    bulgarianOneLegSquats: [bulgarianOneLegSquats, setBulgarianOneLegSquats],
  };

  const assistFormat = {
    pushups: 'Pushups',
    chinups: 'Chinups',
    pullups: 'Pullups',
    curls: 'Curls',
    legraises: 'Leg Raises',
    lunges: 'Lunges',
    stepUps: 'Step Ups',
    bulgarianOneLegSquats: 'Bulgarian One Leg Squats'
  };


  // Confirm Popup Handle Clicks
  const handleClick = (e) => {
    if (nodeConfirm.current && nodeConfirm.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setConfirmPopup(null);
  };

  const updateRMTM = (exercise, RM, TM) => {
    setRMTM({
      ...RMTM,
      [`${exercise}RM`]: RM,
      [`${exercise}TM`]: TM,
    });
  };
  const handleRMChange = ({ target }, exercise) => {
    const RM = target.value;
    const TM = calcWeight(RM, 0.9, 2.5);
    updateRMTM(exercise, RM, TM);
  };

  const updateTM = (exercise, TM) => {
    setRMTM({
      ...RMTM,
      [`${exercise}TM`]: TM,
    });
  };
  const handleTMChange = ({ target }, exercise) => {
    const TM = target.value;
    updateTM(exercise, TM);
  };

  const updateRMCalc = (key, value, ans) => {
    setRMCalc({
      ...RMCalc,
      [key]: value,
      ans: ans,
    });
  };
  const handleRMCalc = ({ target }, key) => {
    let weight, reps;
    if (key === 'weight') {
      weight = target.value;
      reps = RMCalc.reps;
    }
    if (key === 'reps') {
      weight = RMCalc.weight;
      reps = target.value;
    }
    const ans = calc1RM(weight, reps);
    updateRMCalc(key, target.value, ans);
  };


  const updateWorkout = (workout, setWorkout, key, value) => {
    setWorkout({
      ...workout,
      [key]: value,
    });
  };
  const handleWorkoutInput = ({ target }, workout, setWorkout, key) => {
    const {value} = target;
    updateWorkout(workout, setWorkout, key, value);
  };


  const updateAssistAdd = (key, value) => {
    setAssistAdd({
      ...assistAdd,
      [key]: value,
    });
  };
  const handleAssistAddInput = ({ target }, key) => {
    updateAssistAdd(key, target.value);
  };

  const handleNewAssist = () => {
    const { exercise, sets, reps } = assistAdd;
    if (!exercise || !sets || !reps) {
      setNotificationMessage({ err: ['Please fill in both Sets and Reps fields before adding an Assistance Exercise'] });
      return;
    }
    if (assistList.includes(exercise)) {
      setNotificationMessage({ err: [`${assistFormat[exercise]} already added`] });
      return;
    }
    setAssistList(assistList.concat(exercise));

    const newAssist = {
      sets,
      reps,
    };
    for (let i = 1; i <= Number(sets); i += 1) {
      const repsName = `reps${i}`;
      newAssist[repsName] = '';
    }
    assistMap[exercise][1](newAssist);
    setNotificationMessage({ info: [`${assistFormat[exercise]} ${sets}x${reps} added (Assistance Exercises located at the end of the Workout)`] });
  };

  const handleAssistInput = ({ target }, exercise, key) => {
    assistMap[exercise][1]({
      ...assistMap[exercise][0],
      [key]: target.value,
    });
  };

  const handleAssistDelete = (assistName) => {
    // Update assistList state
    const indexDelete = assistList.indexOf(assistName);
    const newAssistList = assistList.slice(0, indexDelete).concat(assistList.slice(indexDelete + 1));
    setAssistList(newAssistList);

    // Update specific assist state

    assistMap[assistName][1]({});
    setConfirmPopup(null);
  };

  const getWorkoutFromDB = async (workoutCount) => {
    try {
      const response = await axios.get(`/.netlify/functions/workouts/${workoutCount}`);
      const workoutData = await response.data;

      if (workoutData) {
        return workoutData;
      }
      return null;
    } catch (err) {
      setNotificationMessage(err.response.data);
      window.scrollTo(0, 0);
    }
  };

  const setFoundWorkout = (workout) => {
    // Transitions between workouts
    if (workout.workoutCount > workoutCount) {
      setWorkoutTransition('moveLeft');
    } else if (workout.workoutCount === workoutCount) {
      setWorkoutTransition(null);
    } else {
      setWorkoutTransition('moveRight');
    }

    setWorkoutCount(workout.workoutCount);

    setCycle(workout.cycle);
    setWeek(workout.week);
    setSection(workout.section);

    // All previous workouts should be in database
    setCompleted(true);

    setTMTesting(workout.TMTesting);

    setRMTM(workout.RMTM);
    setWorkout1(workout.workout1);
    setWorkout2(workout.workout2);

    const allAssist = Object.keys(assistMap);
    if (workout.assistance) {
      const workoutAssists = Object.keys(workout.assistance);

      const assistListNew = [];
      allAssist.forEach((exercise) => {
        if (workoutAssists.includes(exercise)) {
          assistListNew.push(exercise);
          const assistObject = workout.assistance[exercise];

          assistMap[exercise][1](assistObject);
        } else {
          assistMap[exercise][1]({});
        }
      });
      setAssistList(assistListNew);
    } else {
      allAssist.forEach((exercise) => {
        assistMap[exercise][1]({});
      });
      setAssistList([]);
    }
  };

  const getNextWorkoutParams = (workoutCurrent) => {
    // Set params to query db for next workout
    let workoutCountNext = workoutCurrent.workoutCount + 1;
    let cycleNext = workoutCurrent.cycle;
    let weekNext = workoutCurrent.week;
    let sectionNext = workoutCurrent.section;
    let TMTestingNext = workoutCurrent.TMTesting;


    // After section 3,section resets and week changes
    if (workoutCurrent.section === 3) {
      sectionNext = 1;

      // Week resets after week 3 or after cycle 4 week 1
      if (workoutCurrent.week === 3 || workoutCurrent.cycle === 4) {
        weekNext = 1;

        // After cycle 3, special 1 week testing cycle starts

        // After cycle 4, cycle resets
        if (workoutCurrent.cycle === 4) {
          TMTestingNext = false;
          cycleNext = 1;
        } else {
          // cycle increase by 1
          cycleNext += 1;
          if (cycleNext === 4) {
            TMTestingNext = true;
          }
        }
      } else {
        // week increase by 1
        weekNext += 1;
      }
    } else {
      // section increases by 1
      sectionNext += 1;
    }

    return {
      workoutCountNext,
      cycleNext,
      weekNext,
      sectionNext,
      TMTestingNext,
    };
  };

  const setNewAssist = (workoutCurrent) => {
    const allAssist = Object.keys(assistMap);
    const workoutCurrentAssist = Object.keys(workoutCurrent.assistance);

    const assistListNew = [];
    allAssist.forEach((exercise) => {
      if (workoutCurrentAssist.includes(exercise)) {
        // If contain both chinups and pullups, do nothing special
        if (workoutCurrentAssist.includes('chinups') && workoutCurrentAssist.includes('pullups')) {
          assistListNew.push(exercise);

          const assistObject = workoutCurrent.assistance[exercise];
          // reset rep inputs to empty for all previous exercises
          Object.keys(assistObject).forEach((key) => {
            if (key !== 'sets' && key !== 'reps') {
              assistObject[key] = '';
            }
          });
          assistMap[exercise][1](assistObject);
        } else {
          // swap chinups and pullups every section
          let exerciseNew = exercise;
          if (exercise === 'chinups') {
            exerciseNew = 'pullups';
          }
          if (exercise === 'pullups') {
            exerciseNew = 'chinups';
          }
          assistListNew.push(exerciseNew);

          const assistObject = workoutCurrent.assistance[exercise];
          // reset rep inputs to empty for all previous exercises
          Object.keys(assistObject).forEach((key) => {
            if (key !== 'sets' && key !== 'reps') {
              assistObject[key] = '';
            }
          });
          assistMap[exerciseNew][1](assistObject);
          // Reset original exercise state if chinups or pullups
          if (exercise === 'chinups' || exercise === 'pullups') {
            assistMap[exercise][1]({});
          }
        }
      } else if (workoutCurrentAssist.includes('chinups') && workoutCurrentAssist.includes('pullups')) {
          // Do nothing special if includes both chinups and pullups
          assistMap[exercise][1]({})
        } else {
          // Don't delete chinups and pullups, let first part of if statement handle it
          if (exercise !== 'chinups' && exercise !== 'pullups') {
            assistMap[exercise][1]({})
          }
        }
    });
    setAssistList(assistListNew);
  };

  const setNewWorkout = async (workoutCurrent, workoutCountNext, cycleNext, weekNext, sectionNext, TMTestingNext, user) => {
    // Transitions between workouts
    if (workoutCountNext > workoutCount) {
      setWorkoutTransition('moveLeft');
    } else if (workoutCountNext === workoutCount) {
      setWorkoutTransition('');
    } else {
      setWorkoutTransition('moveRight');
    }

    // Set state to default values for newest workout
    setWorkoutCount(workoutCountNext);
    setCycle(cycleNext);
    setWeek(weekNext);
    setSection(sectionNext);

    // Only set Completed false if new workout not in dadtabase
    setCompleted(false);

    setTMTesting(TMTestingNext);

    // If values in storage for newest workout, use them
    const getStorage = localStorage.getItem('currentWorkout');
    const storage = JSON.parse(getStorage);

    if (localStorage.hasOwnProperty('currentWorkout') && storage.workoutCount === workoutCountNext && user && user.id === storage.userId) {
      setStoredValues(storage);
    } else {
      // Create new workout
      let opressRMNext = workoutCurrent.RMTM.opressRM;
        let opressTMNext = workoutCurrent.RMTM.opressTM;
        let benchRMNext = workoutCurrent.RMTM.benchRM;
        let benchTMNext = workoutCurrent.RMTM.benchTM;
        let squatRMNext = workoutCurrent.RMTM.squatRM;
        let squatTMNext = workoutCurrent.RMTM.squatTM;
        let deadliftRMNext = workoutCurrent.RMTM.deadliftRM;
        let deadliftTMNext = workoutCurrent.RMTM.deadliftTM;

      if (workoutCurrent.cycle === 4 && cycleNext === 1) {
        // GET PREVIOUS WORKOUTS FORM DB
        try {
          const workoutTestOpressSquat = await getWorkoutFromDB(workoutCurrent.workoutCount - 2);

          const workoutTestBench = await getWorkoutFromDB(workoutCurrent.workoutCount - 1);

          // after TMTest week, keep testing weight for successful exercise or re-estimate 1RM
          const opressTest = Number(workoutTestOpressSquat.workout1.TMTest);
          const squatTest = Number(workoutTestOpressSquat.workout2.TMTest);
          const benchTest = Number(workoutTestBench.workout1.TMTest);
          const deadliftTest = Number(workoutCurrent.workout1.TMTest);

          if (opressTest < 3) {
            opressRMNext = calc1RM(workoutCurrent.RMTM.opressTM, opressTest);
            opressTMNext = calcWeight(opressRMNext, 0.9, 2.5);
          }
          if (squatTest < 3) {
            squatRMNext = calc1RM(workoutCurrent.RMTM.squatTM, squatTest);
            squatTMNext = calcWeight(squatRMNext, 0.9, 2.5);
          }
          if (benchTest < 3) {
            benchRMNext = calc1RM(workoutCurrent.RMTM.benchTM, benchTest);
            benchTMNext = calcWeight(benchRMNext, 0.9, 2.5);
          }
          if (deadliftTest < 3) {
            deadliftRMNext = calc1RM(workoutCurrent.RMTM.deadliftTM, deadliftTest);
            deadliftTMNext = calcWeight(deadliftRMNext, 0.9, 2.5);
          }
        } catch (err) {
          setNotificationMessage(err.response.data);
          window.scrollTo(0, 0);
        }
      }
      // always increase weights after each cycle except after cycle 4
      if (workoutCurrent.cycle !== 4 && workoutCurrent.week === 3 && workoutCurrent.section === 3) {
        opressTMNext = (Number(opressTMNext) + 5).toString();
        benchTMNext = (Number(benchTMNext) + 5).toString();
        squatTMNext = (Number(squatTMNext) + 10).toString();
        deadliftTMNext = (Number(deadliftTMNext) + 10).toString();
      }

      setRMTM({
        ...RMTM,
        opressRM: opressRMNext,
        opressTM: opressTMNext,
        benchRM: benchRMNext,
        benchTM: benchTMNext,
        squatRM: squatRMNext,
        squatTM: squatTMNext,
        deadliftRM: deadliftRMNext,
        deadliftTM: deadliftTMNext,
      });

      setWorkout1(getWorkoutInit(cycleNext, sectionNext, 1));
      setWorkout2(getWorkoutInit(cycleNext, sectionNext, 2));

      if (workoutCurrent.assistance) {
        setNewAssist(workoutCurrent);
      }
    }
  };

  const setStoredValues = (storage) => {
    setRMTM({
      ...RMTM,
      opressRM: storage.RMTM.opressRM,
      opressTM: storage.RMTM.opressTM,
      benchRM: storage.RMTM.benchRM,
      benchTM: storage.RMTM.benchTM,
      squatRM: storage.RMTM.squatRM,
      squatTM: storage.RMTM.squatTM,
      deadliftRM: storage.RMTM.deadliftRM,
      deadliftTM: storage.RMTM.deadliftTM,
    });

    setWorkout1(storage.workout1);
    setWorkout2(storage.workout2);

    const assistList = Object.keys(storage.assistance);
    setAssistList(assistList);

    assistList.forEach((exercise) => {
      const assistObject = storage.assistance[exercise];
      assistMap[exercise][1](assistObject);
    });
  };

  // Clear local storage and reload
  const handleReCalc = async (user) => {
    setWorkoutLoading(true);
    await localStorage.clear();
    await handleCurrent(user);
  };

  // Reset workout state
  const resetWorkoutState = () => {
    setNavState('')
    setCompleted(false);
    setWorkoutLatest(1);
    setWorkoutCount(1);
    setCycle(1);
    setWeek(1);
    setSection(1);
    setTMTesting(false);
    setRMTM({
      squatRM: '',
      squatTM: '',
      benchRM: '',
      benchTM: '',
      deadliftRM: '',
      deadliftTM: '',
      opressRM: '',
      opressTM: '',
    });
    setRMCalc({
      weight: '',
      reps: '',
      ans: '',
    });
    setRMTMCompleted(false);
    setWorkout1(getWorkoutInit(1, 1, 1))
    setWorkout2(getWorkoutInit(1, 1, 2))
    setAssistAdd({
      exercise: 'pushups',
      sets: '',
      reps: '',
    });
    setAssistList([]);
    setPushups({});
    setChinups({});
    setPullups({});
    setLegRaises({});
  }

  const handlePrev = async () => {
    try {
      // Get previous workout based on current workout - 1
      const workoutPrev = await getWorkoutFromDB(workoutCount - 1);
      if (workoutPrev) {
        setNavState('prev');
        setFoundWorkout(workoutPrev);
        // setNotificationMessage(null)
      }
    } catch (err) {
      setNotificationMessage(err.response.data);
      window.scrollTo(0, 0);
    }
    setNotificationMessage(null);
  };

  const handleCurrent = async (userFound) => {
    // Change this to get by most recently created
    try {
      const response = await axios.get('/.netlify/functions/workouts/current');
      const workoutCurrent = response.data;

      // If no workouts saved in database previously
      if (!workoutCurrent) {
        // If values in storage for newest workout, use them
        const getStorage = localStorage.getItem('currentWorkout');
        const storage = JSON.parse(getStorage);

        // Want to set input values if saved in localstorage
        if (localStorage.hasOwnProperty('currentWorkout') && userFound && userFound.id === storage.userId) {
          setStoredValues(storage);
        }
        setNavState('current');
        setWorkoutLoading(false);
        // setNotificationMessage(null)
        return;
      }

      const {
        workoutCountNext, cycleNext, weekNext, sectionNext, TMTestingNext 
      } = getNextWorkoutParams(workoutCurrent);

      // Update latest workout state
      setWorkoutLatest(workoutCountNext);

      // Set state to default values for newest workout
      const userCurrent = userFound || user;
      await setNewWorkout(workoutCurrent, workoutCountNext, cycleNext, weekNext, sectionNext, TMTestingNext, userCurrent);

      // Set state to current after setting new workout input values so the previous workout inputs are not saved to localstorage
      setNavState('current');     
      setWorkoutLoading(false);
      // setNotificationMessage(null)
    } catch (err) {
      setNotificationMessage(err.response.data);
      window.scrollTo(0, 0);
    }
    setNotificationMessage(null);
  };

  const handleNext = async (user) => {
    // Get next workout based on current workout params of workoutCount, cycle, week, section
    try {
      const workoutCurrent = await getWorkoutFromDB(workoutCount);

      if (!workoutCurrent) {
        setNotificationMessage({ err: [`Workout ${workoutCount} missing from database`] });
        window.scrollTo(0, 0);
        return;
      }

      const {
        workoutCountNext, cycleNext, weekNext, sectionNext, TMTestingNext 
      } = getNextWorkoutParams(workoutCurrent);

      const workoutNext = await getWorkoutFromDB(workoutCountNext);

      // If workout already exists, set state
      if (workoutNext) {
        // since it is in the past
        setNavState('prev');
        setFoundWorkout(workoutNext);
      } else {
        // Set state to default values for newest workout
        setNewWorkout(workoutCurrent, workoutCountNext, cycleNext, weekNext, sectionNext, TMTestingNext, user);

        // since it is the newest workout
        setNavState('current');
        // setNotificationMessage(null)
      }
    } catch (err) {
      setNotificationMessage(err.response.data);
      window.scrollTo(0, 0);
    }
    setNotificationMessage(null);
  };

  const saveWorkoutToDB = async () => {
    const saveObject = {
      workoutCount,
      cycle,
      week,
      section,
      TMTesting,
      RMTM,
      workout1,
      workout2,
      assistance: {},
      userId: user.id,
    };
    if (assistList.length > 0) {
      assistList.map((exercise) => saveObject.assistance[exercise] = assistMap[exercise][0]);
    }

    try {
      const response = await axios.post('/.netlify/functions/workouts', saveObject);
      return response;
    } catch (err) {
      setNotificationMessage(err.response.data);
    }
  };

  const handleDone = async () => {
    try {
      const response = await saveWorkoutToDB();
      if (response) {
        setCompleted(true);
        setNavState('prev');
        setWorkoutLatest(workoutLatest + 1);
        setNotificationMessage({ info: [`Workout #${workoutCount} saved`] });
      }
    } catch (err) {
      setNotificationMessage(err.response.data);
    }
    window.scrollTo(0, 0);
    // setNotificationMessage(null)
  };

  // // Set workout for user on initial load
  // useEffect(() => {
  //   if (user) {
  //     handleCurrent(user);
  //     return () => {
  //       setNotificationMessage(null);
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // // Save user inputs only if no localstorage or if storage exists and loading is done and on latest workout
  // useEffect(() => {
  //   if (user) {
  //     if (!workoutLoading && navState === 'current') {
  //       const getStorage = localStorage.getItem('currentWorkout');
  //       const storage = JSON.parse(getStorage);
  
  //       if (!localStorage.hasOwnProperty('currentWorkout') || (localStorage.hasOwnProperty('currentWorkout') && user.id === storage.userId)) {
  //         const saveObject = {
  //           userId: user.id,
  //           workoutCount,
  //           RMTM,
  //           workout1,
  //           workout2,
  //           assistance: {},
  //         };
  //         if (assistList.length > 0) {
  //           assistList.map((exercise) => saveObject.assistance[exercise] = assistMap[exercise][0]);
  //         }
  
  //         localStorage.setItem('currentWorkout', JSON.stringify(saveObject));
  //       }
  //     }
  //   }
  // }, [assistList, assistMap, user, workout1, workout2, workoutCount, workoutLoading, setWorkoutLoading, navState, RMTM]);


  // Handle confirm popup mouse clicks
  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if RMTM is complete before showing rest of workout
  useEffect(() => {
    for (let i = 0; i < Object.keys(RMTM).length; i += 1) {
      const key = Object.keys(RMTM)[i];
      if (!RMTM[key]) {
        return setRMTMCompleted(false);
      }
    }
    setRMTMCompleted(true);
  }, [RMTM]);

  return (
    <WorkoutContext.Provider value={{ 
      nodeConfirm,
      confirmPopup, setConfirmPopup,
      navState,
      completed,
      workoutCount,
      cycle, 
      week,
      section,
      TMTesting,
      workoutTransition,
      RMTM,
      RMCalc,
      RMTMCompleted,
      workout1, setWorkout1,
      workout2, setWorkout2,
      exerciseMap,
      getPercentage,
      getReps,
      assistAdd,
      assistList,
      assistMap,
      assistFormat,
      handleRMChange,
      handleTMChange,
      handleRMCalc,
      handleWorkoutInput,
      handleAssistAddInput,
      handleNewAssist,
      handleAssistInput,
      handleAssistDelete,
      handleReCalc,
      resetWorkoutState,
      handlePrev,
      handleCurrent,
      handleNext,
      handleDone,
    }}>
      {props.children}
    </WorkoutContext.Provider>
  )
}


export default WorkoutContextProvider;