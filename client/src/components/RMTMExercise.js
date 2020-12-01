import React from 'react'

const RMTMExercise = ({
  exercise,
  idName,
  exerciseRM,
  exerciseTM,
  handleRMChange,
  handleTMChange
}) => {
  return (
    <div
      id={idName}
      className='exercise-wrapper'
    >
      
      <div className='exercise-title-wrapper'>
        <span className='bullet'></span>
        <span className='exercise-title'>
          {exercise}
        </span>
      </div>

      <div className='one-rm-tm-wrapper'>
        <div className='exercise-one-rm'>
          <div className='input-title'>
            1RM
          </div>
          <input
            type='number'
            value={exerciseRM}
            onChange={handleRMChange}
          />
        </div>
        <div className='exercise-tm'>
          <div className='input-title'>
            TM
          </div>
          <input
            type='number'
            value={exerciseTM}
            onChange={handleTMChange}
          />
        </div>
      </div>
  
    </div>
  )
}


export default RMTMExercise