/// <reference types="cypress"/>

import { RESULTS_SELECTORS } from "../selectors/selectors";


class Results {

    /**
     * Internal helper method to get an element by locator, ensure visibility,
     * and verify that its text content contains the expected text substring.
     * @param locator The CSS selector for the element to verify.
     * @param text The expected substring of text content.
     */
    private verifyText(locator: string, text: string): void {
        cy.log(`Verifying text for locator: ${locator}`);

        cy.get(locator)
            .should('be.visible')
            .and('contain.text', text);
    }

    /**
     * Verifies that a specific section of the page contains a certain text substring.
     * Useful for checking titles, headings, or other static text within a defined section.
     * @param locator The CSS selector for the section element to verify.
     * @param text The expected substring of text content within the section.
     */
    shouldVerifyTextInSection(locator: string, text: string): void {
        cy.log('Verifying text in section');

        this.verifyText(locator, text);
    }

    /**
     * Verifies that the main page title element contains a specific text substring.
     * This typically refers to the main heading on the page (e.g., H1).
     * @param title The expected substring of text content in the page title.
     */
    shouldVerifyPageTitle(title: string): void {
        cy.log('Verifying page title');

        this.verifyText(RESULTS_SELECTORS.pageTitle, title);
    }

    /**
     * Verifies that a general page-level message element contains a specific text substring.
     * This is often used for success messages, info messages, or non-validation errors
     * that appear in a designated message area on the page.
     * @param text The expected substring of text content in the page message.
     */
    shouldVerifyPageMessage(text: string): void {
        cy.log('Verifying page message');

        this.verifyText(RESULTS_SELECTORS.pageMessage, text);
    }

    /**
     * Verifies that a Magento-specific error message element contains a specific text substring.
     * @param text The expected substring of text content in the Magento error message.
     */
    shouldVerifyMageErrorMessage(text: string): void {
        cy.log('Verifying mage error');

        this.verifyText(RESULTS_SELECTORS.mageErrorMessage, text);
    }
}

export const results = new Results();