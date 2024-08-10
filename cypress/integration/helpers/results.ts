/// <reference types="cypress"/>

class Results {
    shouldVerifyTextInSection(locator: string, text: string) {
        cy.log('verifying text in section');
        
        cy.get(locator)
            .should('be.visible')
            .should('contain.text', text);
    }

    shouldVerifyPageTitle(title: string) {
        cy.log('verifying page title');
        
        cy.get('.page-title')
            .should('be.visible')
            .should('contain.text', title);
    }

    shouldVerifyPageMessage(text: string) {
        cy.log('verifying page message');
        
        cy.get('.message')
            .should('be.visible')
            .should('contain.text', text);
    } 

    shouldVerifyMageErrorMessage(text: string) {
        cy.log('verifying mage error message');

        cy.get('.mage-error')
            .should('be.visible')
            .should('contain.text', text);
    }
} 

export const results = new Results();