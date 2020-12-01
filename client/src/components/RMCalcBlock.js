import React, { useContext } from 'react'

import { WorkoutContext } from '../contexts/WorkoutContext';

const RMCalcBlock = () => {
  const { RMCalc, handleRMCalc } = useContext(WorkoutContext);

  return (
    <section id='rm-calc'>

      <div className='title'>
        1 Rep Max Calculator
      </div>
      
      <div className='weight-reps-wrapper'>
        <div className='rm-calc-weight'>
          <div className='input-title'>
            Weight
          </div>
          <input
            type='number'
            value={RMCalc.sets}
            onChange={(event) => handleRMCalc(event, 'weight')}
          />
        </div>

        <div className='rm-calc-reps'>
          <div className='input-title'>
            Reps
          </div>
          <input
            type='number'
            value={RMCalc.reps}
            onChange={(event) => handleRMCalc(event, 'reps')}
          />
        </div>

        <div className='rm-calc-wrapper'>
          <div className='input-title'>
            1RM
          </div>
          <div className='rm-calc-ans'>
            {RMCalc.ans}
          </div>
        </div>
      </div>

    </section>
  )
}


export default RMCalcBlock