const randomstring = require('randomstring');

describe('Signup Login', function () {
  const tokenEmail = randomstring.generate()
  const tokenForgot = randomstring.generate()

  before(function () {
    cy.request('POST', 'http://localhost:8888/.netlify/functions/testing/reset')
    const user = {
      email: 'foobar@bar.com',
      password: 'foobar',
      approved: false,
      tokenEmail,
      tokenForgot,
    }
    cy.request('POST', 'http://localhost:8888/.netlify/functions/testing/createUser', user)
    cy.visit('http://localhost:8888')
  })

  describe('not logged in user navigating around to different pages', function () { 
    it('front page can be opened', function() {
      cy.contains('TRY A DEMO WORKOUT BELOW')
    })

    it('login can be opened from nav', function() {
      cy.contains('Sign in').click()
      cy.contains('Forgot password?')
    })

    it('receive error when trying to login with no credentials', function() {
      cy.get('#login .submit-button').click()
      cy.get('.notifications').should('exist')
      cy.contains('Missing credentials')
      cy.get('.notification-close').click()
    })

    it('signup can be opened from login', function () {
      cy.contains('Sign up').click()
      cy.get('.notifications').should('not.exist')
      cy.contains("Already have an account?")
    })

    it('receive error when trying to signup with no credentials', function() {
      cy.get('#signup .submit-button').click()
      cy.get('.notifications').should('exist')
      cy.contains('Please fill in all fields')
      cy.get('.notification-close').click()
    })

    it('login can be opened by clicking link on signup', function() {
      cy.get('.links-login').contains('Sign in').click()
      cy.contains('Forgot password?')
    })

    it('signup can be opened by clicking link on login page', function() {
      cy.contains('Sign up').click()
      cy.contains('Already have an account?')
    })
  })

  describe('signup and verification process', function () { 
    it('signup sends email to user', function() {
      cy.get('#emailSignup')
        .type('kianga722@gmail.com')
      cy.get('#passwordSignup')
        .type('foobar')
      cy.get('#password2Signup')
        .type('foobar')
      cy.get('#signup .submit-button').click()
      cy.contains('An activation e-mail has been sent to you. You must activate before you can log in')
      cy.get('.notification-close').click()
    })

    it('verifies user with token and notifications disappear on logout', function() {
      cy.visit(`http://localhost:8888/verify/${tokenEmail}`)
      cy.contains('Email successfully verified!')
      cy.get('.notification-close').click()
      cy.contains('1 Rep Max Calculator')
      cy.contains('Sign Out').click()
      cy.get('.notifications').should('not.exist')
    })

    it('receive error when trying to resend activation email with empty input field', function () {
      cy.contains('Resend Email Confirmation').click()
      cy.get('#resendEmail .submit-button').click()
      cy.contains('Email is invalid')
      cy.get('.notification-close').click()
    })

    it('able to resend confirmation e-mails', function () {
      cy.get('#emailResend').type('kianga722@gmail.com')
      cy.get('#resendEmail .submit-button').click()
      cy.contains('Another activation e-mail has been sent to kianga722@gmail.com')
      cy.get('.notification-close').click()
    })
  })

  describe('forgot password process', function () { 
    it('receive error when trying to send forgot password with empty field', function() {
      cy.contains('Sign in').click()
      cy.contains('Forgot password').click()
      cy.contains('Send reset password email').click()
      cy.contains('Email is invalid')
      cy.get('.notification-close').click()
    })

    it('able to send forgot password', function () {
      cy.get('#emailForgot').type('kianga722@gmail.com')
      cy.contains('Send reset password email').click()
      cy.contains('A password reset e-mail has been sent to kianga722@gmail.com')
      cy.get('.notification-close').click()
    })

    it('receive error trying to submit reset password with no input', function () {
      cy.visit(`http://localhost:8888/reset/${tokenForgot}`)
      cy.contains('Reset Password for foobar@bar.com')
      cy.contains('Update Password').click()
      cy.contains('Please fill in all fields')
      cy.get('.notification-close').click()
    })

    it('able to reset password', function () {
      cy.get('#passwordForgot').type('barfoo')
      cy.get('#password2Forgot').type('barfoo')
      cy.contains('Update Password').click()
      cy.contains('Success! Your password has been changed')
      cy.get('.notification-close').click()
    })

    it('old password does not work and new one does', function () {
      cy.get('#email').type('foobar@bar.com')
      cy.get('#password').type('foobar')
      cy.get('#login .submit-button').click()
      cy.contains('Password incorrect')
      cy.get('.notification-close').click()
      cy.get('#password').type('barfoo')
      cy.get('#login .submit-button').click()
      cy.contains('1 Rep Max Calculator')
    })
  })

  describe('verification and password reset fails on user that is logged in', function () { 
    it('receive error when trying to verify email and user is logged in', function () {
      cy.visit(`http://localhost:8888`)
      cy.contains('Sign in').click()
      cy.get('#email').type('foobar@bar.com')
      cy.get('#password').type('barfoo')
      cy.get('#login .submit-button').click()
      cy.contains('1 Rep Max Calculator')
      cy.visit(`http://localhost:8888/verify/${tokenEmail}`)
      cy.contains('Cannot verify a user while another user is already signed in')
      cy.get('.notification-close').click()
      cy.contains('531Workout').click()
      cy.get('.notifications').should('not.exist')
      cy.visit(`http://localhost:8888/reset/${tokenForgot}`)
      cy.contains('Cannot reset password while another user is signed in')
    })


  })


})
