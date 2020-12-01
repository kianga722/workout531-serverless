import React, { useContext } from 'react'
import ExerciseRow from './ExerciseRow'

import { WorkoutContext } from '../contexts/WorkoutContext';

const WorkoutBlock = ({
  workout,
  setWorkout,
  cycle,
  week,
  TMTesting,
}) => {
  const { RMTM, exerciseMap, getPercentage, getReps, handleWorkoutInput } = useContext(WorkoutContext);

  return (
    <div className='exercise-wrapper'>

      <div className='exercise-title'>
        {workout.exercise}
      </div>

      <div className='title-row'>
        <span>
          %
        </span>
        <span>
          Weight
        </span>
        <span>
          Reps
        </span>
        <span>
          Side
        </span>
        <span>
          Reps Done
        </span>
      </div>

      <ExerciseRow
        TM={RMTM[exerciseMap[workout.exercise] + 'TM']}
        percentage='40%'
        reps={5}
        inputValue={workout.warmup1}
        handleWorkoutInput={(event) => handleWorkoutInput(event, workout, setWorkout, 'warmup1')}
      />

      <ExerciseRow
        TM={RMTM[exerciseMap[workout.exercise] + 'TM']}
        percentage='50%'
        reps={5}
        inputValue={workout.warmup2}
        handleWorkoutInput={(event) => handleWorkoutInput(event, workout, setWorkout, 'warmup2')}
      />
      
      <ExerciseRow
        TM={RMTM[exerciseMap[workout.exercise] + 'TM']}
        percentage='60%'
        reps={3}
        inputValue={workout.warmup3}
        handleWorkoutInput={(event) => handleWorkoutInput(event, workout, setWorkout, 'warmup3')}
      />

      <ExerciseRow
        TM={RMTM[exerciseMap[workout.exercise] + 'TM']}
        percentage={getPercentage(cycle, week).main1}
        reps={getReps(cycle, week).main1}
        inputValue={workout.main1}
        handleWorkoutInput={(event) => handleWorkoutInput(event, workout, setWorkout, 'main1')}
      />
      
      <ExerciseRow
        TM={RMTM[exerciseMap[workout.exercise] + 'TM']}
        percentage={getPercentage(cycle, week).main2}
        reps={getReps(cycle, week).main2}
        inputValue={workout.main2}
        handleWorkoutInput={(event) => handleWorkoutInput(event, workout, setWorkout, 'main2')}
      />
      
      <ExerciseRow
        TM={RMTM[exerciseMap[workout.exercise] + 'TM']}
        percentage={getPercentage(cycle, week).main3}
        reps={getReps(cycle, week).main3}
        inputValue={workout.main3}
        handleWorkoutInput={(event) => handleWorkoutInput(event, workout, setWorkout, 'main3')}
        AMRAP={true}
        TMTesting={TMTesting}
      />
      
      {
        TMTesting &&
        <ExerciseRow
          TM={RMTM[exerciseMap[workout.exercise] + 'TM']}
          percentage={'100%'}
          reps={'3-5'}
          inputValue={workout.TMTest}
          handleWorkoutInput={(event) => handleWorkoutInput(event, workout, setWorkout, 'TMTest')}
          TMTesting={true}
        />
      }
              
      <ExerciseRow
        TM={RMTM[exerciseMap[workout.exercise] + 'TM']}
        percentage={getPercentage(cycle, week).main1}
        reps={5}
        setsLast={true}
        setsLast1={workout.setsLast1}
        setsLast2={workout.setsLast2}
        setsLast3={workout.setsLast3}
        setsLast4={workout.setsLast4}
        setsLast5={workout.setsLast5}
        handleSetsLast1={(event) => handleWorkoutInput(event, workout, setWorkout, 'setsLast1')}
        handleSetsLast2={(event) => handleWorkoutInput(event, workout, setWorkout, 'setsLast2')}
        handleSetsLast3={(event) => handleWorkoutInput(event, workout, setWorkout, 'setsLast3')}
        handleSetsLast4={(event) => handleWorkoutInput(event, workout, setWorkout, 'setsLast4')}
        handleSetsLast5={(event) => handleWorkoutInput(event, workout, setWorkout, 'setsLast5')}
      />

    </div>
  )
}


export default WorkoutBlock