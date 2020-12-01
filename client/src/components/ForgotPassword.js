import React, { useEffect, useContext } from 'react'

import { NotificationContext } from '../contexts/NotificationContext';
import { AuthContext } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const { emailForgot, setEmailForgot, handleForgot } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      setNotificationMessage(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id='forgotPassword'>
  
      <h2>Reset your password</h2>

      <form>

        <div className='form-wrapper'>
          <div className='form-title'>
            Email
          </div>
          <input
            id='emailForgot'
            type='email'
            value={emailForgot}
            onChange={({ target }) => setEmailForgot(target.value)}
          />
        </div>

        <div className='submit-wrapper'>
          <input
            className='submit-button'
            type='submit'
            onClick={handleForgot}
            value='Send reset password email'
          >
          </input>
        </div>
        
      </form>

    </div>
  )
}


export default ForgotPassword