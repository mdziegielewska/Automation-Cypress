/// <reference types="cypress"/>

class Authorization {
    fillInLogInData(email: string, password: string) {
        cy.log('filling in user data');

        cy.get('input[title="Email"]')
            .should('have.attr', 'aria-required', 'true')
            .type(email);

        cy.get('input[title="Password"]')
            .should('have.attr', 'aria-required', 'true')
            .type(password);
    }
}

export const authorization = new Authorization();