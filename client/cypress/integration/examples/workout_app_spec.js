describe('Workout', function () {
  before(function () {
    cy.clearCookies()
    Cypress.LocalStorage.clear = function (keys, ls, rs) {
      return;
    }
    
    cy.request('POST', 'http://localhost:8888/.netlify/functions/testing/reset')
    const user = {
      email: 'foo@bar.com',
      password: 'foobar',
      approved: true
    }
    const user2 = {
      email: 'foobarman@bar.com',
      password: 'foobar2',
      approved: true
    }
    cy.request('POST', 'http://localhost:8888/.netlify/functions/testing/createUser', user)
    cy.request('POST', 'http://localhost:8888/.netlify/functions/testing/createUser', user2)
    cy.visit('http://localhost:8888')
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('jwt')
  })

  describe('user can login', function () { 
    it('front page can be opened', function() {
      cy.contains('TRY A DEMO WORKOUT BELOW')
    })

    it('user can login', function() {
      cy.contains('Sign in')
        .click()
      cy.get('#email')
        .type('foo@bar.com')
      cy.get('#password')
        .type('foobar')
      cy.get('#login .submit-button')
        .click()
       cy.contains('Logged in as:')
      cy.contains('foo@bar.com')
    })
  })

  describe('user can login, setup their workout, and save values', function () {
    it('RM values can be entered and TM values are correctly calculated', function() {
      cy.get('#squat-calc .exercise-one-rm input')
        .type('238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input')
        .type('143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input')
        .type('206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input')
        .type('84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')
    })

    it('workout content appears after all exercise TM values entered', function() {
      cy.get('.after-rmtm-complete').should(
        'exist')
    })

    it('exercise row for an exercise has correct values', function () {
      cy.get('.exercise-row span:nth-of-type(1)').contains('40%')
      cy.get('.exercise-row span:nth-of-type(2)').contains('85')
      cy.get('.exercise-row span:nth-of-type(3)').contains('5')
      cy.get('.exercise-row span:nth-of-type(4)').contains('20')
    })

    it('able to add assistance workouts', function() {
      cy.get('.assist-setCount input').type('10')
      cy.get('.assist-repCount input').type('5')
      cy.get('.add-assist-wrapper .add-button').click()
      cy.contains('Pushups 10x5 added')
      cy.get('.notification-close').click()
      cy.get('.assist-input-wrapper input').should('have.length', 10)

      cy.get('.add-assist-wrapper select').select('Chinups')
      cy.get('.add-assist-wrapper .add-button').click()
      cy.contains('Chinups 10x5 added')
      cy.get('.notification-close').click()
      cy.get('.assist-input-wrapper input').should('have.length', 20)

      cy.get('.add-assist-wrapper select').select('Leg Raises')
      cy.get('.add-assist-wrapper .add-button').click()
      cy.contains('Leg Raises 10x5 added')
      cy.get('.notification-close').click()
      cy.get('.assist-input-wrapper input').should('have.length', 30)
    })

    it('should have correct exercise for Workout #1', function () {
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
    })

    it('able to enter reps done for each exercise and save', function () {
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(4) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(5) input').type(3)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(6) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(7) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(8) input').type(8)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(1)').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(2)').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(3)').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(4)').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(5)').type(5)

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(4) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(5) input').type(3)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(6) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(7) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(8) input').type(8)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(1)').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(2)').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(3)').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(4)').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(5)').type(5)

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(1)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(2)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(3)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(4)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(5)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(6)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(7)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(8)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(9)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(10)').type(5)

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(1)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(2)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(3)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(4)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(5)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(6)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(7)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(8)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(9)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(10)').type(5)

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(1)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(2)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(3)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(4)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(5)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(6)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(7)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(8)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(9)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(10)').type(5)

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #1 saved')
      cy.get('.notification-close').click()
    })
  })

  describe('user can proceed to next workout', function () { 
    it('can proceed to next workout using current', function () {
      cy.contains('Current').click()
      cy.contains('Workout #2')
    })

    it('next workouts should have correct exercises', function () {
      cy.contains('Current').click()
      cy.contains('Workout #2')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')
    })

    it('next workout has RMTM values saved and Chinups turn into Pullups', function () {
      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
    })

    it('can proceed to next workout using next', function () {
      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #2 saved')
      cy.get('.notification-close').click()
      cy.contains('Next').click()
      cy.contains('Workout #3')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
    })

    it('next workout has RMTM values saved and Pullups turn into Chinups', function () {
      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
    })

  })

  describe('user inputs are saved on refresh', function () { 
    it('able to enter reps done for each exercise and save', function () {
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(4) input').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(2)').type(5)

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(5) input').type(3)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(8) input').type(8)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(4)').type(5)
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(5)').type(5)

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(4)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(7)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(10)').type(5)

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(8)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(9)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(10)').type(5)

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(1)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(2)').type(5)
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(10)').type(5)

      cy.reload()

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(4) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(2)').should('have.attr', 'value', '5')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(5) input').should('have.attr', 'value', '3')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(8) input').should('have.attr', 'value', '8')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(4)').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(5)').should('have.attr', 'value', '5')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(4)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(7)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(10)').should('have.attr', 'value', '5')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(8)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(9)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(10)').should('have.attr', 'value', '5')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(1)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(2)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(10)').should('have.attr', 'value', '5')
    })
  })

  describe('user can logout and other user can login', function () { 
    it('user can logout', function() {
      cy.contains('Sign Out').click()
      cy.contains('Forgot password?')
    })

    it('other user can login', function() {
      cy.get('#email')
        .type('foobarman@bar.com')
      cy.get('#password')
        .type('foobar2')
      cy.get('#login .submit-button')
        .click()
      cy.contains('Logged in as:')
      cy.contains('foobarman@bar.com')
    })

    it('other user that is new is on workout #1 and empty workout inputs', function() {
      cy.get('.after-rmtm-complete').should(
        'not.exist')
      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '')
    })

    it('other user can save a workout', function () {
      cy.get('.after-rmtm-complete').should(
        'not.exist')
      
      cy.get('#squat-calc .exercise-one-rm input')
        .type('155')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '140')
      cy.get('#bench-calc .exercise-one-rm input')
        .type('245')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '220')
      cy.get('#deadlift-calc .exercise-one-rm input')
        .type('500')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '450')
      cy.get('#opress-calc .exercise-one-rm input')
        .type('60')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '55')
      cy.get('.after-rmtm-complete').should(
        'exist')
      
      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #1 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()
      cy.contains('Workout #2')
    })
  })

  describe('original user can login and will start on latest workout', function () { 
    it('other user can logout', function() {
      cy.contains('Sign Out').click()
      cy.contains('Forgot password?')
    })

    it('original user can login', function() {
      cy.get('#email')
        .type('foo@bar.com')
      cy.get('#password')
        .type('foobar')
      cy.get('#login .submit-button')
        .click()
      cy.contains('Logged in as:')
      cy.contains('foo@bar.com')
    })

    it('original user starts on latest workout', function() {
      cy.contains('Workout #3')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
    })
  })

  describe('original user can navigate through previous workouts and also edit previous workouts', function () { 
    it('can navigate to previous workouts and previous inputs are saved', function () {
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(4) input').type(5)

      cy.contains('Previous').click()
      cy.contains('Workout #2')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(4) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(5) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(6) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(7) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(8) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(1)').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(2)').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(3)').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(4)').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(5)').should('have.attr', 'value', '')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(4) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(5) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(6) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(7) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(8) input').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(1)').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(2)').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(3)').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(4)').should('have.attr', 'value', '')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(5)').should('have.attr', 'value', '')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(1)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(2)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(3)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(4)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(5)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(6)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(7)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(8)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(9)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(10)').should('have.attr', 'value', '')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(1)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(2)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(3)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(4)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(5)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(6)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(7)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(8)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(9)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(10)').should('have.attr', 'value', '')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(1)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(2)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(3)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(4)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(5)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(6)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(7)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(8)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(9)').should('have.attr', 'value', '')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(10)').should('have.attr', 'value', '')
    })

    it('can navigate to first workout and previous inputs are saved', function() {
      cy.contains('Previous').click()
      cy.contains('Workout #1')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(4) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(5) input').should('have.attr', 'value', '3')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(6) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(7) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(8) input').should('have.attr', 'value', '8')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(1)').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(2)').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(3)').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(4)').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(5)').should('have.attr', 'value', '5')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(4) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(5) input').should('have.attr', 'value', '3')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(6) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(7) input').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(8) input').should('have.attr', 'value', '8')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(1)').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(2)').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(3)').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(4)').should('have.attr', 'value', '5')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(9) input:nth-child(5)').should('have.attr', 'value', '5')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(1)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(2)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(3)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(4)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(5)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(6)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(7)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(8)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(9)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) input:nth-child(10)').should('have.attr', 'value', '5')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(1)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(2)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(3)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(4)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(5)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(6)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(7)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(8)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(9)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) input:nth-child(10)').should('have.attr', 'value', '5')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(1)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(2)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(3)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(4)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(5)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(6)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(7)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(8)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(9)').should('have.attr', 'value', '5')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) input:nth-child(10)').should('have.attr', 'value', '5')
    })

    it('can save an input to a previous workout', function () {
      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #2')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(8) input').type(9)
      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #2 saved')
      cy.get('.notification-close').click()
    })

    it('current workout inputs are saved', function () {
      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #3')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(4) input').should('have.attr', 'value', '5')
    })

    it('previous workout inputs are saved', function () {
      cy.contains('Previous').click()

      cy.wait(2000)

      cy.contains('Workout #2')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(8) input').should('have.attr', 'value', '9')
    })

    it('previous workout new inputs are not saved if user does not save it', function () {
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(4)').type(5)

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #3')
      cy.contains('Previous').click()

      cy.wait(2000)

      cy.contains('Workout #2')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(9) input:nth-child(4)').should('have.attr', 'value', '')
    })
  })

  describe('user workouts increment weight as expected', function () { 

    it('verifies current workout', function () {
      cy.contains('Current').click()

      cy.wait(2000)

      cy.contains('Workout #3')

      cy.get('.cycle').contains('1')
      cy.get('.week').contains('1')
      cy.get('.section').contains('3')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #3 saved')
      cy.get('.notification-close').click()
    })

    it('verifies next 6 workouts before TM increase', function () {
      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #4')
  
      cy.get('.cycle').contains('1')
      cy.get('.week').contains('2')
      cy.get('.section').contains('1')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #4 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #5')
  
      cy.get('.cycle').contains('1')
      cy.get('.week').contains('2')
      cy.get('.section').contains('2')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #5 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #6')
  
      cy.get('.cycle').contains('1')
      cy.get('.week').contains('2')
      cy.get('.section').contains('3')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #6 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #7')
  
      cy.get('.cycle').contains('1')
      cy.get('.week').contains('3')
      cy.get('.section').contains('1')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #7 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #8')
  
      cy.get('.cycle').contains('1')
      cy.get('.week').contains('3')
      cy.get('.section').contains('2')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #8 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #9')
  
      cy.get('.cycle').contains('1')
      cy.get('.week').contains('3')
      cy.get('.section').contains('3')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '127.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '185')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '75')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #9 saved')
      cy.get('.notification-close').click()
    })

    it('TM increases on 10th workout', function () {
      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #10')

      cy.get('.cycle').contains('2')
      cy.get('.week').contains('1')
      cy.get('.section').contains('1')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '225')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '132.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '195')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #10 saved')
      cy.get('.notification-close').click()
    })

    it('verifies next 8 workouts before TM increase', function () {
      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #11')

      cy.get('.cycle').contains('2')
      cy.get('.week').contains('1')
      cy.get('.section').contains('2')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '225')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '132.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '195')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #11 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #12')

      cy.get('.cycle').contains('2')
      cy.get('.week').contains('1')
      cy.get('.section').contains('3')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '225')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '132.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '195')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #12 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #13')

      cy.get('.cycle').contains('2')
      cy.get('.week').contains('2')
      cy.get('.section').contains('1')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '225')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '132.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '195')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #13 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #14')

      cy.get('.cycle').contains('2')
      cy.get('.week').contains('2')
      cy.get('.section').contains('2')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '225')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '132.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '195')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #14 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #15')

      cy.get('.cycle').contains('2')
      cy.get('.week').contains('2')
      cy.get('.section').contains('3')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '225')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '132.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '195')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #15 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #16')

      cy.get('.cycle').contains('2')
      cy.get('.week').contains('3')
      cy.get('.section').contains('1')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '225')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '132.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '195')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #16 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #17')

      cy.get('.cycle').contains('2')
      cy.get('.week').contains('3')
      cy.get('.section').contains('2')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '225')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '132.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '195')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #17 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #18')

      cy.get('.cycle').contains('2')
      cy.get('.week').contains('3')
      cy.get('.section').contains('3')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '225')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '132.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '195')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #18 saved')
      cy.get('.notification-close').click()
    })

    it('TM increases on 19th workout', function () {
      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #19')

      cy.get('.cycle').contains('3')
      cy.get('.week').contains('1')
      cy.get('.section').contains('1')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '235')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '137.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '205')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '85')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #19 saved')
      cy.get('.notification-close').click()
    })

    it('verifies next 8 workouts before TMTesting week', function () {
      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #20')

      cy.get('.cycle').contains('3')
      cy.get('.week').contains('1')
      cy.get('.section').contains('2')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '235')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '137.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '205')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '85')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #20 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #21')

      cy.get('.cycle').contains('3')
      cy.get('.week').contains('1')
      cy.get('.section').contains('3')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '235')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '137.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '205')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '85')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #21 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #22')

      cy.get('.cycle').contains('3')
      cy.get('.week').contains('2')
      cy.get('.section').contains('1')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '235')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '137.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '205')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '85')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #22 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #23')

      cy.get('.cycle').contains('3')
      cy.get('.week').contains('2')
      cy.get('.section').contains('2')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '235')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '137.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '205')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '85')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #23 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #24')

      cy.get('.cycle').contains('3')
      cy.get('.week').contains('2')
      cy.get('.section').contains('3')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '235')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '137.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '205')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '85')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('70%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #24 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #25')

      cy.get('.cycle').contains('3')
      cy.get('.week').contains('3')
      cy.get('.section').contains('1')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '235')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '137.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '205')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '85')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #25 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #26')

      cy.get('.cycle').contains('3')
      cy.get('.week').contains('3')
      cy.get('.section').contains('2')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '235')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '137.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '205')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '85')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Overhead Press')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #26 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #27')

      cy.get('.cycle').contains('3')
      cy.get('.week').contains('3')
      cy.get('.section').contains('3')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '235')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '137.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '205')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '85')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('95%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('75%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #27 saved')
      cy.get('.notification-close').click()
    })

  })

  describe('TMTesting week calculates following workout weights as expected', function () {

    it('allows user to pass all TMTesting exercises in the week', function () { 
      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #28')
  
      cy.get('.cycle').contains('4')
      cy.get('.week').contains('1')
      cy.get('.section').contains('1')
  
      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '245')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '142.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '90')
  
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Overhead Press')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('100%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) input').type(3)
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(10) span:nth-child(1)').contains('70%')
  
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('100%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) input').type(4)
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(10) span:nth-child(1)').contains('70%')
  
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')
  
      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #28 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #29')
  
      cy.get('.cycle').contains('4')
      cy.get('.week').contains('1')
      cy.get('.section').contains('2')
  
      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '245')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '142.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '90')
  
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('100%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) input').type(7)
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(10) span:nth-child(1)').contains('70%')
  
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')
  
      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #29 saved')
      cy.get('.notification-close').click()

      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #30')
  
      cy.get('.cycle').contains('4')
      cy.get('.week').contains('1')
      cy.get('.section').contains('3')
  
      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '245')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '142.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '90')
  
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Deadlift')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('70%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('80%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('90%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('100%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) input').type(8)
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(10) span:nth-child(1)').contains('70%')
  
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Pullups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')
  
      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #30 saved')
      cy.get('.notification-close').click()
    })

    it('Cycle after TMTesting week keeps all weight values ', function () {
      cy.contains('Next').click()

      cy.wait(2000)

      cy.contains('Workout #31')

      cy.get('.cycle').contains('1')
      cy.get('.week').contains('1')
      cy.get('.section').contains('1')
  
      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '245')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '142.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '90')

      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-title').contains('Squat')
      cy.get('#workout-session .exercise-wrapper:nth-child(1) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-title').contains('Bench')
      cy.get('#workout-session .exercise-wrapper:nth-child(2) .exercise-row:nth-child(3) span:nth-child(1)').contains('40%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(4) span:nth-child(1)').contains('50%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(5) span:nth-child(1)').contains('60%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(6) span:nth-child(1)').contains('65%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(7) span:nth-child(1)').contains('75%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(8) span:nth-child(1)').contains('85%')
      cy.get('#workout-session .exercise-wrapper:nth-child(2)  .exercise-row:nth-child(9) span:nth-child(1)').contains('65%')

      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(1) .assist-name').contains('Pushups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(2) .assist-name').contains('Chinups')
      cy.get('.assistance-wrapper .assist-exercise-wrapper:nth-child(3) .assist-name').contains('Leg Raises')
    })

    it('Going back and failing an exercise in TMTesting week will not cause a recalculation unless the Recalculate button is clicked', function () {
      cy.contains('Previous').click()

      cy.wait(2000)

      cy.contains('Workout #30')
      cy.contains('Previous').click()

      cy.wait(2000)

      cy.contains('Workout #29')
      cy.contains('Previous').click()

      cy.wait(2000)

      cy.contains('Workout #28')

      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('100%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) input').clear()
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) input').type(1)

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #28 saved')
      cy.get('.notification-close').click()

      cy.contains('Current').click()

      cy.wait(2000)

      cy.contains('Workout #31')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '245')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '142.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '84')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '90')

      cy.contains('Recalculate').click()

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '245')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '142.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '90')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')
    })

    it('Going back and failing a different exercise in TMTesting week will not cause a recalculation unless the Recalculate button is clicked', function () {
      cy.contains('Previous').click()

      cy.wait(2000)

      cy.contains('Workout #30')

      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) span:nth-child(1)').contains('100%')
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) input').clear()
      cy.get('#workout-session .exercise-wrapper:nth-child(1)  .exercise-row:nth-child(9) input').type(2)

      cy.get('#finish-options .done-button').click()
      cy.contains('Workout #30 saved')
      cy.get('.notification-close').click()

      cy.contains('Current').click()

      cy.wait(2000)

      cy.contains('Workout #31')

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '245')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '142.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '206')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '215')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '90')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')

      cy.contains('Recalculate').click()

      cy.get('#squat-calc .exercise-one-rm input').should('have.attr', 'value', '238')
      cy.get('#squat-calc .exercise-tm input').should('have.attr', 'value', '245')
      cy.get('#bench-calc .exercise-one-rm input').should('have.attr', 'value', '143')
      cy.get('#bench-calc .exercise-tm input').should('have.attr', 'value', '142.5')
      cy.get('#deadlift-calc .exercise-one-rm input').should('have.attr', 'value', '221')
      cy.get('#deadlift-calc .exercise-tm input').should('have.attr', 'value', '200')
      cy.get('#opress-calc .exercise-one-rm input').should('have.attr', 'value', '90')
      cy.get('#opress-calc .exercise-tm input').should('have.attr', 'value', '80')
    })
      
    



  })



})
