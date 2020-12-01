import React, { createContext, useState } from 'react';

export const LoadingContext = createContext();

const LoadingContextProvider = (props) => {
  const [contentLoading, setContentLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ contentLoading, setContentLoading, workoutLoading, setWorkoutLoading }}>
      {props.children}
    </LoadingContext.Provider>
  )
}


export default LoadingContextProvider;