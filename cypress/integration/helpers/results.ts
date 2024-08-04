/// <reference types="cypress"/>

class Results {
    shouldVerifyTextInSection(locator: string, text: string) {
        cy.log('should verify text in section');
        
        cy.get(locator)
            .should('be.visible')
            .should('contain.text', text);
    }

    shouldVerifyAlert(text: string) {
        cy.log('should verify page messages');
        
        cy.get('.page.messages')
            .should('be.visible')
            .should('contain.text', text);
    }
}

export const results = new Results();