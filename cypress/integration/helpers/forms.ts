/// <reference types="cypress"/>

class Forms {
    submit(action: string) {
        cy.log('submitting form');

        cy.get('button[type="submit"]')
            .filter(`.${action}`)
            .should('be.visible')
            .click();
    }

    search() {
        cy.get('.actions-toolbar')
            .find(`.search`)
            .should('be.visible')
            .click();
    }

    fillField(field: string, value: string) {
        cy.log('filling form field');

        cy.get(`#${field}`)
            .type(value);
    }
}

export const forms = new Forms();