/// <reference types="cypress"/>

import { RESULTS_SELECTORS } from "../selectors/selectors";


class Results {

    private verifyText(locator: string, text: string) {
        cy.log(`verifying text for locator: ${locator}`);

        cy.get(locator)
            .should('be.visible')
            .and('contain.text', text);
    }

    shouldVerifyTextInSection(locator: string, text: string) {
        cy.log('verifying text in section');

        this.verifyText(locator, text);
    }

    shouldVerifyPageTitle(title: string) {
        cy.log('verifying page title');

        this.verifyText(RESULTS_SELECTORS.pageTitle, title);
    }

    shouldVerifyPageMessage(text: string) {
        cy.log('verifying page message');

        this.verifyText(RESULTS_SELECTORS.pageMessage, text);
    }

    shouldVerifyMageErrorMessage(text: string) {
        cy.log('verifying mage error');

        this.verifyText(RESULTS_SELECTORS.mageErrorMessage, text);
    }
}

export const results = new Results();