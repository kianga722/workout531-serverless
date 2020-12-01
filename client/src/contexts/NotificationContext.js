import React, { createContext, useState, useEffect, useRef } from 'react';

export const NotificationContext = createContext();

const NotificationContextProvider = (props) => {
  // Notification Messages
  // has object structure of {err/info: [errors]}
  const [notificationMessage, setNotificationMessage] = useState(null);
  const nodeNotification = useRef();

  // Notifications Popup Handle Clicks
  const handleClick = (e) => {
    if (nodeNotification.current && nodeNotification.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setNotificationMessage(null);
  };

  // Handle popup mouse clicks
  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NotificationContext.Provider value={{ notificationMessage, setNotificationMessage }}>
      {props.children}
    </NotificationContext.Provider>
  )
}


export default NotificationContextProvider;