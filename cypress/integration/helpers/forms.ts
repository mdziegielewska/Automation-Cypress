/// <reference types="cypress"/>

class Forms {
    fillField(field: string, value: string) {
        cy.log('filling form field');

        cy.get(`#${field}`)
            .type(value);
    }

    submit(action: string) {
        cy.log('submitting form');

        cy.get('button[type="submit"]')
            .filter(`.${action}`)
            .should('be.visible')
            .click();
    }
}

export const forms = new Forms();