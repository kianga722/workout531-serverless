import React from 'react';
import ContextWrapper from './components/ContextWrapper'
import SchemeContextProvider from './contexts/SchemeContext';
import LoadingContextProvider from './contexts/LoadingContext';
import AuthContextProvider from './contexts/AuthContext';
import NotificationContextProvider from './contexts/NotificationContext';
import WorkoutContextProvider from './contexts/WorkoutContext';

function App() {
  return (
    <SchemeContextProvider>
      <LoadingContextProvider>
        <NotificationContextProvider>
          <AuthContextProvider>
            <WorkoutContextProvider>
              <ContextWrapper />
            </WorkoutContextProvider>
          </AuthContextProvider>
        </NotificationContextProvider>
      </LoadingContextProvider>
    </SchemeContextProvider>
  )
}

export default App;
