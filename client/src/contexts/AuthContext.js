import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { LoadingContext } from './LoadingContext';
import { NotificationContext } from './NotificationContext';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  // import from other Contexts
  const { setContentLoading } = useContext(LoadingContext);
  const { setNotificationMessage } = useContext(NotificationContext);

  // User
  const [user, setUser] = useState(null);

  // Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup
  const [emailSignup, setEmailSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [password2Signup, setPassword2Signup] = useState('');

  // Resend Email
  const [emailResend, setEmailResend] = useState('');

  // Forgot Password
  const [emailForgot, setEmailForgot] = useState('');

  // Reset Password
  const [emailReset, setEmailReset] = useState(null);
  const [passwordReset, setPasswordReset] = useState('');
  const [password2Reset, setPassword2Reset] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/.netlify/functions/login', { email, password });
      const user = response.data;
      setContentLoading(true);
      await localStorage.clear();
      setUser(user);
      setContentLoading(false);
    } catch (err) {
      setNotificationMessage(err.response.data);
      setPassword('');
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await axios.get('/.netlify/functions/login/logout');
      await localStorage.clear();
      setUser(null);
      setEmail('');
      setPassword('');
    } catch (err) {
      setNotificationMessage(err.response.data);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/.netlify/functions/users', {
        email: emailSignup,
        password: passwordSignup,
        password2: password2Signup,
      });

      setNotificationMessage(response.data);
      setEmailSignup('');
      setPasswordSignup('');
      setPassword2Signup('');
    } catch (err) {
      setNotificationMessage(err.response.data);
      setPasswordSignup('');
      setPassword2Signup('');
    }
  };

  const handleResend = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/.netlify/functions/users/resend', {
        email: emailResend,
      });

      setNotificationMessage(response.data);
    } catch (err) {
      setNotificationMessage(err.response.data);
    }
  };

  const handleForgot = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/.netlify/functions/users/forgot', {
        email: emailForgot,
      });

      setNotificationMessage(response.data);
    } catch (err) {
      setNotificationMessage(err.response.data);
    }
  };

  const handleReset = async (event, history) => {
    event.preventDefault();

    const tokenForgot = window.location.pathname.split('/').pop();
    try {
      const response = await axios.post(`/.netlify/functions/users/reset/${tokenForgot}`, {
        email: emailReset,
        password: passwordReset,
        password2: password2Reset,
      });

      // window.location.pathname = '/login'
      history.push('/login');
      setNotificationMessage(response.data);
    } catch (err) {
      setNotificationMessage(err.response.data);
    }
  };

  const jwtCheck = async () => {
    try {
      // console.log('Checking for valid jwt token...')
      const response = await axios.get('/.netlify/functions/login/jwtCheck');
      const userFound = response.data;

      if (userFound) {
        setUser(userFound);
      }
    } catch (err) {
      // Don't care about errors here
      // console.log(err.response.data)
    }
    setContentLoading(false);
  };

  const jwtVerifyCheck = async () => {
    try {
      // console.log('EMAIL VERIFY Checking for valid jwt token...')
      const response = await axios.get('/.netlify/functions/login/jwtCheck');
      const userFound = response.data;

      if (userFound) {
        setUser(userFound);
        setNotificationMessage({ err: ['Cannot verify a user while another user is already signed in'] });
      } else {
        const tokenEmail = window.location.pathname.split('/').pop();

        const responseVerify = await axios.get(`/.netlify/functions/users/verify/${tokenEmail}`);
        const userVerifyFound = responseVerify.data;

        await localStorage.clear();
        setUser(userVerifyFound);

        setNotificationMessage({ info: ['Email successfully verified!'] });
        window.history.pushState('', '', '/workouts');
      }
    } catch (err) {
      setNotificationMessage(err.response.data);
      window.history.pushState('', '', '/resend');
    }
    setContentLoading(false);
  };

  const jwtResetCheck = async () => {
    try {
      // console.log('FORGOT PASSWORD Checking for valid jwt token...')
      const response = await axios.get('/.netlify/functions/login/jwtCheck');
      const userFound = response.data;

      if (userFound) {
        setUser(userFound);
        setNotificationMessage({ err: ['Cannot reset password while another user is signed in'] });
      } else {
        const tokenForgot = window.location.pathname.split('/').pop();

        const responseForgot = await axios.get(`/.netlify/functions/users/reset/${tokenForgot}`);
        const emailFound = responseForgot.data;

        setEmailReset(emailFound);
      }
    } catch (err) {
      setNotificationMessage(err.response.data);
      window.history.pushState('', '', '/forgot');
    }
    setContentLoading(false);
  };

  // Check if browser already has JWT token
  useEffect(() => {
    if (window.location.pathname.includes('verify')) {
      jwtVerifyCheck();
    } else if (window.location.pathname.includes('reset')) {
      jwtResetCheck();
    } else {
      jwtCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{
      user, setUser,
      email, setEmail,
      password, setPassword,
      emailSignup, setEmailSignup,
      passwordSignup, setPasswordSignup,
      password2Signup, setPassword2Signup,
      emailResend, setEmailResend,
      emailForgot, setEmailForgot,
      emailReset,
      passwordReset, setPasswordReset,
      password2Reset, setPassword2Reset,
      handleLogin,
      handleLogout, 
      handleSignup,
      handleResend,
      handleForgot,
      handleReset,
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}


export default AuthContextProvider;