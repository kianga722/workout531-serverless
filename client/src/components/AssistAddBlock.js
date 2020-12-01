import React, { useContext } from 'react';

import { WorkoutContext } from '../contexts/WorkoutContext';

const AssistAddBlock = () => {
  const { assistAdd, handleAssistAddInput, handleNewAssist } = useContext(WorkoutContext);

  return (
    <div className='add-assist-wrapper'>

      <div className='add-assist-title'>
        Add Assistance Workout
      </div>

      <select
        value={assistAdd.exercise}
        onChange={(event) => handleAssistAddInput(event, 'exercise')}
      >
        <option value='pushups'>Pushups</option>
        <option value='chinups'>Chinups</option>
        <option value='pullups'>Pullups</option>
        <option value='curls'>Curls</option>
        <option value='legraises'>Leg Raises</option>
        <option value='lunges'>Lunges</option>
        <option value='stepUps'>Step Ups</option>
        <option value='bulgarianOneLegSquats'>Bulgarian One Leg Squats</option>
      </select>

      <div className='assist-set-rep-wrapper'>
        <div className='assist-setCount'>
          <div className='input-title'>
            Sets
          </div>
          <input
            type='number'
            value={assistAdd.sets}
            onChange={(event) => handleAssistAddInput(event, 'sets')}
          />
        </div>

        <div className='assist-repCount'>
          <div className='input-title'>
            Reps per Set
          </div>
          <input
            type='number'
            value={assistAdd.reps}
            onChange={(event) => handleAssistAddInput(event, 'reps')}
          />
        </div>

        <div
          className='add-button'
          onClick={(event) => handleNewAssist()}
        >
          ADD
        </div>
      </div>

    </div>
  )
}


export default AssistAddBlock