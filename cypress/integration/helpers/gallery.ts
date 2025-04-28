/// <reference types="cypress"/>

import { PRODUCT_SELECTORS } from '../selectors/selectors'; // dopasuj ścieżkę!

const arrows = ['prev', 'next'] as const;


class Gallery {

    getGallery() {
        return cy.get(PRODUCT_SELECTORS.productMedia)
            .find(PRODUCT_SELECTORS.galleryPlaceholder)
            .should('be.visible');
    }

    verifyArrowScrolling() {
        for (const arrow of arrows) {
            cy.log(`verifying ${arrow} arrow scrolling`);

            cy.get(PRODUCT_SELECTORS.arrow(arrow)).click();
            cy.get(PRODUCT_SELECTORS.activeImage)
                .should('be.visible');
        }
    }
}

export const gallery = new Gallery();