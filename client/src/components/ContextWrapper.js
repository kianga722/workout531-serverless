import React, { useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Route, Redirect,
} from 'react-router-dom';

import Loading from './Loading';
import GradientMain from './GradientMain';
import SchemeButton from './SchemeButton';
import Nav from './Nav';
import Notifications from './Notifications';
import Home from './Home';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResendEmail from './ResendEmail';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import WorkoutHome from './WorkoutHome';

import { SchemeContext } from '../contexts/SchemeContext';
import { LoadingContext } from '../contexts/LoadingContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { AuthContext } from '../contexts/AuthContext';
import { WorkoutContext } from '../contexts/WorkoutContext';

function ContextWrapper() {
  const { scheme } = useContext(SchemeContext);
  const { contentLoading } = useContext(LoadingContext);
  const { notificationMessage } = useContext(NotificationContext);
  const { user, emailReset } = useContext(AuthContext)
  const { resetWorkoutState } = useContext(WorkoutContext);

  // Clear inputs if signing out
  useEffect(() => {
    resetWorkoutState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className={`App ${scheme}`}>

      <GradientMain />

      <Router>

        {
          contentLoading
          && <Loading />
        }

        {
          !contentLoading
          && (
          <section id="container">

            <Nav />

            <SchemeButton />

            {
              notificationMessage !== null
              && <Notifications />
            }

            <Route
              exact
              path="/"
              render={() => (user === null? 
                <Home /> : <Redirect to="/workouts" />)}
            />

            <Route
              path="/login"
              render={() => (user === null ?
                <LoginForm /> : <Redirect to="/" />)}
            />

            <Route
              path="/signup"
              render={() => (user === null ?
                <SignupForm /> : <Redirect to="/" />)}
            />

            <Route
              path="/verify/:id"
              render={() => <Redirect to="/resend" />}
            />

            <Route
              path="/resend"
              render={() => (user === null ?
                <ResendEmail /> : <Redirect to="/" />)}
            />

            <Route
              path="/forgot"
              render={() => (user === null ? 
                <ForgotPassword /> : <Redirect to="/" />)}
            />
              
            <Route
              path="/reset/:id"
              render={() => (user === null && emailReset !== null ?
                <ResetPassword /> : <Redirect to="/" />)}
            />

            <Route
              path="/workouts"
              render={() => (user ?
                <WorkoutHome /> : <Redirect to="/login" />)}
            />

          </section>
          )
        }

      </Router>

    </div>

  );
}

export default ContextWrapper;
