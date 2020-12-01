import React from 'react'

const LoadingWorkout = () => {
  return (
    <div id='loading-workout'>
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className='load-message'>
        Loading Workout...
      </div>
    </div>
  )
}

export default LoadingWorkout