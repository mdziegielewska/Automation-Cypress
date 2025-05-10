/// <reference types="cypress"/>

import { PRODUCT_SELECTORS } from '../selectors/productSelectors';

const arrows = ['prev', 'next'] as const;


class Gallery {

    /**
     * Retrieves the main container element for the product media gallery.
     * @returns A Cypress chainable that yields the jQuery collection of the gallery placeholder element.
     */
    getGallery(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(PRODUCT_SELECTORS.productMedia)
            .find(PRODUCT_SELECTORS.galleryPlaceholder)
            .should('be.visible');
    }

    /**
     * Verifies the functionality of the gallery navigation arrows (previous and next).
     * Iterates through the defined arrow directions, clicks each arrow, and asserts
     * that an active image remains visible, indicating successful navigation.
     */
    verifyArrowScrolling(): void {
        for (const arrow of arrows) {
            cy.log(`Verifying ${arrow} Arrow scrolling`);

            cy.get(PRODUCT_SELECTORS.arrow(arrow)).click();
            cy.get(PRODUCT_SELECTORS.activeImage).should('be.visible');
        }
    }
}

export const gallery = new Gallery();