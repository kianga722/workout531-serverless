import React, { useContext } from 'react';

import { WorkoutContext } from '../contexts/WorkoutContext';

const ConfirmPopup = () => {
  const { nodeConfirm, confirmPopup, setConfirmPopup, handleAssistDelete } = useContext(WorkoutContext);

  return (
    <div className="confirmation-wrapper">

      <div className="popup-background" />

      <section
        className="notifications"
        ref={nodeConfirm}
      >

        <div className="notification">
          {confirmPopup[0]}
        </div>

        <div className="yes-no-wrapper">
          <button
            className="button-yes"
            onClick={(event) => handleAssistDelete(confirmPopup[1])}
          >
            Yes
          </button>
          <button
            className="button-no"
            onClick={(event) => setConfirmPopup(null)}
          >
            No
          </button>
        </div>

      </section>

    </div>
  );
};

export default ConfirmPopup;
