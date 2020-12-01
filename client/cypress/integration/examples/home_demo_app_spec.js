describe('Home Demo', function () {
  before(function () {
    cy.visit('http://localhost:8888')
  })

  describe('not logged in user home demo page', function () { 
    it('front page can be opened', function() {
      cy.contains('TRY A DEMO WORKOUT BELOW')
    })

    it('workout content does not appear without all exercise TM values entered', function() {
      cy.get('.after-rmtm-complete').should(
        'not.exist')
    })

    it('1RM calculator returns correct value for 1RM', function() {
      cy.contains('1 Rep Max Calculator')
      cy.get('.rm-calc-weight input')
        .type('225')
      cy.get('.rm-calc-reps input')
        .type('3')
      cy.contains('238')
    })

    it('TM calculator for each exercise returns correct value based on 1RM', function() {
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

    it('receive error when trying to add assistance exercise with no input', function() {
      cy.get('.add-assist-wrapper .add-button').click()
      cy.contains('Please fill in both Sets and Reps fields before adding an Assistance Exercise')
      cy.get('.notification-close').click()
    })

    it('able to add an assistance workout', function() {
      cy.get('.assist-setCount input').type('10')
      cy.get('.assist-repCount input').type('5')
      cy.get('.add-assist-wrapper .add-button').click()
      cy.contains('Pushups 10x5 added')
      cy.get('.notification-close').click()
      cy.get('.assist-input-wrapper input').should('have.length', 10)
    })

    it('receive error when trying to add same assistance exercise', function() {
      cy.get('.add-assist-wrapper .add-button').click()
      cy.contains('Pushups already added')
      cy.get('.notification-close').click()
    })

    it('able to add a different assistance workout', function() {
      cy.get('.add-assist-wrapper select').select('chinups')
      cy.get('.add-assist-wrapper .add-button').click()
      cy.contains('Chinups 10x5 added')
      cy.get('.notification-close').click()
      cy.get('.assist-input-wrapper input').should('have.length', 20)
    })

    it('able to delete an assistance exercise', function() {
      cy.get('.assist-input-wrapper input').should('have.length', 20)
      cy.get('#delete-chinups').click()
      cy.get('.yes-no-wrapper .button-yes').click()
      cy.get('.assist-input-wrapper input').should('have.length', 10)
    })

    it('able to type into reps completed inputs', function() {
      cy.get('.exercise-row input').first().type('5')
      cy.get('.exercise-row span').first().click()
      cy.get('.exercise-row input').first().should('have.attr', 'value', '5')
    })

  
  })


})
