import React from 'react'

import { calcWeight } from '../helpers'


const getSideWeight = (weight) => {
  if (weight - 45 < 0) {
    return 0
  }
  return calcWeight((weight-45)/2, 1, 1.25, 2)
}

const inputReps = (inputValue, handleWorkoutInput) => {
  return (
    <input
      type='number'
      value={inputValue}
      onChange={handleWorkoutInput}
    />
  )
}

const inputReps5 = (
  setsLast1,
  setsLast2,
  setsLast3,
  setsLast4,
  setsLast5,
  handleSetsLast1,
  handleSetsLast2,
  handleSetsLast3,
  handleSetsLast4,
  handleSetsLast5,
) => {
  return (
    <div className='exercise-last-set'>
      {inputReps(setsLast1, handleSetsLast1)}
      {inputReps(setsLast2, handleSetsLast2)}
      {inputReps(setsLast3, handleSetsLast3)}
      {inputReps(setsLast4, handleSetsLast4)}
      {inputReps(setsLast5, handleSetsLast5)}
    </div>  
  )
}

const ExerciseRow = ({
  TM,
  percentage,
  reps,
  inputValue,
  handleWorkoutInput,
  AMRAP = false,
  TMTesting = false,
  setsLast = false,
  setsLast1,
  setsLast2,
  setsLast3,
  setsLast4,
  setsLast5,
  handleSetsLast1,
  handleSetsLast2,
  handleSetsLast3,
  handleSetsLast4,
  handleSetsLast5
}) => {

  const weight = calcWeight(TM, parseFloat(percentage) / 100, 2.5)
  const sideWeight = getSideWeight(weight)
  
  return (
    <div className='exercise-row'>
      <span>
        {percentage}
      </span>
      <span>
        {weight}
      </span>
      <span>
        {reps}{(AMRAP & !TMTesting) ? '+' : ''}
      </span>
      <span>
        {sideWeight}
      </span>
      <span>
        {
          setsLast ?
          inputReps5(setsLast1,
            setsLast2,
            setsLast3,
            setsLast4,
            setsLast5,
            handleSetsLast1,
            handleSetsLast2,
            handleSetsLast3,
            handleSetsLast4,
            handleSetsLast5
            ) : inputReps(inputValue, handleWorkoutInput)
        }
      </span>
    </div>
  )
}


export default ExerciseRow