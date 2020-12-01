import React, { useContext } from 'react';
import {
  Link,
} from 'react-router-dom';

import ConfirmPopup from './ConfirmPopup';
import RMCalcBlock from './RMCalcBlock';
import RMTMList from './RMTMList';
import WorkoutBlock from './WorkoutBlock';
import AssistAddBlock from './AssistAddBlock';
import AssistExercise from './AssistExercise';

import { WorkoutContext } from '../contexts/WorkoutContext';

const Home = () => {
  const { confirmPopup, RMTMCompleted, workout1, setWorkout1, workout2, setWorkout2, assistList, assistMap } = useContext(WorkoutContext);

  return (
    <div id="home">

      {
        confirmPopup !== null
        && <ConfirmPopup />
      }

      <div className="main-summary">
        Workout Generator for the 5/3/1 Lifting Program
      </div>

      <div className="links-register">
        <Link to="/signup">START NOW</Link>
      </div>

      <div id="workout-demo">

        <div className="title-wrapper">
          <div className="demo-title">
            TRY A DEMO WORKOUT BELOW
          </div>
        </div>

        <div className="demo-step">
          Enter your 1 Rep Max for each of the following exercises:
        </div>
        <RMTMList />

        <div className="demo-step">
          You can use the following calculator to find your 1 Rep Max:
        </div>
        <RMCalcBlock />

        { RMTMCompleted
          && <div className="after-rmtm-complete">

            <div className="demo-step">
              Add assistance exercises and complete the workout!
            </div>

            <AssistAddBlock />

            <section id="workout-session-demo">
              <WorkoutBlock
                workout={workout1}
                setWorkout={setWorkout1}
                cycle={1}
                week={1}
                TMTesting={false}
              />

              <WorkoutBlock
                workout={workout2}
                setWorkout={setWorkout2}
                cycle={1}
                week={1}
                TMTesting={false}
              />
            </section>

            <div className="assistance-wrapper-demo">

              {assistList.map((assistName) => (
                  <AssistExercise
                    key={assistName}
                    assistName={assistName}
                    assistWorkout={assistMap[assistName][0]}
                  />
                ))}

            </div>

          </div>}


      </div>


    </div>
  );
};


export default Home;
