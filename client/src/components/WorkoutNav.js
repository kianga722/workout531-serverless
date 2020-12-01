import React, { useContext } from 'react';

import { NotificationContext } from '../contexts/NotificationContext';
import { AuthContext } from '../contexts/AuthContext';
import { WorkoutContext } from '../contexts/WorkoutContext';

const WorkoutNav = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const {user} = useContext(AuthContext)
  const { workoutCount, completed, handlePrev, handleCurrent, handleNext } = useContext(WorkoutContext);

  return (
    <nav id="nav-workout">

      {
        // Show previous button only if not first workout
      }
      {
        workoutCount !== 1
        && <button
          onClick={(event) => {
            setNotificationMessage(null);
            handlePrev();
          }}
        >
          Previous
        </button>
      }

      {
        // Jumps to current workout
      }
      <button
        onClick={(event) => {
          setNotificationMessage(null);
          handleCurrent();
        }}
      >
        Current
        </button>

      {
        // Only show if workout viewing has completed true state
      }
      {
        completed
        && <button
          onClick={(event) => {
            setNotificationMessage(null);
            handleNext(user);
          }}
        >
          Next
        </button>
      }

    </nav>
  )
}

export default WorkoutNav;
