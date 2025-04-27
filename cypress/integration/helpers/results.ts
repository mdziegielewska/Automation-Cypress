/// <reference types="cypress"/>

class Results {

    private verifyText(locator: string, text: string) {
        cy.log(`Verifying text for locator: ${locator}`);

        cy.get(locator)
            .should('be.visible')
            .and('contain.text', text);
    }

    shouldVerifyTextInSection(locator: string, text: string) {
        this.verifyText(locator, text);
    }

    shouldVerifyPageTitle(title: string) {
        this.verifyText('.page-title', title);
    }

    shouldVerifyPageMessage(text: string) {
        this.verifyText('.message', text);
    }

    shouldVerifyMageErrorMessage(text: string) {
        this.verifyText('.mage-error', text);
    }
}

export const results = new Results();