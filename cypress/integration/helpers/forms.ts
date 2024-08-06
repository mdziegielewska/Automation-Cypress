/// <reference types="cypress"/>

class Forms {
    submit(action: string) {
        cy.log('submitting form');

        cy.get('button[type="submit"]')
            .filter(`.${action}`)
            .should('be.visible')
            .click();
    }

    fillField(field: string, value: string) {
        cy.log('filling form field');

        cy.get(`#${field}`)
            .should('have.attr', 'aria-required', 'true')
            .type(value);
    }
}

export const forms = new Forms();