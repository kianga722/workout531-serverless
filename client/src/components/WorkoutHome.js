import React, { useEffect, useContext } from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import LoadingWorkout from './LoadingWorkout'
import ConfirmPopup from './ConfirmPopup'
import WorkoutNav from './WorkoutNav'
import WorkoutHeading from './WorkoutHeading'
import RMCalcBlock from './RMCalcBlock'
import RMTMList from './RMTMList'
import WorkoutBlock from './WorkoutBlock'
import AssistAddBlock from './AssistAddBlock'
import AssistExercise from './AssistExercise'

import { LoadingContext } from '../contexts/LoadingContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { AuthContext } from '../contexts/AuthContext';
import { WorkoutContext } from '../contexts/WorkoutContext';

const WorkoutHome = () => {
  const { workoutLoading, setWorkoutLoading } = useContext(LoadingContext);
  const { setNotificationMessage } = useContext(NotificationContext);
  const { user } = useContext(AuthContext)
  const { confirmPopup, navState, workoutCount, cycle, week, section, TMTesting, workoutTransition, RMTM, RMTMCompleted, workout1, setWorkout1, workout2, setWorkout2, assistList, assistMap, resetWorkoutState, handleCurrent, handleDone } = useContext(WorkoutContext);

  // Set workout for user on initial load
  useEffect(() => {
    resetWorkoutState();
    handleCurrent(user);
    return () => {
      setNotificationMessage(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save user inputs only if no localstorage or if storage exists and loading is done and on latest workout
  useEffect(() => {
    if (!workoutLoading && navState === 'current') {
      const getStorage = localStorage.getItem('currentWorkout');
      const storage = JSON.parse(getStorage);

      if (!localStorage.hasOwnProperty('currentWorkout') || (localStorage.hasOwnProperty('currentWorkout') && user.id === storage.userId)) {
        const saveObject = {
          userId: user.id,
          workoutCount,
          RMTM,
          workout1,
          workout2,
          assistance: {},
        };
        if (assistList.length > 0) {
          assistList.map((exercise) => saveObject.assistance[exercise] = assistMap[exercise][0]);
        }

        localStorage.setItem('currentWorkout', JSON.stringify(saveObject));
      }
    }
  }, [assistList, assistMap, user, workout1, workout2, workoutCount, workoutLoading, setWorkoutLoading, navState, RMTM, RMTMCompleted]);

  return (
    <div id="home-logged-in">

      {
        workoutLoading
        && <LoadingWorkout />
      }

      {
      !workoutLoading
      && <div id="workout-home">

        {
        confirmPopup !== null
        && <ConfirmPopup />
        }

        {
        user
        && <div className="logged-in">
            <div>
              Logged in as:
            </div>
            <div className="user-email">
              {user.email}
            </div>
          </div>
        }

        <WorkoutNav />

    <TransitionGroup>
      <CSSTransition
        key={workoutCount}
        timeout={{ enter: 300 }}
        classNames={workoutTransition}
      >
      <div>
              
        <WorkoutHeading />
        
        <RMTMList />

        <RMCalcBlock />

        { RMTMCompleted
        && <div className="after-rmtm-complete">

          <AssistAddBlock />

          <section id="workout-session">

            <WorkoutBlock
              workout={workout1}
              setWorkout={setWorkout1}
              cycle={cycle}
              week={week}
              TMTesting={TMTesting}
            />

            {
              workout2
              && <WorkoutBlock
                workout={workout2}
                setWorkout={setWorkout2}
                cycle={cycle}
                week={week}
                TMTesting={TMTesting}
              />
            }

            <div className="assistance-wrapper">

              {assistList.map((assistName) => (
                  <AssistExercise
                    key={assistName}
                    assistName={assistName}
                    assistWorkout={assistMap[assistName][0]}
                  />
                ))}

            </div>

          </section>

          <section id="finish-options">
            <div
                className="done-button"
                onClick={(event) => handleDone(week, section)}
              >
              Finish Workout
              </div>
          </section>

        </div>}
                
      </div>
      </CSSTransition>
    </TransitionGroup>

      </div>
      }

    </div>
  );
};


export default WorkoutHome
;