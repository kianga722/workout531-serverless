import React, { useContext } from 'react'
import RMTMExercise from './RMTMExercise'

import { WorkoutContext } from '../contexts/WorkoutContext';

const RMTMList = () => {
  const { RMTM, handleRMChange, handleTMChange } = useContext(WorkoutContext);

  return (
    <section id='rm-tm-wrapper'>

      <RMTMExercise
        exercise='Squat'
        idName='squat-calc'
        exerciseRM={RMTM.squatRM}
        exerciseTM={RMTM.squatTM}
        handleRMChange={(event) => handleRMChange(event, 'squat')}
        handleTMChange={(event) => handleTMChange(event, 'squat')}
      />
      
      <RMTMExercise
        exercise='Bench Press'
        idName='bench-calc'
        exerciseRM={RMTM.benchRM}
        exerciseTM={RMTM.benchTM}
        handleRMChange={(event) => handleRMChange(event, 'bench')}
        handleTMChange={(event) => handleTMChange(event, 'bench')}
      />

      <RMTMExercise
        exercise='Deadlift'
        idName='deadlift-calc'
        exerciseRM={RMTM.deadliftRM}
        exerciseTM={RMTM.deadliftTM}
        handleRMChange={(event) => handleRMChange(event, 'deadlift')}
        handleTMChange={(event) => handleTMChange(event, 'deadlift')}
      />

      <RMTMExercise
        exercise='Overhead Press'
        idName='opress-calc'
        exerciseRM={RMTM.opressRM}
        exerciseTM={RMTM.opressTM}
        handleRMChange={(event) => handleRMChange(event, 'opress')}
        handleTMChange={(event) => handleTMChange(event, 'opress')}
      />

    </section>
  )
}


export default RMTMList