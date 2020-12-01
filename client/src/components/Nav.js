import React, { useContext } from 'react'
import {
  Link
} from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';

const Nav = () => {
  const { user, handleLogout } = useContext(AuthContext)
  
  return (
    <nav id='nav-main'>
      
      <Link className='link-home' to="/">531Workout</Link>
        {
          user === null ?
          <Link
            className='link-login'
            to="/login"
          >
            Sign in
          </Link> :
          <div
            className='link-logout'
            onClick={(event) => handleLogout(event)}
          >
            Sign Out
          </div>
        }
    
    </nav>
  )
}

export default Nav