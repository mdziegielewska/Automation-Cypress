/// <reference types="cypress"/>

import { LISTING_SELECTORS } from "../selectors/listingSelectors";


class Widgets {

    /**
     * Retrieves the product items within the grid widget section.
     * @returns A Cypress chainable that yields the jQuery collection of product item elements in the grid widget.
     */
    getGridWidgetItems(): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('Getting grid widget product items');

        return cy.get(LISTING_SELECTORS.gridWidget)
            .should('be.visible')
            .find(LISTING_SELECTORS.productItem);
    }

    /**
     * Verifies that the number of elements matched by a selector is equal to a specific number.
     * This can be used to check counts of products, widget blocks, etc.
     * @param section The CSS selector for the elements to count.
     * @param number The exact expected number of elements.
     */
    shouldVerifyNumberOfElements(section: string, expectedNumber: number): void {
        cy.log(`Verifying number of elements for selector ${section}`);

        cy.get(section)
            .should('have.length', expectedNumber);
    }

    /**
     * Clicks on a specific element within a collection (identified by index)
     * and verifies that the browser navigates to a URL containing a specific substring.
     * @param elementSelector The CSS selector for the collection of elements (e.g., widget blocks, product items).
     * @param index The zero-based index of the element within the collection to click.
     * @param urlSubstring The substring expected to be present in the URL after clicking.
     */
    shouldVerifyUrlOnClick(element: string, index: number, url: string): void {
        cy.log(`Verifying redirection URL for element at index ${index}`);

        cy.get(element)
            .eq(index)
            .click();

        cy.url().should('include', url);
    }

    /**
     * Verifies the information text of a specific widget element within a collection, identified by its index.
     * @param index The zero-based index of the widget element to verify the info for.
     * @param info The expected substring of the information text.
     */
    shouldVerifyWidgetInfo(index: number, info: string): void {
        cy.log(`Verifying info text for widget at index ${index}`);

        cy.get(LISTING_SELECTORS.info)
            .eq(index)
            .and('contain', info);
    }

    /**
     * Verifies that the number of items in a specified element has changed by a given amount.
     * @param {string} selector - The CSS selector of the element whose count is being verified.
     * @param {number} initialCount - The original number of items.
     * @param {number} expectedChange - The expected change in item count (positive or negative).
     */
    verifyCountChange(selector: string, initialCount: number, expectedChange: number): void {
        cy.log(`Verifying change in item count from ${initialCount} to ${expectedChange}.`);

        this.shouldVerifyNumberOfElements(
            selector,
            initialCount + expectedChange
        );
    }
}

export const widgets = new Widgets();