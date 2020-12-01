import React, { useEffect, useContext } from 'react';
import {
  Link
} from 'react-router-dom';

import { NotificationContext } from '../contexts/NotificationContext';
import { AuthContext } from '../contexts/AuthContext';

const LoginForm = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const { email, setEmail, password, setPassword, handleLogin } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      setNotificationMessage(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id='login'>

      <h2>Welcome back!</h2>

      <form>

        <div className='form-wrapper'>
          <div className='form-title'>
            Email
          </div>
          <input
            id='email'
            type='email'
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </div>

        <div className='form-wrapper'>
          <div className='form-title'>
            Password
          </div>
          <input
            id='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <div className='submit-wrapper'>
          <input
            className='submit-button'
            type='submit'
            onClick={handleLogin}
            value='Sign in to your account'
          >
          </input>
        </div>

      </form>

      <div className='links'>
        <div className='links-forgot'>
          <Link to="/forgot">Forgot password?</Link>
        </div>
        <div className='links-register'>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
        <div className='links-resend'>
          Problems activating your account? <Link to="/resend">Resend Email Confirmation</Link>
        </div>
      </div>
      
    </div>
  )
}

export default LoginForm