/// <reference types="cypress"/>

import { GALLERY_SELECTORS } from '../selectors/selectors'; // dopasuj ścieżkę!

const arrows = ['prev', 'next'] as const;


class Gallery {

    getGallery() {
        return cy.get(GALLERY_SELECTORS.productMedia)
            .find(GALLERY_SELECTORS.galleryPlaceholder)
            .should('be.visible');
    }

    verifyArrowScrolling() {
        for (const arrow of arrows) {
            cy.log(`verifying ${arrow} arrow scrolling`);

            cy.get(GALLERY_SELECTORS.arrow(arrow)).click();
            cy.get(GALLERY_SELECTORS.activeImage)
                .should('be.visible');
        }
    }
}

export const gallery = new Gallery();