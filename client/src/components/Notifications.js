import React, {useContext} from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const Notification = () => {
  const { nodeNotification, notificationMessage, setNotificationMessage } = useContext(NotificationContext);

  if (notificationMessage === null) {
    return null;
  }

  const type = Object.keys(notificationMessage)[0] === 'err' ? 'err' : 'info';
  const msgArr = notificationMessage[type];
  const length = msgArr.length > 1 ? 'multi' : null;

  return (
    <div className="notifications-wrapper">

      <div className="popup-background" />

      <section
        className={`notifications ${type}`}
        ref={nodeNotification}
      >

        <div
          className="notification-close-wrapper"
        >
          <div
            className="notification-close"
            onClick={(event) => setNotificationMessage(null)}
          >
            &times;
          </div>
        </div>

        <div
          className={`notification-list ${type} ${length}`}
        >
          {
          msgArr.map((msg) => (
            <div
              key={msgArr.indexOf(msg)}
            >
              {
                type === 'err' && msgArr.length > 1
                && (
                <span>
                  &#8226;
                </span>
                )
              }
              {' '}
              {msg}
            </div>
          ))
        }
        </div>


      </section>

    </div>
  );
};

export default Notification;
