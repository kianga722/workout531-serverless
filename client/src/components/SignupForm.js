import React, { useEffect, useContext } from 'react';
import {
  Link
} from 'react-router-dom';

import { NotificationContext } from '../contexts/NotificationContext';
import { AuthContext } from '../contexts/AuthContext';

const SignupForm = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const { emailSignup, setEmailSignup, passwordSignup, setPasswordSignup, password2Signup, setPassword2Signup, handleSignup } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      setNotificationMessage(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id='signup'>

      <h2>Create your account now</h2>

      <form>

        <div className='form-wrapper'>
          <div className='form-title'>
            Email
          </div>
          <input
            id='emailSignup'
            type='email'
            value={emailSignup}
            onChange={({ target }) => setEmailSignup(target.value)}
          />
        </div>

        <div className='form-wrapper'>
          <div className='form-title'>
            Password
          </div>
          <input
            id='passwordSignup'
            type='password'
            value={passwordSignup}
            onChange={({ target }) => setPasswordSignup(target.value)}
          />
        </div>

        <div className='form-wrapper'>
          <div className='form-title'>
            Confirm Password
          </div>
          <input
            id='password2Signup'
            type='password'
            value={password2Signup}
            onChange={({ target }) => setPassword2Signup(target.value)}
          />
        </div>

        <div className='submit-wrapper'>
          <input
            className='submit-button'
            type='submit'
            onClick={handleSignup}
            value='Create your account'
          >
          </input>
        </div>
        
      </form>

      <div className='links'>
        <div className='links-login'>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
        <div className='links-resend'>
          Problems activating your account? <Link to="/resend">Resend Email Confirmation</Link>
        </div>
      </div>
      
    </div>
  )
}

export default SignupForm