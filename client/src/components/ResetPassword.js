import React, { useEffect, useContext } from 'react'
import {
  Route
} from 'react-router-dom'

import { NotificationContext } from '../contexts/NotificationContext';
import { AuthContext } from '../contexts/AuthContext';

const ResetPassword = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const { emailReset, passwordReset, setPasswordReset, password2Reset, setPassword2Reset, handleReset } = useContext(AuthContext);

  const resetForm = () => (
    <Route render={({ history }) => (

      <form>

        <div className='form-wrapper'>
          <div className='form-title'>
            Password
          </div>
          <input
            id='passwordForgot'
            type='password'
            value={passwordReset}
            onChange={({ target }) => setPasswordReset(target.value)}
          />
        </div>

        <div className='form-wrapper'>
          <div className='form-title'>
            Confirm Password
          </div>
          <input
            id='password2Forgot'
            type='password'
            value={password2Reset}
            onChange={({ target }) => setPassword2Reset(target.value)}
          />
        </div>

        <div className='submit-wrapper'>
          <input
            className='submit-button'
            type='submit'
            onClick={(e) => handleReset(e, history)}
            value='Update Password'
          >
          </input>
        </div>

      </form>

    )} />
  )

  useEffect(() => {
    return () => {
      setNotificationMessage(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id='forgotPassword'>
  
      <h2>Reset Password for {emailReset}</h2>

      {
        resetForm()
      }

    </div>
  )
}


export default ResetPassword