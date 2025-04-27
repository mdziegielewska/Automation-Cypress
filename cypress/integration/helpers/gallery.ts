/// <reference types="cypress"/>

const arrows = ['prev', 'next']

class Gallery {
    getGallery() {
        return  cy.get('.product.media')
            .find('.gallery-placeholder')
            .should('be.visible');
    }

    verifyArrowScrolling() {
        cy.log('verifying arrow scrolling');

        for(const arrow of arrows) {
            cy.get(`.fotorama__arr--${arrow}`).click();
            cy.get('.fotorama__stage__frame.fotorama__active img')
                .should('be.visible');
        }
      }
}

export const gallery = new Gallery();