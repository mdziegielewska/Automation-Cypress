/// <reference types="cypress"/>

class Authorization {
    fillInlogInData(username: string, password: string) {
        cy.log('filling in user data');

        cy.get('input[title="Email"]')
            .type(username);

        cy.get('input[title="Password"]')
            .type(password);
    }
}

export const authorization = new Authorization();