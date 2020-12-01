import React, { useEffect, useContext } from 'react'

import { NotificationContext } from '../contexts/NotificationContext';
import { AuthContext } from '../contexts/AuthContext';

const ResendEmail = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const { emailResend, setEmailResend, handleResend } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      setNotificationMessage(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id='resendEmail'>
  
      <h2>Resend Email Activation</h2>

      <form>

        <div className='form-wrapper'>
          <div className='form-title'>
            Email
          </div>
          <input
            id='emailResend'
            type='email'
            value={emailResend}
            onChange={({ target }) => setEmailResend(target.value)}
          />
        </div>

        <div className='submit-wrapper'>
          <input
            className='submit-button'
            type='submit'
            onClick={handleResend}
            value='Resend Email'
          >
          </input>
        </div>

      </form>

    </div>
  )
}


export default ResendEmail