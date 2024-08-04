/// <reference types="cypress"/>

import { routes } from "./routes";

class Forms {
    submit() {
        cy.log('submitting form');

        cy.get('button[name="send"]')
            .first()
            .should('be.visible')
            .click();
    }
}

export const forms = new Forms();